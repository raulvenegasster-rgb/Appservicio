import dayjs from 'dayjs';
import { pool as defaultPool } from '../db/pool.js';
import { ensureWeekExists, getWeekGames } from '../services/week.service.js';

export async function savePicks(req, res, next) {
  try {
    const { week, selections } = req.body;
    if (!week || !selections || typeof selections !== 'object') {
      return res.status(400).json({ message: 'Información de picks incompleta' });
    }

    const data = await getWeekGames(week, req.user.id);
    if (!data.games.length) {
      return res.status(404).json({ message: 'No hay juegos para esta semana' });
    }

    const now = dayjs();
    const lockedGames = data.games.filter((game) => now.isAfter(dayjs(game.kickoff_time).subtract(1, 'hour')));
    if (lockedGames.length > 0) {
      const lockedIds = lockedGames.map((game) => game.id);
      for (const gameId of Object.keys(selections)) {
        if (lockedIds.includes(Number(gameId))) {
          return res.status(403).json({ message: 'Algunos juegos ya están bloqueados' });
        }
      }
    }

    const weekId = await ensureWeekExists(week);

    const pool = req.app.get('dbPool') || defaultPool;
    const clientConn = await pool.connect();
    try {
      await clientConn.query('BEGIN');

      for (const [gameId, team] of Object.entries(selections)) {
        const game = data.games.find((g) => g.id === Number(gameId));
        if (!game) {
          continue;
        }
        if (![game.home_team, game.away_team].includes(team)) {
          return res.status(400).json({ message: `Selección inválida para el juego ${gameId}` });
        }
        await clientConn.query(
          `INSERT INTO picks (user_id, week_id, game_id, selected_team)
           VALUES($1, $2, $3, $4)
           ON CONFLICT (user_id, game_id)
           DO UPDATE SET selected_team = EXCLUDED.selected_team, updated_at = NOW()`,
          [req.user.id, weekId, Number(gameId), team]
        );
      }

      await clientConn.query('COMMIT');
    } catch (error) {
      await clientConn.query('ROLLBACK');
      throw error;
    } finally {
      clientConn.release();
    }

    res.json({ message: 'Picks guardados', timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
}
