// Exporte le catalogue du front (js/catalogue.js) vers server/data/courses.json
import { readFileSync, writeFileSync } from "node:fs";
const src = readFileSync(new URL("../js/catalogue.js", import.meta.url), "utf8");
const start = src.indexOf("var K=[") + 6;
const end = src.indexOf("\n];", start) + 2;
const courses = new Function("return " + src.slice(start, end))();
writeFileSync(new URL("../server/data/courses.json", import.meta.url), JSON.stringify(courses, null, 2) + "\n");
console.log(courses.length + " cours exportés");
