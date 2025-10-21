import { getWeekGames } from '../services/week.service.js';

export async function getGamesByWeek(req, res, next) {
  try {
    const weekNumber = Number(req.params.num);
    const userId = req.user?.id || null;
    const data = await getWeekGames(weekNumber, userId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
