import express from "express";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const POINTS = { quiz: 10, item: 5, bonus: 10 };

// Version publique d'un cours : les bonnes réponses ne sortent jamais de l'API.
function publicCourse(k) {
  const base = {
    id: k.id,
    classe: k.c,
    matiere: k.s,
    emoji: k.e,
    titre: k.t,
    modele: k.p,
    minutes: k.m,
    accroche: k.h,
  };
  if (k.p === "vf") return { ...base, affirmations: k.v.map((x) => x[0]) };
  return { ...base, contenu: k.b, question: { texte: k.q[0], choix: k.q[1] } };
}

function limiter(max, windowMs) {
  const hits = new Map();
  setInterval(() => hits.clear(), windowMs).unref();
  return (req, res, next) => {
    const n = (hits.get(req.ip) ?? 0) + 1;
    hits.set(req.ip, n);
    if (n > max)
      return res.status(429).json({ erreur: "Trop de requêtes, réessaie dans une minute." });
    next();
  };
}

export function createApp({ courses, store, corsOrigin = "" }) {
  const app = express();
  const byId = new Map(courses.map((k) => [k.id, k]));
  app.disable("x-powered-by");
  app.use(express.json({ limit: "2kb" }));
  app.use(limiter(120, 60_000));
  app.use((req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "X-Frame-Options": "DENY",
    });
    if (corsOrigin) {
      res.set({
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Headers": "content-type,x-device-id",
      });
      if (req.method === "OPTIONS") return res.sendStatus(204);
    }
    next();
  });

  const device = (req) => {
    const d = req.get("x-device-id");
    return d && UUID.test(d) ? d.toLowerCase() : null;
  };
  const summary = async (d) => {
    const rows = await store.progress(d);
    return {
      xp: rows.reduce((s, r) => s + r.points, 0),
      termines: rows.map((r) => r.key).filter((k) => byId.has(k)),
    };
  };

  app.get("/api/health", (_req, res) => res.json({ ok: true, cours: courses.length }));

  app.get("/api/courses", (req, res) => {
    const { classe, matiere, q = "" } = req.query;
    const needle = String(q).toLowerCase();
    const list = courses
      .filter((k) => (!classe || k.c === classe) && (!matiere || k.s === matiere))
      .filter((k) => !needle || (k.t + " " + k.h).toLowerCase().includes(needle))
      .map(({ id, c, s, e, t, p, m, h }) => ({
        id,
        classe: c,
        matiere: s,
        emoji: e,
        titre: t,
        modele: p,
        minutes: m,
        accroche: h,
      }));
    res.json(list);
  });

  app.get("/api/courses/:id", (req, res) => {
    const k = byId.get(req.params.id);
    if (!k) return res.status(404).json({ erreur: "Cours introuvable." });
    res.json(publicCourse(k));
  });

  // Corrige une réponse. Avec X-Device-Id, les points sont enregistrés (une seule fois par réponse).
  app.post("/api/courses/:id/answer", async (req, res) => {
    const k = byId.get(req.params.id);
    if (!k) return res.status(404).json({ erreur: "Cours introuvable." });
    const dev = device(req);
    if (req.get("x-device-id") && !dev)
      return res.status(400).json({ erreur: "X-Device-Id invalide (UUID attendu)." });
    const body = req.body ?? {};
    let correct, explication, key, points;
    if (k.p === "vf") {
      const i = body.affirmation,
        v = body.valeur;
      if (!Number.isInteger(i) || i < 0 || i >= k.v.length || typeof v !== "boolean")
        return res
          .status(400)
          .json({ erreur: "Champs attendus : affirmation (entier) et valeur (booléen)." });
      correct = v === k.v[i][1];
      explication = k.v[i][2];
      key = `${k.id}v${i}`;
      points = POINTS.item;
    } else {
      const c = body.choix;
      if (!Number.isInteger(c) || c < 0 || c >= k.q[1].length)
        return res.status(400).json({ erreur: "Champ attendu : choix (indice de la réponse)." });
      correct = c === k.q[2];
      explication = k.q[3];
      key = k.id;
      points = POINTS.quiz;
    }
    let gagnes = 0;
    if (correct && dev) {
      if (await store.award(dev, key, points)) gagnes += points;
      if (k.p === "vf") {
        const keys = new Set((await store.progress(dev)).map((r) => r.key));
        if (
          k.v.every((_, j) => keys.has(`${k.id}v${j}`)) &&
          (await store.award(dev, k.id, POINTS.bonus))
        )
          gagnes += POINTS.bonus;
      }
    }
    res.json({
      correct,
      explication: correct ? explication : null,
      points: gagnes,
      ...(dev ? await summary(dev) : {}),
    });
  });

  app.get("/api/progress", async (req, res) => {
    const dev = device(req);
    if (!dev) return res.status(400).json({ erreur: "En-tête X-Device-Id (UUID) requis." });
    res.json(await summary(dev));
  });

  app.use("/api", (_req, res) => res.status(404).json({ erreur: "Route inconnue." }));
  app.use((err, _req, res, _next) => {
    if (err.type === "entity.parse.failed")
      return res.status(400).json({ erreur: "JSON invalide." });
    console.error(err);
    res.status(500).json({ erreur: "Erreur interne." });
  });
  return app;
}
