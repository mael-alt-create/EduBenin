-- Progression anonyme : un appareil = un identifiant UUID, aucune donnée personnelle.
create table if not exists progress (
  device_id  uuid        not null,
  key        text        not null,
  points     int         not null check (points >= 0),
  created_at timestamptz not null default now(),
  primary key (device_id, key)
);
