function pyth(st, ct, out) {
  var a = 6,
    b = 8;
  function d() {
    var c = Math.hypot(a, b),
      s = 12,
      x = 190,
      y = 150,
      A = [x + s * a, y],
      B = [x, y - s * b],
      O = [x, y],
      n = [s * b, -s * a];
    function sq(p, f) {
      return (
        '<polygon points="' +
        P(p) +
        '" fill="var(--ac)" fill-opacity="' +
        f +
        '" stroke="var(--ac)" stroke-width="2"/>'
      );
    }
    function tx(X, Y, t) {
      return (
        '<text x="' +
        X +
        '" y="' +
        Y +
        '" text-anchor="middle" fill="currentColor" font-size="20" font-weight="800">' +
        t +
        "</text>"
      );
    }
    st.innerHTML =
      '<svg viewBox="40 -100 420 380" role="img" aria-label="Triangle rectangle avec un carré sur chaque côté">' +
      sq([O, A, [A[0], A[1] + s * a], [x, y + s * a]], 0.22) +
      sq([O, B, [x - s * b, B[1]], [x - s * b, y]], 0.22) +
      sq([A, B, [B[0] + n[0], B[1] + n[1]], [A[0] + n[0], A[1] + n[1]]], 0.4) +
      '<polygon points="' +
      P([O, A, B]) +
      '" fill="var(--card)" stroke="currentColor" stroke-width="3"/><rect x="' +
      x +
      '" y="' +
      (y - 10) +
      '" width="10" height="10" fill="none" stroke="currentColor"/>' +
      tx(x + (s * a) / 2, y + (s * a) / 2 + 7, "a² = " + a * a) +
      tx(x - (s * b) / 2, y - (s * b) / 2 + 7, "b² = " + b * b) +
      tx((A[0] + B[0] + n[0]) / 2, (A[1] + B[1] + n[1]) / 2 + 7, "c² = " + (a * a + b * b)) +
      "</svg>";
    out.innerHTML =
      a +
      "² + " +
      b +
      "² = " +
      a * a +
      " + " +
      b * b +
      " = " +
      (a * a + b * b) +
      ", donc <b>c = √" +
      (a * a + b * b) +
      " ≈ " +
      c.toFixed(2) +
      "</b>";
  }
  sl(ct, "Côté a", 3, 10, 1, a, function (v) {
    a = v;
    d();
  });
  sl(ct, "Côté b", 3, 10, 1, b, function (v) {
    b = v;
    d();
  });
  d();
}
