import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { getGamesByWeek, submitResults } from '../services/api.js';
import { toast } from 'sonner';

export default function AdminPanel() {
  const [week, setWeek] = useState(1);
  const [games, setGames] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getGamesByWeek(week);
        setGames(data.games);
        const existingResults = Object.fromEntries(
          (data.results || []).map((res) => [res.game_id, res.winner])
        );
        setResults(existingResults);
      } catch (error) {
        toast.error('No fue posible cargar la semana');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [week]);

  const handleSave = async () => {
    try {
      await submitResults({ week, results });
      toast.success('Resultados guardados y ranking actualizado');
    } catch (error) {
      toast.error(error.response?.data?.message || 'No fue posible guardar los resultados');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display tracking-wide">Panel de administración</h2>
          <p className="text-sm text-slate-300">Abre o cierra jornadas y registra resultados oficiales.</p>
        </div>
        <div className="flex items-center gap-3">
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
        <CardHeader>
          <CardTitle>Resultados de la semana</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && <p className="text-sm text-slate-300">Cargando juegos...</p>}
          {!loading && games.length === 0 && <p className="text-sm text-slate-300">No hay juegos configurados.</p>}
          {!loading &&
            games.map((game) => (
              <div key={game.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-white/5 rounded-lg p-4 bg-slate-900/60">
                <div>
                  <p className="text-sm text-slate-400">{game.away_team} @ {game.home_team}</p>
                  <p className="text-xs text-slate-500">Kickoff: {new Date(game.kickoff_time).toLocaleString('es-MX')}</p>
                </div>
                <select
                  className="bg-slate-900/60 border border-white/10 rounded-md px-3 py-2 text-sm"
                  value={results[game.id] || ''}
                  onChange={(e) => setResults((prev) => ({ ...prev, [game.id]: e.target.value }))}
                >
                  <option value="">Selecciona ganador</option>
                  {[game.away_team, game.home_team].map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cargar resultados por CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <p>Puedes pegar resultados en lote usando el siguiente formato:</p>
          <pre className="bg-black/40 p-3 rounded-md text-xs border border-white/10">
            game_id,winner
            101,San Francisco 49ers
          </pre>
          <Input
            placeholder="Pega aquí el CSV"
            onBlur={(event) => {
              const lines = event.target.value.trim().split('\n').slice(1);
              const parsed = {};
              lines.forEach((line) => {
                const [gameId, winner] = line.split(',');
                if (gameId && winner) {
                  parsed[Number(gameId.trim())] = winner.trim();
                }
              });
              setResults((prev) => ({ ...prev, ...parsed }));
              event.target.value = '';
              toast.success('Resultados cargados desde CSV temporal');
            }}
          />
          <Button onClick={handleSave}>Guardar resultados</Button>
        </CardContent>
      </Card>
    </div>
  );
}
