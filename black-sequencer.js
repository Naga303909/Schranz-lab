/* Schranz Patch Lab v3.1 — standalone live jam training extension */
(()=>{
'use strict';
const KEY='schranz-live-v31';
const copy=x=>JSON.parse(JSON.stringify(x));
const defaults=[
 {name:'01 · BIA KICK',kind:'kick',steps:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],notes:Array(16).fill(36),length:16,mute:false,prob:100,ratchet:1,level:90},
 {name:'02 · 112 BASS',kind:'bass',steps:[1,0,0,1,0,0,1,0,1,0,1,0,0,1,0,1],notes:[36,36,39,36,43,36,34,36,36,36,39,36,46,43,39,34],length:16,mute:false,prob:100,ratchet:1,level:70},
 {name:'03 · BIA PERC',kind:'perc',steps:[0,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0],notes:Array(16).fill(64),length:16,mute:false,prob:100,ratchet:1,level:65},
 {name:'04 · FILTER MOD',kind:'mod',steps:Array(16).fill(1),notes:[35,45,60,70,90,70,55,40,35,50,75,90,65,50,40,30],length:16,mute:false,prob:100,ratchet:1,level:100}
];
let tracks=copy(defaults),playing=false,positions=[0,0,0,0],selected=[0,0,0,0],pattern='A',savedPatterns={};
try{const s=JSON.parse(localStorage.getItem(KEY));if(s?.patterns){savedPatterns=s.patterns;pattern=s.current||'A';if(savedPatterns[pattern]?.length===4)tracks=copy(savedPatterns[pattern]);}}catch{}
const css=document.createElement('style');css.textContent=`
#blackSeq{background:#151b28;border:1px solid #536074;border-radius:14px;padding:14px;margin:16px 0}
#blackSeq h2{color:#ffb86b}#blackSeq .bsTools{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
#blackSeq .bsTrack{background:#222b3b;padding:12px;margin:12px 0;border-radius:10px}
#blackSeq .bsHead{display:flex;gap:8px;justify-content:space-between;align-items:center;flex-wrap:wrap}
#blackSeq .bsSteps{display:grid;grid-template-columns:repeat(16,minmax(25px,1fr));gap:4px;margin:10px 0}
#blackSeq .bsStep{min-width:25px;padding:9px 0;background:#101722;border:1px solid #4d5b70;color:#dce2ee;border-radius:5px;font-size:11px}
#blackSeq .bsStep.on{background:#db6730;color:white}#blackSeq .bsStep.now{outline:2px solid #79e5c4;outline-offset:1px}
#blackSeq .bsSmall{color:#bdc7d7;font-size:12px}#blackSeq label{font-size:12px;color:#d6ddea}
#blackSeq select,#blackSeq input[type=number]{padding:5px;max-width:90px}#blackSeq .bsControls{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
@media(max-width:720px){#blackSeq .bsSteps{grid-template-columns:repeat(8,minmax(28px,1fr))}}
`;document.head.append(css);
const section=document.createElement('section');section.id='blackSeq';
section.innerHTML=`<h2>Erica Black Sequencer · Live Jam v3.1</h2>
<p class="bsSmall">Vier onafhankelijke 16-step tracks met eigen lengte, probability en ratchets. Virtuele trainingssimulatie, geen exacte hardware-emulatie of echte CV-uitgang.</p>
<div class="bsTools"><label>Pattern <select id="bsPattern"><option>A</option><option>B</option><option>C</option><option>D</option></select></label><button id="bsSave">Bewaar pattern</button><button id="bsReset">Reset</button><button id="bsFill">Kick + fill</button><button id="bsMute">Mute alles</button></div>
<div id="bsTracks"></div><p class="bsSmall" id="bsStatus">Laad een patch met SEQ en druk op Start geluid.</p>`;
document.querySelector('main').insertBefore(section,document.querySelector('main').children[2]);
const get=id=>document.getElementById(id);get('bsPattern').value=pattern;
function clamp(n,min,max){return Math.min(max,Math.max(min,Number(n)||0))}
function render(){get('bsTracks').innerHTML=tracks.map((t,ti)=>`<div class="bsTrack"><div class="bsHead"><strong>${t.name}</strong><label><input type="checkbox" data-mute="${ti}" ${t.mute?'checked':''}> Mute</label></div>
<div class="bsSteps">${t.steps.map((on,i)=>`<button class="bsStep ${on?'on':''}" data-step="${ti}:${i}" aria-label="Track ${ti+1}, step ${i+1}" ${i>=t.length?'disabled':''}>${i+1}</button>`).join('')}</div>
<div class="bsControls"><label>Length <select data-length="${ti}">${[4,8,12,16].map(n=>`<option value="${n}" ${t.length===n?'selected':''}>${n}</option>`).join('')}</select></label>
<label>Chance <input data-prob="${ti}" type="number" min="0" max="100" value="${t.prob}">%</label>
<label>Ratchet <select data-ratchet="${ti}">${[1,2,3,4].map(n=>`<option value="${n}" ${t.ratchet===n?'selected':''}>${n}x</option>`).join('')}</select></label>
<label>Level <input data-level="${ti}" type="number" min="0" max="100" value="${t.level}">%</label>
<label>${ti===3?'Filter %':'MIDI note'} step <span data-selected="${ti}">${selected[ti]+1}</span>: <input data-note="${ti}" type="number" min="${ti===3?0:24}" max="${ti===3?100:96}" value="${t.notes[selected[ti]]}"></label></div></div>`).join('');
get('bsTracks').querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{const [t,i]=b.dataset.step.split(':').map(Number);selected[t]=i;tracks[t].steps[i]=1-tracks[t].steps[i];render()});
for(const type of ['mute','length','prob','ratchet','level','note'])get('bsTracks').querySelectorAll('[data-'+type+']').forEach(el=>el.onchange=()=>{const i=+el.dataset[type],t=tracks[i];if(type==='mute')t.mute=el.checked;else if(type==='note')t.notes[selected[i]]=clamp(el.value,i===3?0:24,i===3?100:96);else t[type]=clamp(el.value,type==='length'?1:type==='ratchet'?1:0,type==='length'?16:type==='ratchet'?4:100);render()});
}
function store(){savedPatterns[pattern]=copy(tracks);try{localStorage.setItem(KEY,JSON.stringify({current:pattern,patterns:savedPatterns}));get('bsStatus').textContent='Pattern '+pattern+' opgeslagen.'}catch{get('bsStatus').textContent='Opslaan mislukt.'}}
get('bsSave').onclick=store;
get('bsPattern').onchange=e=>{pattern=e.target.value;tracks=copy(savedPatterns[pattern]||defaults);positions=[0,0,0,0];render()};
get('bsReset').onclick=()=>{tracks=copy(defaults);positions=[0,0,0,0];render()};
get('bsFill').onclick=()=>{tracks[0].steps=[1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,1];tracks[2].steps=[0,0,1,0,0,1,0,1,0,0,1,0,1,1,1,1];render()};
get('bsMute').onclick=()=>{const all=tracks.every(t=>t.mute);tracks.forEach(t=>t.mute=!all);render()};
const oldPlay=play,oldStop=stop;
function hz(n){return 440*Math.pow(2,(n-69)/12)}
function voice(t,note,at,dur){if(!ctx||!analyser)return;const o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter(),sh=ctx.createWaveShaper();const kind=t.kind;
o.type=kind==='bass'?'sawtooth':kind==='perc'?'square':'sine';const base=kind==='kick'?clamp(get('pitch').value,35,160):hz(note);
o.frequency.setValueAtTime(kind==='kick'?base*3:base,at);if(kind==='kick')o.frequency.exponentialRampToValueAtTime(base,at+.055);
f.type=kind==='bass'?'lowpass':'highpass';f.frequency.value=kind==='bass'?clamp(get('filter').value,150,9000):kind==='perc'?650:25;f.Q.value=kind==='bass'?5:.7;
const drive=clamp(get('drive').value,0,100)/100;const curve=new Float32Array(1024);for(let i=0;i<curve.length;i++){const x=2*i/(curve.length-1)-1;curve[i]=Math.tanh(x*(1+drive*15))}sh.curve=curve;sh.oversample='2x';
g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime((kind==='kick'?.23:.12)*t.level/100,at+.004);g.gain.exponentialRampToValueAtTime(.0001,at+dur);o.connect(f).connect(sh).connect(g).connect(analyser);o.start(at);o.stop(at+dur+.01)
}
trigger=function(){if(!ctx)return;const tick=60/clamp(get('tempo').value,100,190)/4;let count=0;const routes=audioRoutes(),bia=connected('SEQ','GATE','BIA','TRIG')&&routes.some(p=>p[0].to==='BIA'),vco=connected('SEQ','CV','VCO','CV')&&routes.some(p=>p[0].to==='VCO');
tracks.forEach((t,i)=>{const pos=positions[i]%t.length;positions[i]++;if(t.mute||!t.steps[pos]||Math.random()*100>=t.prob)return;if(t.kind==='mod'){get('filter').value=Math.round(150+t.notes[pos]/100*8850);get('filterValue').textContent=get('filter').value;return}if(t.kind==='bass'?!vco:!bia)return;for(let k=0;k<t.ratchet;k++)voice(t,t.notes[pos],ctx.currentTime+k*tick/t.ratchet,Math.min(t.kind==='kick'?.2:t.kind==='bass'?.16:.08,tick/t.ratchet*.85));count++});
get('bsTracks').querySelectorAll('[data-step]').forEach(b=>{const [i,j]=b.dataset.step.split(':').map(Number);b.classList.toggle('now',j===(positions[i]-1)%tracks[i].length)});
get('bsStatus').textContent='Live · '+count+' voices · '+get('tempo').value+' BPM · pattern '+pattern;playing=true;
};
play=async function(){await oldPlay();if(ctx){clearInterval(timer);positions=[0,0,0,0];timer=setInterval(trigger,60000/clamp(get('tempo').value,100,190)/4)}};
stop=function(){oldStop();playing=false;get('bsTracks').querySelectorAll('.bsStep').forEach(b=>b.classList.remove('now'))};
get('play').onclick=()=>play();get('stop').onclick=()=>stop();get('tempo').onchange=()=>{if(ctx){clearInterval(timer);timer=setInterval(trigger,60000/clamp(get('tempo').value,100,190)/4)}};
render();
})();
