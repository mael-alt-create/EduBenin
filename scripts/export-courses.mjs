// Exporte le catalogue du front (js/catalogue.js) vers server/data/courses.json
import { readFileSync, writeFileSync } from "node:fs";
const src = readFileSync(new URL("../js/catalogue.js", import.meta.url), "utf8");
const start = src.search(/var K\s*=\s*\[/) + src.slice(src.search(/var K\s*=\s*\[/)).indexOf("[");
const end = src.indexOf("\n];", start) + 2;
const courses = new Function("return " + src.slice(start, end))();
writeFileSync(
  new URL("../server/data/courses.json", import.meta.url),
  JSON.stringify(courses, null, 2) + "\n",
);
console.log(courses.length + " cours exportés");
