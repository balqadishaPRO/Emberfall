-- Additive and safe to run again. Keep this database separate from app deploys.
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY,
  token_hash text NOT NULL UNIQUE,
  nickname text NOT NULL CHECK (char_length(nickname) BETWEEN 2 AND 24),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS records (
  player_id uuid PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  survived_ms integer NOT NULL CHECK (survived_ms BETWEEN 1 AND 86400000),
  kills integer NOT NULL CHECK (kills BETWEEN 0 AND 10000000),
  class_id text NOT NULL CHECK (class_id IN ('archer','fighter','assassin','mage','tank','healer','shapeshifter')),
  achieved_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS records_ranking ON records (survived_ms DESC, kills DESC, achieved_at, player_id);
