import pg from "pg";

export function createPgStore(connectionString) {
  const pool = new pg.Pool({ connectionString });
  return {
    async init(schemaSql) {
      await pool.query(schemaSql);
    },
    async progress(device) {
      const r = await pool.query("select key, points from progress where device_id = $1", [device]);
      return r.rows;
    },
    async award(device, key, points) {
      const r = await pool.query(
        "insert into progress (device_id, key, points) values ($1, $2, $3) on conflict do nothing",
        [device, key, points],
      );
      return r.rowCount > 0;
    },
  };
}
