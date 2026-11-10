function pun(st, ct, out) {
  var p1 = "Aa",
    p2 = "Aa";
  function d() {
    var c = [],
      i,
      j;
    for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) c.push([p1[i], p2[j]].sort().join(""));
    function td(g) {
      return '<td class="' + (g.indexOf("A") > -1 ? "" : "rec") + '">' + g + "</td>";
    }
    var dom = c.filter(function (g) {
      return g.indexOf("A") > -1;
    }).length;
    st.innerHTML =
      '<table class="pun" aria-label="Échiquier de croisement"><tr><th></th><th>' +
      p1[0] +
      "</th><th>" +
      p1[1] +
      "</th></tr><tr><th>" +
      p2[0] +
      "</th>" +
      td(c[0]) +
      td(c[2]) +
      "</tr><tr><th>" +
      p2[1] +
      "</th>" +
      td(c[1]) +
      td(c[3]) +
      "</tr></table>";
    out.innerHTML =
      "Descendance : <b>" +
      dom +
      "/4 lisses</b> (A dominant) et <b>" +
      (4 - dom) +
      "/4 ridés</b> (aa).<br>Cases pleines : phénotype lisse. Cases en pointillés : phénotype ridé.";
  }
  sel(ct, "Génotype du parent 1", ["AA", "Aa", "aa"], p1, function (v) {
    p1 = v;
    d();
  });
  sel(ct, "Génotype du parent 2", ["AA", "Aa", "aa"], p2, function (v) {
    p2 = v;
    d();
  });
  d();
}
