var L = [
  {
    c: "3",
    s: "maths",
    t: "Le théorème de Pythagore",
    d: "Dans un triangle rectangle, l’aire du carré construit sur l’hypoténuse est égale à la somme des aires des deux autres carrés. Change a et b et regarde les aires.",
    f: pyth,
  },
  {
    c: "3",
    s: "maths",
    t: "Volumes : cylindre, cône, sphère",
    d: "Un cône tient exactement le tiers d’un cylindre de même base et de même hauteur. Compare les trois solides en faisant varier r et h.",
    f: vol,
  },
  {
    c: "3",
    s: "pct",
    t: "Circuit électrique et loi d’Ohm",
    d: "La pile pousse le courant, la lampe l’utilise. Ferme l’interrupteur, change la tension, puis compare le montage en série et en dérivation.",
    f: circ,
  },
  {
    c: "3",
    s: "svt",
    t: "La photosynthèse en labo",
    d: "Une plante aquatique éclairée libère du dioxygène sous forme de bulles. Plus de lumière, plus de bulles, jusqu’à un plafond.",
    f: photo,
  },
  {
    c: "T",
    s: "maths",
    t: "Fonctions du second degré",
    d: "Les coefficients a, b et c contrôlent la forme de la parabole, son sommet et ses points d’intersection avec l’axe des x.",
    f: para,
  },
  {
    c: "T",
    s: "pct",
    t: "Dosage acide-base (titrage)",
    d: "On verse de la soude dans l’acide chlorhydrique. Le pH reste bas, puis saute brusquement à l’équivalence, et la phénolphtaléine vire au rose.",
    f: tit,
  },
  {
    c: "T",
    s: "svt",
    t: "Génétique : l’échiquier de croisement",
    d: "Choisis les génotypes des deux parents et lis les proportions de la descendance pour un caractère à allèle dominant.",
    f: pun,
  },
];
var NM = { maths: "Maths", pct: "PCT", svt: "SVT" };
function show() {
  var cl = document.getElementById("cls"),
    tb = document.getElementById("tabs"),
    ls = document.getElementById("list");
  cl.innerHTML = "";
  [
    ["3", "3e"],
    ["T", "Terminale"],
  ].forEach(function (x) {
    var b = document.createElement("button");
    b.className = "c";
    b.textContent = x[1];
    b.setAttribute("aria-pressed", C == x[0]);
    b.onclick = function () {
      C = x[0];
      show();
    };
    cl.append(b);
  });
  tb.innerHTML = "";
  ["maths", "pct", "svt"].forEach(function (k) {
    var b = document.createElement("button");
    b.className = "t-" + k;
    b.textContent = NM[k];
    b.setAttribute("aria-pressed", S == k);
    b.onclick = function () {
      S = k;
      show();
    };
    tb.append(b);
  });
  ls.innerHTML = "";
  ls.className = S;
  upd();
  if (M == "fun") {
    fun(ls);
    return;
  }
  L.filter(function (l) {
    return l.c == C && l.s == S;
  }).forEach(function (l) {
    var e = document.createElement("article");
    e.className = "card";
    e.innerHTML =
      '<div class="stage"></div><div class="side"><h3></h3><p></p><div class="ctl"></div><p class="out" aria-live="polite"></p></div>';
    e.querySelector("h3").textContent = l.t;
    e.querySelector(".side p").textContent = l.d;
    ls.append(e);
    l.f(e.querySelector(".stage"), e.querySelector(".ctl"), e.querySelector(".out"));
  });
}
init();
