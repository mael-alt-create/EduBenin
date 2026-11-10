function circ(st, ct, out) {
  var U = 6,
    on = true,
    par = false,
    bt;
  function d() {
    var R = 10,
      Req = par ? R / 2 : 2 * R,
      I = U / Req,
      Ib = on ? (par ? U / R : I) : 0,
      br = Math.min(1, Ib / 0.6),
      Id = on ? I : 0;
    function lamp(x, y) {
      return (
        '<circle cx="' +
        x +
        '" cy="' +
        y +
        '" r="' +
        (16 + 22 * br) +
        '" fill="#FCD116" opacity="' +
        0.28 * br +
        '"/><circle cx="' +
        x +
        '" cy="' +
        y +
        '" r="16" fill="#FCD116" fill-opacity="' +
        (0.1 + 0.9 * br) +
        '" stroke="currentColor" stroke-width="2"/><path d="M' +
        (x - 8) +
        " " +
        (y - 8) +
        "L" +
        (x + 8) +
        " " +
        (y + 8) +
        "M" +
        (x + 8) +
        " " +
        (y - 8) +
        "L" +
        (x - 8) +
        " " +
        (y + 8) +
        '" stroke="currentColor" stroke-width="2"/>'
      );
    }
    var w = par
      ? "M50 60H110M150 60H300M50 220H300M50 220V148M50 128V60M200 60V124M200 156V220M300 60V124M300 156V220"
      : "M50 60H110M150 60H320V220H276M244 220H196M164 220H50V148M50 128V60";
    var sw = on
      ? '<path d="M110 60H150" stroke="currentColor" stroke-width="4"/>'
      : '<path d="M110 60L140 33" stroke="currentColor" stroke-width="4"/>';
    var fl = on
      ? '<path d="' +
        w +
        '" class="flow" fill="none" stroke="var(--ac)" stroke-width="4" style="animation-duration:' +
        Math.min(6, Math.max(0.4, 0.5 / Id)).toFixed(2) +
        's"/>'
      : "";
    st.innerHTML =
      '<svg viewBox="0 0 360 260" role="img" aria-label="Circuit électrique avec pile, interrupteur et deux lampes"><path d="' +
      w +
      '" fill="none" stroke="currentColor" stroke-width="3"/>' +
      fl +
      sw +
      '<path d="M36 128H64M43 138H57M36 148H64" stroke="currentColor" stroke-width="4"/><text x="72" y="126" fill="currentColor" font-size="16">+</text><text x="72" y="156" fill="currentColor" font-size="16">−</text><text x="14" y="200" fill="currentColor" font-size="13">pile</text>' +
      (par ? lamp(200, 140) + lamp(300, 140) : lamp(180, 220) + lamp(260, 220)) +
      '<text x="110" y="24" fill="currentColor" font-size="13">interrupteur</text></svg>';
    out.innerHTML = on
      ? "U = " +
        U +
        " V · R<sub>éq</sub> = " +
        Req +
        " Ω · <b>I = U ÷ R = " +
        I.toFixed(2) +
        " A</b>" +
        (par
          ? "<br>En dérivation, chaque lampe reçoit toute la tension et brille fort."
          : "<br>En série, la tension se partage : les lampes brillent moins.")
      : "Circuit ouvert : le courant ne passe pas, <b>I = 0 A</b>.";
  }
  sl(ct, "Tension de la pile U (V)", 1, 12, 1, U, function (v) {
    U = v;
    d();
  });
  btn(ct, "Interrupteur : fermé", function (b) {
    on = !on;
    b.textContent = "Interrupteur : " + (on ? "fermé" : "ouvert");
    d();
  });
  btn(ct, "Montage : en série", function (b) {
    par = !par;
    b.textContent = "Montage : " + (par ? "en dérivation" : "en série");
    d();
  });
  d();
}
