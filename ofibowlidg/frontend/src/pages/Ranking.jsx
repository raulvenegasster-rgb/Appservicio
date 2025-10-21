import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { fetchRanking } from '../services/api.js';
import { toast } from 'sonner';

export default function Ranking() {
  const [ranking, setRanking] = useState({ weekly: [], overall: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchRanking();
        setRanking(data);
      } catch (error) {
        toast.error('No fue posible obtener el ranking');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Ranking semanal</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-300">Cargando...</p>
          ) : (
            <ol className="space-y-3">
              {ranking.weekly.map((entry, index) => (
                <li key={entry.user_id} className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="text-sm font-bold text-secondary">#{index + 1}</span>
                    <span className="text-sm text-slate-200">{entry.full_name}</span>
                  </span>
                  <span className="text-sm text-slate-300">{entry.points} pts</span>
                </li>
              ))}
              {ranking.weekly.length === 0 && <p className="text-xs text-slate-400">Sin resultados registrados.</p>}
            </ol>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ranking acumulado</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-300">Cargando...</p>
          ) : (
            <ol className="space-y-3">
              {ranking.overall.map((entry, index) => (
                <li key={entry.user_id} className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="text-sm font-bold text-secondary">#{index + 1}</span>
                    <span className="text-sm text-slate-200">{entry.full_name}</span>
                  </span>
                  <span className="text-sm text-slate-300">{entry.total_points} pts</span>
                </li>
              ))}
              {ranking.overall.length === 0 && <p className="text-xs text-slate-400">Aún no hay acumulado.</p>}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
