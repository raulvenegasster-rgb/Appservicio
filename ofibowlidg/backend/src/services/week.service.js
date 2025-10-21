import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { query } from '../db/pool.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function getWeekGames(weekNumber, userId) {
  const gamesResult = await query(
    `SELECT g.id,
            g.week_id,
            g.home_team,
            g.away_team,
            g.kickoff_time AT TIME ZONE 'UTC' AS kickoff_time,
            w.number AS week_number
     FROM games g
     JOIN weeks w ON g.week_id = w.id
     WHERE w.number = $1
     ORDER BY g.kickoff_time ASC`,
    [weekNumber]
  );

  const games = gamesResult.rows.map((game) => ({
    ...game,
    kickoff_time: new Date(game.kickoff_time).toISOString()
  }));
  let userPicks = {};
  if (userId) {
    const picksResult = await query(
      `SELECT game_id, selected_team
         FROM picks p
         JOIN weeks w ON p.week_id = w.id
        WHERE w.number = $1 AND p.user_id = $2`,
      [weekNumber, userId]
    );
    userPicks = Object.fromEntries(picksResult.rows.map((pick) => [pick.game_id, pick.selected_team]));
  }

  const resultsResult = await query(
    `SELECT r.game_id, r.winner
       FROM results r
       JOIN weeks w ON r.week_id = w.id
      WHERE w.number = $1`,
    [weekNumber]
  );

  const results = resultsResult.rows;

  const deadline = calculateDeadline(games);

  return { games, deadline, userPicks, results };
}

export function calculateDeadline(games) {
  if (!games || games.length === 0) return null;
  const firstThursdayGame = games.find((game) => dayjs(game.kickoff_time).tz('UTC').day() === 4);
  const candidate = firstThursdayGame || games[0];
  const deadline = dayjs(candidate.kickoff_time).subtract(1, 'hour').toISOString();
  return deadline;
}

export async function ensureWeekExists(weekNumber) {
  const { rows } = await query('SELECT id FROM weeks WHERE number = $1', [weekNumber]);
  if (rows.length > 0) return rows[0].id;
  const insert = await query('INSERT INTO weeks(number) VALUES($1) RETURNING id', [weekNumber]);
  return insert.rows[0].id;
}
