var API = "http://localhost:3000/api";
var K = []; // chargé depuis l'API au démarrage
var TP = { ex: "Fiche express", an: "Analogie", mn: "Mnémo", vf: "Vrai ou faux" },
  NV = ["Curieux", "Explorateur", "Inventeur", "Savant", "Génie"],
  M = "fun",
  Q = "",
  OP = "",
  XP = 0,
  DN = {},
  DEV = "";

/* ---- Device ID (UUID) pour le suivi de progression côté API ---- */
function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    return (c == "x" ? r : (r & 3) | 8).toString(16);
  });
}
try {
  DEV = localStorage.getItem("lumi-dev") || "";
  if (!DEV) {
    DEV = uuid();
    localStorage.setItem("lumi-dev", DEV);
  }
} catch (e) {}

/* ---- Helper fetch API ---- */
function api(path, opts) {
  var headers = { "Content-Type": "application/json" };
  if (DEV) headers["X-Device-Id"] = DEV;
  return fetch(API + path, Object.assign({ headers: headers }, opts || {})).then(function (r) {
    return r.json();
  });
}

/* ---- Chargement initial : liste des cours ---- */
function loadCourses() {
  return api("/courses").then(function (list) {
    K = list.map(function (c) {
      return {
        id: c.id,
        c: c.classe,
        s: c.matiere,
        e: c.emoji,
        t: c.titre,
        p: c.modele,
        m: c.minutes,
        h: c.accroche,
      };
    });
  });
}

/* ---- Chargement initial : progression (XP, cours terminés) ---- */
function loadProgress() {
  if (!DEV) return Promise.resolve();
  return api("/progress")
    .then(function (p) {
      XP = p.xp || 0;
      DN = {};
      (p.termines || []).forEach(function (id) {
        DN[id] = 1;
      });
    })
    .catch(function () {});
}

/* ---- Fetch du détail d'un cours (contenu, question/affirmations) ---- */
function loadDetail(k) {
  if (k._loaded) return Promise.resolve(k);
  return api("/courses/" + k.id).then(function (d) {
    k.b = d.contenu || [];
    if (d.affirmations) {
      k.v = d.affirmations.map(function (a) {
        return [a];
      });
    }
    if (d.question) {
      k.q = [d.question.texte, d.question.choix];
    }
    k._loaded = true;
    return k;
  });
}

/* ---- Sync XP et cours terminés depuis une réponse API ---- */
function syncFromApi(res) {
  if (res.xp !== undefined) XP = res.xp;
  if (res.termines) {
    DN = {};
    res.termines.forEach(function (id) {
      DN[id] = 1;
    });
  }
  upd();
}

/* ---- Coche un cours dans l'UI ---- */
function markDone(d) {
  var o = d.querySelector(".ok");
  if (o) o.textContent = "✓";
}

/* ---- Mascotte Kofi ---- */
function say(m) {
  document.getElementById("kofi").textContent = m;
  var s = document.querySelector(".kofi span");
  s.classList.remove("hop");
  void s.offsetWidth;
  s.classList.add("hop");
}

/* ---- Barre XP / niveau ---- */
function upd() {
  var l = Math.min(4, Math.floor(XP / 50));
  document.getElementById("xp").innerHTML =
    "🦎 Niv. " +
    (l + 1) +
    " · " +
    NV[l] +
    " · " +
    XP +
    ' XP<i><b style="width:' +
    (l == 4 ? 100 : (XP % 50) * 2) +
    '%"></b></i>';
  document.querySelectorAll("#mode button").forEach(function (b) {
    b.setAttribute("aria-pressed", b.dataset.m == M);
  });
}

/* ---- Quiz (QCM) : POST la réponse à l'API ---- */
function quiz(k, el, d) {
  var q = k.q, // [texte, choix[]]
    w = document.createElement("div"),
    r = document.createElement("p");
  w.className = "qz";
  w.innerHTML = "<p><b>🎯 Mini-défi :</b> " + q[0] + "</p>";
  q[1].forEach(function (o, i) {
    var b = document.createElement("button");
    b.className = "b";
    b.textContent = o;
    b.onclick = function () {
      api("/courses/" + k.id + "/answer", {
        method: "POST",
        body: JSON.stringify({ choix: i }),
      }).then(function (res) {
        if (res.correct) {
          b.classList.add("good");
          r.textContent = "✅ " + res.explication;
          var wasNew = !DN[k.id];
          syncFromApi(res);
          markDone(d);
          say(wasNew ? "Bravo ! +10 XP 🎉" : "Bien joué, tu maîtrises !");
        } else {
          b.classList.add("bad");
          b.disabled = true;
          say("Presque ! Réessaie, tu y es presque.");
        }
      });
    };
    w.append(b);
  });
  w.append(r);
  el.append(w);
}

/* ---- Vrai/Faux : POST chaque affirmation à l'API ---- */
function vf(k, el, d) {
  k.v.forEach(function (x, i) {
    var p = document.createElement("div"),
      r = document.createElement("small");
    p.className = "qz";
    p.innerHTML = "<p>" + x[0] + "</p>";
    [true, false].forEach(function (v) {
      var b = document.createElement("button");
      b.className = "b";
      b.textContent = v ? "Vrai" : "Faux";
      b.onclick = function () {
        api("/courses/" + k.id + "/answer", {
          method: "POST",
          body: JSON.stringify({ affirmation: i, valeur: v }),
        }).then(function (res) {
          if (res.correct) {
            r.textContent = "✅ " + res.explication;
            b.classList.add("good");
            syncFromApi(res);
            markDone(d);
            say("Exact ! +5 XP ⭐");
          } else {
            b.classList.add("bad");
            r.textContent = "Hmm, réfléchis encore…";
            say("Pas tout à fait, retente !");
          }
        });
      };
      p.append(b);
    });
    p.append(r);
    el.append(p);
  });
}

