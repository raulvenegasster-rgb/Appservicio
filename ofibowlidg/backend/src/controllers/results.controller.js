import { ensureWeekExists, getWeekGames } from '../services/week.service.js';
import { pool as defaultPool } from '../db/pool.js';

export async function saveResults(req, res, next) {
  try {
    const { week, results } = req.body;
    if (!week || !results || typeof results !== 'object') {
      return res.status(400).json({ message: 'Información de resultados incompleta' });
    }

    const data = await getWeekGames(week, req.user.id);
    if (!data.games.length) {
      return res.status(404).json({ message: 'No hay juegos configurados para esta semana' });
    }

    const weekId = await ensureWeekExists(week);

    const pool = req.app.get('dbPool') || defaultPool;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const [gameId, winner] of Object.entries(results)) {
        const game = data.games.find((g) => g.id === Number(gameId));
        if (!game) {
          continue;
        }
        if (![game.home_team, game.away_team].includes(winner)) {
          return res.status(400).json({ message: `Resultado inválido para el juego ${gameId}` });
        }
        await client.query(
          `INSERT INTO results (week_id, game_id, winner)
           VALUES ($1, $2, $3)
           ON CONFLICT (game_id)
           DO UPDATE SET winner = EXCLUDED.winner, updated_at = NOW()`,
          [weekId, Number(gameId), winner]
        );
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    res.json({ message: 'Resultados registrados' });
  } catch (error) {
    next(error);
  }
}
