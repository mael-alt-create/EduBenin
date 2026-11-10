function photo(st, ct, out) {
  var L = 50;
  function d() {
    var n = Math.min(8, Math.round(L / 10)),
      i,
      b = "",
      ry = "",
      X = [150, 168, 186, 204, 160, 178, 196, 212];
    for (i = 0; i < n; i++)
      b +=
        '<circle cx="' +
        X[i] +
        '" cy="200" r="5" fill="#fff" opacity=".85"><animate attributeName="cy" from="205" to="125" dur="' +
        (2.4 + i * 0.25) +
        's" begin="' +
        i * 0.3 +
        's" repeatCount="indefinite"/></circle>';
    for (i = 0; i < 8; i++) {
      var t = (i * Math.PI) / 4,
        r1 = 26,
        r2 = 26 + 4 + L * 0.2;
      ry +=
        '<line x1="' +
        (60 + r1 * Math.cos(t)) +
        '" y1="' +
        (50 + r1 * Math.sin(t)) +
        '" x2="' +
        (60 + r2 * Math.cos(t)) +
        '" y2="' +
        (50 + r2 * Math.sin(t)) +
        '" stroke="#FCD116" stroke-width="3" stroke-linecap="round"/>';
    }
    st.innerHTML =
      '<svg viewBox="0 0 360 270" role="img" aria-label="Plante aquatique au soleil qui libère des bulles de dioxygène"><circle cx="60" cy="50" r="20" fill="#FCD116"/>' +
      ry +
      '<rect x="110" y="110" width="210" height="150" rx="10" fill="#4aa3ff" fill-opacity=".22" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M190 255V160M190 220C150 215 140 190 150 175C175 180 190 200 190 220M190 200C230 195 240 170 230 155C205 160 190 180 190 200" fill="var(--ac)" fill-opacity=".55" stroke="var(--ac)" stroke-width="3"/>' +
      b +
      '<text x="215" y="132" fill="currentColor" font-size="15" font-weight="800">O₂</text></svg>';
    out.innerHTML =
      "Lumière : <b>" +
      L +
      " %</b> · bulles d’O₂ : <b>" +
      n +
      "/8</b><br>6 CO₂ + 6 H₂O + lumière → C₆H₁₂O₆ + 6 O₂<br>Vers 80 % de lumière, la production plafonne.";
  }
  sl(ct, "Intensité de la lumière (%)", 0, 100, 5, L, function (v) {
    L = v;
    d();
  });
  d();
}
