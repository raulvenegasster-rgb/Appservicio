import { useEffect, useMemo, useState } from 'react';
import { addHours, differenceInSeconds, format, isAfter, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { getGamesByWeek, submitPicks } from '../services/api.js';
import { toast } from 'sonner';

const DEFAULT_WEEK = 1;

export default function Dashboard() {
  const [week, setWeek] = useState(DEFAULT_WEEK);
  const [games, setGames] = useState([]);
  const [picks, setPicks] = useState({});
  const [deadline, setDeadline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getGamesByWeek(week);
        setGames(data.games);
        setPicks(data.userPicks || {});
        setDeadline(data.deadline);
      } catch (error) {
        toast.error('No fue posible obtener los juegos de esta semana');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [week]);

  const countdown = useCountdown(deadline);
  const isLocked = useMemo(() => !deadline || countdown.total <= 0, [deadline, countdown.total]);

  const handlePick = (gameId, selected) => {
    if (isLocked) return;
    setPicks((prev) => ({ ...prev, [gameId]: selected }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await submitPicks({ week, selections: picks });
      toast.success('Picks guardados correctamente');
    } catch (error) {
      toast.error(error.response?.data?.message || 'No fue posible guardar tus picks');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display tracking-wide">Tus picks</h2>
          <p className="text-sm text-slate-300">Selecciona los ganadores de cada partido antes de que cierre la jornada.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm">Semana</label>
          <select
            className="bg-slate-900/60 border border-white/10 rounded-md px-4 py-2 text-sm"
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
          >
            {Array.from({ length: 18 }, (_, idx) => idx + 1).map((num) => (
              <option key={num} value={num}>
                Semana {num}
              </option>
            ))}
          </select>
        </div>
      </header>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Cuenta regresiva</CardTitle>
            <p className="text-sm text-slate-300">
              El sistema bloquea automáticamente los picks una hora antes del kickoff del primer partido del jueves.
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-mono tracking-wider">
              {countdown.formatted}
            </p>
            <span className={`text-xs uppercase tracking-[0.3em] ${isLocked ? 'text-red-400' : 'text-green-400'}`}>
              {isLocked ? 'Bloqueado' : 'Abierto'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading && <p className="text-sm text-slate-300">Cargando juegos...</p>}
            {!loading && games.length === 0 && (
              <p className="text-sm text-slate-300">No hay juegos configurados para esta semana.</p>
            )}
            {!loading &&
              games.map((game) => {
                const kickoff = parseISO(game.kickoff_time);
                const locked = isAfter(new Date(), addHours(kickoff, -1));
                const userPick = picks[game.id];
                return (
                  <div
                    key={game.id}
                    className={`rounded-lg border border-white/10 p-4 bg-slate-900/60 flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${
                      locked ? 'opacity-70' : ''
                    }`}
                  >
                    <div>
                      <p className="text-sm text-slate-400">{format(kickoff, "EEEE d 'de' MMMM, HH:mm'h'", { locale: es })}</p>
                      <p className="text-lg font-semibold text-white">
                        {game.away_team} @ {game.home_team}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[game.away_team, game.home_team].map((team) => (
                        <button
                          key={team}
                          onClick={() => handlePick(game.id, team)}
                          disabled={locked || isLocked}
                          className={`px-4 py-2 rounded-md text-sm border border-white/10 transition-colors ${
                            userPick === team ? 'bg-secondary text-black' : 'hover:bg-white/10'
                          }`}
                        >
                          {team}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
          <Button onClick={handleSubmit} className="mt-6" disabled={isLocked || submitting}>
            {submitting ? 'Guardando...' : isLocked ? 'Picks bloqueados' : 'Guardar picks'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reglas rápidas</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-300 space-y-2">
          <p>
            • Puedes editar tus picks hasta una hora antes del kickoff del jueves. Después de ese punto se congelan y se conserva
            la última versión registrada.
          </p>
          <p>• Los desempates se definen por la marca de tiempo del último envío.</p>
          <p>• El panel de administración carga los resultados oficiales para generar el ranking semanal y acumulado.</p>
          <p>• Ante cualquier duda, escribe al equipo de Talento IDGS.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function useCountdown(deadline) {
  const [remaining, setRemaining] = useState(getRemaining(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getRemaining(deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return remaining;
}

function getRemaining(deadline) {
  if (!deadline) {
    return { total: 0, formatted: '00:00:00' };
  }
  const total = differenceInSeconds(parseISO(deadline), new Date());
  const clamped = Math.max(total, 0);
  const hours = String(Math.floor(clamped / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((clamped % 3600) / 60)).padStart(2, '0');
  const seconds = String(clamped % 60).padStart(2, '0');
  return {
    total: clamped,
    formatted: `${hours}:${minutes}:${seconds}`
  };
}
