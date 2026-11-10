import { readFileSync } from "node:fs";
import { createApp } from "./app.js";
import { createMemoryStore } from "./stores/memory.js";

const courses = JSON.parse(readFileSync(new URL("../data/courses.json", import.meta.url), "utf8"));
let store;
if (process.env.DATABASE_URL) {
  const { createPgStore } = await import("./stores/pg.js");
  store = createPgStore(process.env.DATABASE_URL);
  await store.init(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
} else {
  console.warn("DATABASE_URL absent : stockage en mémoire (la progression sera perdue au redémarrage).");
  store = createMemoryStore();
}
const port = Number(process.env.PORT) || 3000;
createApp({ courses, store, corsOrigin: process.env.CORS_ORIGIN }).listen(port, () => console.log(`API sur http://localhost:${port}`));
