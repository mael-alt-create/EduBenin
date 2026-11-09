function tit(st,ct,out){var V=0;
function pH(v){var n=2-.1*v,t=20+v;if(Math.abs(n)<1e-6)return 7;return n>0?-Math.log10(n/t):14+Math.log10(-n/t)}
var cv="";for(var v=0;v<=40.01;v+=.5)cv+=(cv?"L":"M")+(180+v*6)+" "+(230-pH(v)*14.3).toFixed(1);
function d(){var ph=pH(V),op=Math.min(1,Math.max(0,(ph-8.2)/1.5)),ly=20+150*V/40;
st.innerHTML='<svg viewBox="0 0 440 270" role="img" aria-label="Burette, erlenmeyer et courbe de titrage">'+
'<rect x="50" y="20" width="20" height="150" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="51" y="'+ly+'" width="18" height="'+(170-ly)+'" fill="#7fd0ff" opacity=".5"/><path d="M60 170V182" stroke="currentColor" stroke-width="3"/>'+((V>0&&V<40)?'<circle cx="60" cy="188" r="3" fill="#7fd0ff"><animate attributeName="cy" from="184" to="204" dur=".9s" repeatCount="indefinite"/></circle>':"")+
'<path d="M45 196V218L16 256H104L75 218V196" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M32 238L18 256H102L88 238Z" fill="#7fd0ff" opacity=".35"/><path d="M32 238L18 256H102L88 238Z" fill="#ff3d9a" opacity="'+op*.85+'"/>'+
'<text x="110" y="40" fill="currentColor" font-size="12">NaOH 0,1 mol/L</text><text x="112" y="250" fill="currentColor" font-size="12">HCl + phénolphtaléine</text>'+
'<path d="M180 30V230H420" fill="none" stroke="currentColor" stroke-width="2"/><path d="M180 130H420" stroke="currentColor" stroke-dasharray="4 5" opacity=".4"/><text x="152" y="34" fill="currentColor" font-size="13">pH</text><text x="372" y="250" fill="currentColor" font-size="13">V (mL)</text><text x="160" y="134" fill="currentColor" font-size="12">7</text><text x="292" y="252" fill="currentColor" font-size="11">20</text>'+
'<path d="'+cv+'" fill="none" stroke="var(--ac)" stroke-width="3"/><circle cx="'+(180+V*6)+'" cy="'+(230-ph*14.3)+'" r="7" fill="var(--ac)" stroke="currentColor" stroke-width="2"/></svg>';
out.innerHTML="Volume versé : <b>"+V+" mL</b> · pH = <b>"+ph.toFixed(2)+"</b><br>"+(V<20?"Milieu acide : la solution reste incolore.":V==20?"Équivalence : acide fort + base forte, pH = 7.":"Excès de base : le milieu devient basique et rosit.")}
sl(ct,"Volume de soude versé (mL)",0,40,.5,V,function(x){V=x;d()});d()}
