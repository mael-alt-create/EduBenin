function para(st, ct, out) {
  var a = 1,
    b = 0,
    c = -2;
  function d() {
    var s = 22,
      o = 180,
      p = "",
      i,
      g = "";
    for (var x = -8; x <= 8.01; x += 0.2) {
      p +=
        (p ? "L" : "M") +
        (o + x * s).toFixed(1) +
        " " +
        (o - (a * x * x + b * x + c) * s).toFixed(1);
    }
    for (i = -8; i <= 8; i++) {
      g +=
        '<path d="M' +
        (o + i * s) +
        " 0V360M0 " +
        (o + i * s) +
        'H360" stroke="currentColor" stroke-opacity="' +
        (i ? 0.1 : 0.6) +
        '"/>';
    }
    var D = b * b - 4 * a * c,
      xs = -b / (2 * a),
      ys = a * xs * xs + b * xs + c,
      rt = "",
      res;
    if (D >= 0) {
      [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].forEach(function (r) {
        rt += '<circle cx="' + (o + r * s) + '" cy="' + o + '" r="5" fill="currentColor"/>';
      });
      res =
        D == 0
          ? "1 racine double"
          : "2 racines : " +
            ((-b - Math.sqrt(D)) / (2 * a)).toFixed(2) +
            " et " +
            ((-b + Math.sqrt(D)) / (2 * a)).toFixed(2);
    } else res = "aucune racine réelle (Δ < 0)";
    st.innerHTML =
      '<svg viewBox="0 0 360 360" role="img" aria-label="Courbe de la fonction du second degré">' +
      g +
      '<path d="' +
      p +
      '" fill="none" stroke="var(--ac)" stroke-width="3.5"/>' +
      rt +
      '<circle cx="' +
      (o + xs * s) +
      '" cy="' +
      (o - ys * s) +
      '" r="7" fill="var(--ac)" stroke="currentColor" stroke-width="2"/></svg>';
    out.innerHTML =
      "f(x) = " +
      a +
      "x² " +
      (b < 0 ? "−" : "+") +
      " " +
      Math.abs(b) +
      "x " +
      (c < 0 ? "−" : "+") +
      " " +
      Math.abs(c) +
      "<br>Δ = b² − 4ac = <b>" +
      D +
      "</b> → " +
      res +
      "<br>Sommet S(−b ÷ 2a ; f) = <b>(" +
      xs.toFixed(2) +
      " ; " +
      ys.toFixed(2) +
      ")</b>";
  }
  sl(ct, "a", -3, 3, 0.5, a, function (v) {
    a = v || 0.5;
    d();
  });
  sl(ct, "b", -6, 6, 1, b, function (v) {
    b = v;
    d();
  });
  sl(ct, "c", -6, 6, 1, c, function (v) {
    c = v;
    d();
  });
  d();
}
