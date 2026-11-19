const el = id => document.getElementById(id);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const courses = ['All courses','Development','Foundations'];
let course=courses[0], moduleFilter='all', mode='cards', deck=[], index=0, flipped=false, quiz=null;
let reviewed=new Set();
try { reviewed=new Set(JSON.parse(localStorage.getItem('cloudprep.reviewed') || '[]')); } catch {}
function shuffled(items){
 const copy=items.slice();
 for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
 return copy;
}
function courseBank(){return bank.filter(q=>course===courses[0] || q.course===course);}
function pool(){return courseBank().filter(q=>moduleFilter==='all' || moduleFilter===q.course+'-'+q.module);}
function allowChange(){return !quiz || quiz.done || confirm('Leave this mock quiz and discard this attempt?');}
function reset(){deck=pool();index=0;flipped=false;quiz=null;render();}
function mark(q){reviewed.add(q.id);try{localStorage.setItem('cloudprep.reviewed',JSON.stringify([...reviewed]));}catch{}}
function render(){
 el('banks').innerHTML=courses.map((c,i)=>'<button class="bank '+(c===course?'on':'')+'" data-course="'+i+'" aria-pressed="'+(course===c)+'"><i>'+['▦','⌘','◇'][i]+'</i><span>'+c+'</span><b>'+bank.filter(q=>!i || q.course===c).length+'</b></button>').join('');
 const modules=[...new Map(courseBank().map(q=>[q.course+'-'+q.module,q])).entries()];
 el('module').innerHTML='<option value="all">All modules</option>'+modules.map(([key,q])=>'<option value="'+key+'">'+(course===courses[0]?q.course+' · ':'')+'Module '+q.module+'</option>').join('');
 el('module').value=moduleFilter;
 const filtered=pool(),count=filtered.filter(q=>reviewed.has(q.id)).length;
 el('reviewCount').textContent=count+' / '+filtered.length;el('progress').max=filtered.length;el('progress').value=count;
 for(const [id,active] of [['cardsTab',mode==='cards'],['quizTab',mode==='quiz']]){el(id).classList.toggle('on',active);el(id).setAttribute('aria-pressed',active);}
 el('work').innerHTML=mode==='cards'?card():!quiz?setup():quiz.done?results():quizPage();
}
function btn(action,title,cls='',disabled=false){return '<button data-act="'+action+'" class="'+cls+'" '+(disabled?'disabled':'')+'>'+title+'</button>';}
function heading(q,label){return '<div class="between"><span class="eyebrow">'+label+'</span><span class="chip">'+q.course+' · M'+q.module+'</span></div><h2 class="question">'+escapeHTML(q.prompt)+'</h2>';}
function choices(q,interactive,shown,selected=[]){
 return '<div class="choices">'+q.options.map((o,i)=>{
 const tag=interactive?'button':'div';
 return '<'+tag+' class="choice '+(selected.includes(o)?'selected ':'')+(shown && q.answers.includes(o)?'right':'')+'" '+(interactive?'data-option="'+i+'" aria-pressed="'+selected.includes(o)+'"':'')+'><span class="letter">'+String.fromCharCode(65+i)+'</span><span>'+escapeHTML(o)+'</span></'+tag+'>';
 }).join('')+'</div>';
}
function answer(q){return '<div class="answer"><strong>Answer key</strong><br>'+q.answers.map(escapeHTML).join('<br>')+'</div>';}
function card(){
 const q=deck[index];
 return '<div class="panel">'+heading(q,'FLASHCARD')+choices(q,false,flipped)+(flipped?answer(q):'')+'<div class="actions">'+btn('flip',flipped?'Hide answer':'Reveal answer','primary')+'<div class="controls">'+btn('prev','Previous','',index===0)+btn('next','Next','',index===deck.length-1)+'</div></div></div><div class="actions"><span class="counter">Card '+(index+1)+' of '+deck.length+'</span>'+btn('shuffle','Shuffle deck','linkbtn')+'</div>';
}
function setup(){
 const n=pool().length,sizes=[...new Set([5,10,20,40].filter(x=>x<n).concat(n))];
 return '<div class="panel setup"><small class="eyebrow">EXAM PRACTICE</small><h2 class="question">Start a mock quiz</h2><p class="sub">Practice a random set from your selected bank and module. Multiple-choice questions are scored automatically. For recall questions, compare your response with the key and grade it yourself.</p><label for="length">Questions per quiz</label><select id="length">'+sizes.map(x=>'<option '+(x===Math.min(20,n)?'selected':'')+' value="'+x+'">'+x+(x===n?' (full selection)':' questions')+'</option>').join('')+'</select>'+btn('start','Start quiz','primary')+'</div>';
}
function current(){return quiz.list[quiz.pos];}
function quizPage(){
 const q=current(),a=quiz.responses[quiz.pos],recall=!q.options.length;
 return '<div class="panel">'+heading(q,'QUESTION '+(quiz.pos+1)+' / '+quiz.list.length)+(recall?'<label for="recall">Your answer</label><textarea id="recall" '+(a.revealed?'readonly':'')+'>'+escapeHTML(a.note)+'</textarea>':('<p class="hint">Select '+(q.answers.length===1?'one answer':q.answers.length+' answers')+'.</p>'+choices(q,true,false,a.selected)))+(a.revealed?answer(q):'')+'<div class="actions">'+(recall?(a.revealed?btn('wrong','Missed it')+btn('correct','Got it','primary'):btn('compare','Compare with key','primary',!a.note.trim())):btn('submit',quiz.pos+1===quiz.list.length?'Finish quiz':'Submit answer','primary',a.selected.length!==q.answers.length))+'</div></div>';
}
function start(list){quiz={list,pos:0,done:false,responses:list.map(()=>({note:'',selected:[],revealed:false,ok:false}))};render();}
function finishQuestion(ok){
 quiz.responses[quiz.pos].ok=ok;
 if(quiz.pos+1===quiz.list.length)quiz.done=true;else quiz.pos++;
 render();
}
function results(){
 const score=quiz.responses.filter(a=>a.ok).length,n=quiz.list.length;
 return '<div class="panel"><small class="eyebrow">QUIZ COMPLETE</small><h2>Your results</h2><div class="score">'+Math.round(100*score/n)+'%</div><p>'+score+' of '+n+' correct</p><div class="actions">'+btn('again','New quiz','primary')+(score<n?btn('retry','Retry missed questions'):'')+'</div><h3>Answer review</h3>'+quiz.list.map((q,i)=>{const a=quiz.responses[i];return '<div class="review"><small>'+String(i+1)+' · '+(a.ok?'Correct':'Missed')+(q.options.length?'':' · Self-graded')+'</small><p><strong>'+escapeHTML(q.prompt)+'</strong></p><p>Your answer · '+escapeHTML(a.note || a.selected.join(' / '))+'</p><p>Answer key · '+q.answers.map(escapeHTML).join(' / ')+'</p></div>';}).join('')+'</div>';
}
el('banks').onclick=e=>{const b=e.target.closest('[data-course]');if(b && courses[b.dataset.course]!==course && allowChange()){course=courses[b.dataset.course];moduleFilter='all';reset();}};
el('module').onchange=e=>{if(allowChange()){moduleFilter=e.target.value;reset();}else e.target.value=moduleFilter;};
el('cardsTab').onclick=()=>{if(mode!=='cards' && allowChange()){mode='cards';reset();}};
el('quizTab').onclick=()=>{if(mode!=='quiz'){mode='quiz';reset();}};
el('work').oninput=e=>{if(e.target.id==='recall'){quiz.responses[quiz.pos].note=e.target.value;el('work').querySelector('[data-act="compare"]').disabled=!e.target.value.trim();}};
el('work').onclick=e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.option!==undefined){
  const q=current(),a=quiz.responses[quiz.pos],o=q.options[Number(b.dataset.option)];
  if(q.answers.length===1)a.selected=[o];else if(a.selected.includes(o))a.selected=a.selected.filter(v=>v!==o);else a.selected.push(o);
  render();return;
 }
 switch(b.dataset.act){
 case 'prev':index--;flipped=false;break;
 case 'next':index++;flipped=false;break;
 case 'flip':flipped=!flipped;if(flipped)mark(deck[index]);break;
 case 'shuffle':deck=shuffled(deck);index=0;flipped=false;break;
 case 'start':start(shuffled(pool()).slice(0,Number(el('length').value)));return;
 case 'compare':quiz.responses[quiz.pos].revealed=true;break;
 case 'submit':finishQuestion(current().answers.every(o=>quiz.responses[quiz.pos].selected.includes(o)));return;
 case 'correct':case 'wrong':finishQuestion(b.dataset.act==='correct');return;
 case 'again':quiz=null;break;
 case 'retry':start(shuffled(quiz.list.filter((q,i)=>!quiz.responses[i].ok)));return;
 }
 render();
};
reset();
