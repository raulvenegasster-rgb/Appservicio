-- Esquema base para OfiBowlIDG
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'player',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weeks (
  id SERIAL PRIMARY KEY,
  number INTEGER UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  week_id INTEGER REFERENCES weeks(id) ON DELETE CASCADE,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  kickoff_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS games_week_match_idx
  ON games(week_id, home_team, away_team);

CREATE TABLE IF NOT EXISTS picks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  week_id INTEGER REFERENCES weeks(id) ON DELETE CASCADE,
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
  selected_team TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  week_id INTEGER REFERENCES weeks(id) ON DELETE CASCADE,
  game_id INTEGER UNIQUE REFERENCES games(id) ON DELETE CASCADE,
  winner TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_picks_timestamp'
  ) THEN
    CREATE TRIGGER update_picks_timestamp
      BEFORE UPDATE ON picks
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_results_timestamp'
  ) THEN
    CREATE TRIGGER update_results_timestamp
      BEFORE UPDATE ON results
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
  END IF;
END;
$$;
