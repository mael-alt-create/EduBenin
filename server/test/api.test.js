import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createApp } from "../src/app.js";
import { createMemoryStore } from "../src/stores/memory.js";

const courses = JSON.parse(readFileSync(new URL("../data/courses.json", import.meta.url), "utf8"));
const DEV = "123e4567-e89b-42d3-a456-426614174000";
let srv, base;
before(async () => {
  srv = createApp({ courses, store: createMemoryStore() }).listen(0);
  base = `http://localhost:${srv.address().port}`;
});
after(() => srv.close());
const call = (path, opts = {}) =>
  fetch(base + path, { ...opts, headers: { "content-type": "application/json", ...opts.headers } });
const post = (path, body, headers = {}) =>
  call(path, { method: "POST", body: JSON.stringify(body), headers });

test("santé de l'API", async () => {
  const r = await call("/api/health");
  assert.equal(r.status, 200);
  assert.equal((await r.json()).ok, true);
});

test("filtrage par classe, matière et mot-clé", async () => {
  const list = await (await call("/api/courses?classe=3&matiere=maths")).json();
  assert.equal(list.length, 3);
  const found = await (await call("/api/courses?q=pythagore")).json();
  assert.deepEqual(
    found.map((k) => k.id),
    ["m2"],
  );
});

test("le détail d'un cours ne révèle pas la bonne réponse", async () => {
  const k = await (await call("/api/courses/m2")).json();
  assert.equal(k.question.choix.length, 4);
  assert.equal(JSON.stringify(k).includes("√25"), false);
  const vf = await (await call("/api/courses/p2")).json();
  assert.equal(vf.affirmations.length, 3);
});

test("réponse fausse : pas de points ; bonne réponse : points une seule fois", async () => {
  const h = { "x-device-id": DEV };
  const bad = await (await post("/api/courses/m2/answer", { choix: 1 }, h)).json();
  assert.equal(bad.correct, false);
  assert.equal(bad.points, 0);
  const ok = await (await post("/api/courses/m2/answer", { choix: 0 }, h)).json();
  assert.equal(ok.correct, true);
  assert.equal(ok.points, 10);
  const again = await (await post("/api/courses/m2/answer", { choix: 0 }, h)).json();
  assert.equal(again.points, 0);
  assert.equal(again.xp, 10);
});

test("vrai ou faux : 5 points par affirmation, +10 quand tout est juste", async () => {
  const h = { "x-device-id": DEV };
  const vals = [true, true, false];
  let total = 0,
    last;
  for (let i = 0; i < 3; i++) {
    last = await (
      await post("/api/courses/p2/answer", { affirmation: i, valeur: vals[i] }, h)
    ).json();
    assert.equal(last.correct, true);
    total += last.points;
  }
  assert.equal(total, 25);
  assert.ok(last.termines.includes("p2"));
});

test("erreurs : cours inconnu, identifiant invalide, corps invalide", async () => {
  assert.equal((await call("/api/courses/zzz")).status, 404);
  assert.equal((await call("/api/progress")).status, 400);
  assert.equal(
    (await post("/api/courses/m2/answer", { choix: 0 }, { "x-device-id": "pas-un-uuid" })).status,
    400,
  );
  assert.equal((await post("/api/courses/m2/answer", { choix: 99 })).status, 400);
});
