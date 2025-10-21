import { query } from '../db/pool.js';

export async function getRanking(_req, res, next) {
  try {
    const latestWeekResult = await query('SELECT MAX(week_id) AS week_id FROM results');
    const latestWeekId = latestWeekResult.rows[0]?.week_id;

    let weekly = [];
    if (latestWeekId) {
      const { rows } = await query(
        `SELECT u.id AS user_id,
                u.full_name,
                SUM(CASE WHEN r.winner = p.selected_team THEN 1 ELSE 0 END) AS points,
                MIN(p.updated_at) AS first_pick_timestamp,
                w.number AS week_number
           FROM picks p
           JOIN users u ON u.id = p.user_id
           JOIN results r ON r.game_id = p.game_id AND r.week_id = p.week_id
           JOIN weeks w ON w.id = p.week_id
          WHERE p.week_id = $1
          GROUP BY u.id, u.full_name, w.number
          ORDER BY points DESC, first_pick_timestamp ASC`,
        [latestWeekId]
      );
      weekly = rows;
    }

    const overallResult = await query(
      `SELECT u.id AS user_id,
              u.full_name,
              SUM(CASE WHEN r.winner = p.selected_team THEN 1 ELSE 0 END) AS total_points,
              MIN(p.updated_at) AS first_pick_timestamp
         FROM picks p
         JOIN users u ON u.id = p.user_id
         JOIN results r ON r.game_id = p.game_id AND r.week_id = p.week_id
        GROUP BY u.id, u.full_name
        ORDER BY total_points DESC, first_pick_timestamp ASC`
    );

    res.json({ weekly, overall: overallResult.rows });
  } catch (error) {
    next(error);
  }
}
