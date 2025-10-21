import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    title: 'Picks semanales',
    description: 'Registra tus predicciones cada semana y compite con tus compañeras y compañeros.',
    icon: '🏈'
  },
  {
    title: 'Cuenta regresiva',
    description: 'El sistema cierra automáticamente los picks una hora antes del kickoff.',
    icon: '⏱️'
  },
  {
    title: 'Ranking en vivo',
    description: 'Consulta tu posición semanal y acumulada, con desempate por tiempo de registro.',
    icon: '📊'
  }
];

export default function Landing() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1280&q=80')] opacity-20 bg-cover bg-center" />
      <div className="relative max-w-6xl mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
            ID Global Solutions
          </span>
          <h1 className="mt-6 text-5xl font-display tracking-wider leading-tight">
            Bienvenido a <span className="text-secondary">OfiBowlIDG</span>
          </h1>
          <p className="mt-6 text-lg text-slate-200 max-w-xl">
            La quiniela semanal de la NFL que une al talento de ID Global Solutions. Participa, predice y vive la emoción de cada
            jornada con una experiencia totalmente digital, segura y preparada para crecer.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/registro" className="flex items-center gap-2">
                Crear cuenta <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="#logos">Ver equipos</a>
            </Button>
          </div>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-xl border border-white/10 bg-slate-900/50 p-6 shadow-lg"
            >
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div id="logos" className="mt-16">
          <h2 className="text-2xl font-semibold">Todos los equipos, todos los logos</h2>
          <p className="text-sm text-slate-300 mt-2 max-w-3xl">
            Los recursos gráficos oficiales de la NFL se encuentran listos en la carpeta pública. Asegúrate de actualizarlos con
            los logos más recientes para mantener el branding alineado.
          </p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {TEAM_LOGOS.map((team) => (
              <div key={team.name} className="flex flex-col items-center gap-2 bg-slate-900/60 border border-white/5 rounded-xl p-4">
                <img src={team.logo} alt={team.name} className="h-12 object-contain" loading="lazy" />
                <p className="text-xs text-center text-slate-300">{team.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const TEAM_LOGOS = [
  'Arizona Cardinals',
  'Atlanta Falcons',
  'Baltimore Ravens',
  'Buffalo Bills',
  'Carolina Panthers',
  'Chicago Bears',
  'Cincinnati Bengals',
  'Cleveland Browns',
  'Dallas Cowboys',
  'Denver Broncos',
  'Detroit Lions',
  'Green Bay Packers',
  'Houston Texans',
  'Indianapolis Colts',
  'Jacksonville Jaguars',
  'Kansas City Chiefs',
  'Las Vegas Raiders',
  'Los Angeles Chargers',
  'Los Angeles Rams',
  'Miami Dolphins',
  'Minnesota Vikings',
  'New England Patriots',
  'New Orleans Saints',
  'New York Giants',
  'New York Jets',
  'Philadelphia Eagles',
  'Pittsburgh Steelers',
  'San Francisco 49ers',
  'Seattle Seahawks',
  'Tampa Bay Buccaneers',
  'Tennessee Titans',
  'Washington Commanders'
].map((name) => ({
  name,
  logo: `/images/teams/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
}));