/* ---- Construction du contenu d'un cours (onglets Comprendre / Défi) ---- */
function body(k, d) {
  var el = d.querySelector(".kb"),
    b = k.b || [],
    h = "",
    A = K.filter(function (x) {
      return x.c == k.c && x.s == k.s;
    }),
    nx = A[A.indexOf(k) + 1],
    u = location.href.split("#")[0] + "#cours-" + k.id;
  if (k.p == "ex")
    h =
      "<ul>" +
      b
        .slice(0, -1)
        .map(function (x) {
          return "<li>" + x + "</li>";
        })
        .join("") +
      '</ul><p class="tip">💡 ' +
      b[b.length - 1] +
      "</p>";
  if (k.p == "an") h = '<p class="story">' + b[0] + "</p><p><b>Le vrai nom :</b> " + b[1] + "</p>";
  if (k.p == "mn") h = '<p class="slogan">« ' + b[0] + " »</p><p>" + b[1] + "</p>";
  if (k.p == "vf") h = "<p>Trois affirmations à trier. Passe à l'onglet Défi pour répondre.</p>";
  el.innerHTML =
    '<div class="tabs2"><button class="on">📖 Comprendre</button><button>🎯 Défi</button></div><div class="pn">' +
    h +
    '</div><div class="pn" hidden></div><p class="act"><a class="lnk" target="_blank" rel="noopener" href="https://wa.me/?text=' +
    encodeURIComponent(k.t + " sur LumiSciences : " + u) +
    '">📲 Partager sur WhatsApp</a></p>';
  var T = el.querySelectorAll(".tabs2 button"),
    P2 = el.querySelectorAll(".pn");
  T.forEach(function (t, i) {
    t.onclick = function () {
      T.forEach(function (x, j) {
        x.classList.toggle("on", i == j);
      });
      P2.forEach(function (p, j) {
        p.hidden = i != j;
      });
    };
  });
  if (k.p == "vf") vf(k, P2[1], d);
  else quiz(k, P2[1], d);
  if (nx) {
    var n = document.createElement("button");
    n.className = "nx";
    n.textContent = "Cours suivant : " + nx.t + " →";
    n.onclick = function () {
      d.open = false;
      var t = document.getElementById("c-" + nx.id);
      t.open = true;
      t.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    el.querySelector(".act").append(n);
  }
}

/* ---- Grille des cours (mode "fun") ---- */
function fun(ls) {
  var A = K.filter(function (k) {
      return k.c == C && k.s == S;
    }),
    L2 = A.filter(function (k) {
      return (k.t + k.h).toLowerCase().indexOf(Q.toLowerCase()) > -1;
    }),
    n = A.filter(function (k) {
      return DN[k.id];
    }).length,
    hd = document.createElement("p");
  ls.className = "grid " + S;
  hd.className = "cnt";
  hd.style.gridColumn = "1/-1";
  hd.textContent = L2.length
    ? L2.length + " cours · " + n + "/" + A.length + " terminés"
    : "Aucun cours trouvé. Essaie un autre mot.";
  ls.append(hd);
  L2.forEach(function (k) {
    var d = document.createElement("details");
    d.className = "kc";
    d.id = "c-" + k.id;
    d.innerHTML =
      '<summary><span class="em">' +
      k.e +
      "</span><span><b>" +
      (A.indexOf(k) + 1) +
      ". " +
      k.t +
      "</b><small>" +
      k.h +
      '</small><small class="tg">' +
      TP[k.p] +
      " · " +
      k.m +
      ' min</small></span><span class="ok">' +
      (DN[k.id] ? "✓" : "") +
      '</span></summary><div class="kb"><p>Chargement…</p></div>';
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      ls.querySelectorAll("details[open]").forEach(function (o) {
        if (o !== d) o.open = false;
      });
      if (!d.dataset.r) {
        d.dataset.r = 1;
        loadDetail(k).then(function () {
          body(k, d);
        });
      }
      try {
        history.replaceState(null, "", "#cours-" + k.id);
      } catch (e) {}
    });
    ls.append(d);
  });
  if (OP) {
    var t = document.getElementById("c-" + OP);
    OP = "";
    if (t) {
      t.open = true;
      t.scrollIntoView();
    }
  }
}

/* ---- Init : charger les cours et la progression, puis afficher ---- */
function init() {
  loadCourses()
    .then(function () {
      // Gestion du hash (cours spécifique dans l'URL)
      var h = location.hash.slice(1),
        k = K.filter(function (x) {
          return "cours-" + x.id == h;
        })[0];
      if (k) {
        C = k.c;
        S = k.s;
        M = "fun";
        OP = k.id;
      }
      return loadProgress();
    })
    .then(function () {
      show();
    })
    .catch(function () {
      show();
    });
}

/* ---- Boutons mode + recherche ---- */
(function () {
  var m = document.getElementById("mode"),
    i = document.createElement("input");
  [
    ["fun", "🎮 Cours fun"],
    ["lab", "🔬 Labos"],
  ].forEach(function (x) {
    var b = document.createElement("button");
    b.dataset.m = x[0];
    b.textContent = x[1];
    b.onclick = function () {
      M = x[0];
      show();
    };
    m.append(b);
  });
  i.placeholder = "🔎 Chercher un cours";
  i.setAttribute("aria-label", "Chercher un cours");
  i.oninput = function () {
    Q = i.value;
    M = "fun";
    show();
  };
  m.append(i);
})();
