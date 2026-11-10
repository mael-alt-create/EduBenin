var C = "3",
  S = "maths";
function P(a) {
  return a
    .map(function (p) {
      return p
        .map(function (n) {
          return +n.toFixed(1);
        })
        .join(",");
    })
    .join(" ");
}
function sl(ct, lab, min, max, step, val, fn) {
  var l = document.createElement("label"),
    o = document.createElement("output"),
    i = document.createElement("input");
  i.type = "range";
  i.min = min;
  i.max = max;
  i.step = step;
  i.value = val;
  o.textContent = val;
  l.append(lab + " : ", o, i);
  i.oninput = function () {
    o.textContent = i.value;
    fn(+i.value);
  };
  ct.append(l);
}
function sel(ct, lab, opts, val, fn) {
  var l = document.createElement("label"),
    s = document.createElement("select");
  opts.forEach(function (o) {
    var e = document.createElement("option");
    e.value = o;
    e.textContent = o;
    s.append(e);
  });
  s.value = val;
  s.onchange = function () {
    fn(s.value);
  };
  l.append(lab + " : ", s);
  ct.append(l);
}
function btn(ct, lab, fn) {
  var b = document.createElement("button");
  b.textContent = lab;
  b.className = "b";
  b.onclick = function () {
    fn(b);
  };
  ct.append(b);
}
