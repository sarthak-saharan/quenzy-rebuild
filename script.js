/* ══════════════════ SCRATCH CARD ══════════════════ */
let scratchRevealed = false;
let isSubscribed = false;
let currentPack = 6;
let currentBasePrice = 475;

function openScratch() {
  scratchRevealed = false;
  document.getElementById('scratchStep').style.display = 'block';
  document.getElementById('waStep').classList.remove('show');
  document.getElementById('successStep').classList.remove('show');
  document.getElementById('scratchHint').classList.remove('hidden');
  document.getElementById('waNumber').value = '';
  document.getElementById('waNumber').style.borderColor = '';
  document.getElementById('waNumber').style.boxShadow = '';
  document.getElementById('scratchOverlay').classList.add('active');
  requestAnimationFrame(() => requestAnimationFrame(() => initScratch()));
}

function closeScratch() {
  document.getElementById('scratchOverlay').classList.remove('active');
}

function scrollToQuiz() {
  document.getElementById('quizSection').scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(openQuiz, 700);
}

function initScratch() {
  const wrap = document.getElementById('scratchWrap');
  const W = wrap.offsetWidth * 2;
  const H = wrap.offsetHeight * 2;

  const oldCanvas = document.getElementById('scratchCanvas');
  const newCanvas = document.createElement('canvas');
  newCanvas.id = 'scratchCanvas';
  newCanvas.className = 'scratch-canvas';
  newCanvas.width = W;
  newCanvas.height = H;
  oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);

  const ctx = newCanvas.getContext('2d');

  // Gold scratch surface — fillRect guarantees full coverage, no gaps
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0,    '#7A5500');
  grad.addColorStop(0.12, '#C89020');
  grad.addColorStop(0.28, '#EAB830');
  grad.addColorStop(0.44, '#C07810');
  grad.addColorStop(0.58, '#E0A820');
  grad.addColorStop(0.74, '#A86800');
  grad.addColorStop(0.88, '#D0A020');
  grad.addColorStop(1,    '#7A5500');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Texture dots
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  for (let tx = 12; tx < W - 12; tx += 36) {
    for (let ty = 12; ty < H - 12; ty += 36) {
      ctx.beginPath();
      ctx.arc(tx, ty, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Shine overlay
  const shine = ctx.createLinearGradient(0, 0, W * 0.7, H * 0.7);
  shine.addColorStop(0,    'rgba(255,255,255,0.28)');
  shine.addColorStop(0.45, 'rgba(255,255,255,0.05)');
  shine.addColorStop(1,    'rgba(255,255,255,0.12)');
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, W, H);

  // Scratch label
  ctx.fillStyle = 'rgba(60,35,0,0.65)';
  ctx.font = `bold ${Math.round(H * 0.15)}px Montserrat, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦  SCRATCH HERE  ✦', W / 2, H * 0.42);
  ctx.font = `${Math.round(H * 0.105)}px Montserrat, sans-serif`;
  ctx.fillStyle = 'rgba(60,35,0,0.45)';
  ctx.fillText('Reveal your exclusive discount', W / 2, H * 0.60);

  ctx.globalCompositeOperation = 'destination-out';

  let isDrawing = false;
  let scratchCount = 0;

  function getPos(e) {
    const rect = newCanvas.getBoundingClientRect();
    const scaleX = newCanvas.width / rect.width;
    const scaleY = newCanvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * scaleX, y: (src.clientY - rect.top) * scaleY };
  }

  function doScratch(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, Math.round(H * 0.18), 0, Math.PI * 2);
    ctx.fill();
    scratchCount++;
    if (scratchCount > 8 && !scratchRevealed) {
      scratchRevealed = true;
      document.getElementById('scratchHint').classList.add('hidden');
      spawnConfetti();
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, Math.max(W, H), 0, Math.PI * 2);
      ctx.fill();
      setTimeout(showWAStep, 500);
    }
  }

  newCanvas.addEventListener('mousedown',  e => { isDrawing = true; doScratch(e); });
  newCanvas.addEventListener('mousemove',  doScratch);
  newCanvas.addEventListener('mouseup',    () => isDrawing = false);
  newCanvas.addEventListener('mouseleave', () => isDrawing = false);
  newCanvas.addEventListener('touchstart', e => { isDrawing = true; doScratch(e); }, { passive: false });
  newCanvas.addEventListener('touchmove',  doScratch, { passive: false });
  newCanvas.addEventListener('touchend',   () => isDrawing = false);
}

function spawnConfetti() {
  const modal = document.querySelector('.scratch-modal');
  const colors = ['#EF5323','#F1C644','#DB2557','#3ED660','#3161CB'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    const size = 6 + Math.random() * 7;
    p.style.cssText = `left:${5 + Math.random()*85}%;top:${15+Math.random()*35}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      transform:rotate(${Math.random()*360}deg);
      animation-delay:${Math.random()*0.25}s;
      width:${size}px;height:${size}px;
      border-radius:${Math.random()>0.5?'50%':'3px'};`;
    modal.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}

function showWAStep() {
  document.getElementById('scratchStep').style.display = 'none';
  document.getElementById('waStep').classList.add('show');
}

function sendToWA() {
  const input = document.getElementById('waNumber');
  const val = input.value.trim();
  if (!/^\d{10}$/.test(val)) {
    input.style.borderColor = 'var(--error)';
    input.style.boxShadow = 'var(--error) 0px 0px 0px 3px inset';
    input.placeholder = 'Please enter all 10 digits';
    input.focus();
    return;
  }
  document.getElementById('waStep').classList.remove('show');
  document.getElementById('successStep').classList.add('show');
  spawnConfetti();
}


/* ══════════════════ QUIZ ══════════════════ */
const questions = [
  { q:"What's your daily vibe? 😎", sub:"Tell us about your lifestyle",
    options:[
      {emoji:'💼',label:'Hustle mode',sub:'Office / work from home',val:'office'},
      {emoji:'🏋️',label:'Gym rat',sub:'Fitness first always',val:'fitness'},
      {emoji:'🧘',label:'Wellness first',sub:'Mindful living',val:'wellness'},
      {emoji:'🎉',label:'Social butterfly',sub:'Always out & about',val:'social'},
    ]},
  { q:"What's your health goal? 🎯", sub:"What matters most to you",
    options:[
      {emoji:'🌿',label:'Gut health',sub:'Feed my good bacteria',val:'gut'},
      {emoji:'🔥',label:'Low calories',sub:'Keep it light',val:'calorie'},
      {emoji:'🚫',label:'No sugar',sub:'Cut the sweetness',val:'nosugar'},
      {emoji:'⚡',label:'All of the above',sub:"I want it all!",val:'all'},
    ]},
  { q:"What's your taste mood? 👅", sub:"Pick what sounds most like you",
    options:[
      {emoji:'❄️',label:'Fresh & cooling',sub:'Minty, crisp, clean',val:'fresh'},
      {emoji:'🫐',label:'Fruity & fun',sub:'Berries, tropical vibes',val:'fruity'},
      {emoji:'🍊',label:'Sweet & indulgent',sub:'Dessert-y flavours',val:'sweet'},
      {emoji:'🎲',label:'Surprise me!',sub:'I like discovering',val:'surprise'},
    ]},
  { q:"How often would you sip? 🥤", sub:"So we can find your best pack",
    options:[
      {emoji:'🌅',label:'Daily ritual',sub:'One a day keeps me sane',val:'daily'},
      {emoji:'📅',label:'Few times a week',sub:'My healthy treat',val:'weekly'},
      {emoji:'🎁',label:'For occasions',sub:'Parties, events, guests',val:'occasion'},
      {emoji:'🤷',label:'Just trying it out',sub:'New to prebiotic sodas',val:'new'},
    ]},
];

let currentQ = 0, answers = [], selectedOption = null;

function openQuiz() {
  currentQ = 0; answers = []; selectedOption = null;
  renderQuestion();
  document.getElementById('quizOverlay').classList.add('active');
}
function closeQuiz() { document.getElementById('quizOverlay').classList.remove('active'); }

function renderQuestion() {
  const q = questions[currentQ];
  for (let i = 0; i < 4; i++) document.getElementById('qp'+(i+1)).classList.toggle('done', i <= currentQ);
  document.getElementById('quizContent').innerHTML = `
    <h2>${q.q}</h2><p class="q-sub">${q.sub}</p>
    <div class="quiz-options">
      ${q.options.map(o=>`
        <div class="quiz-option" onclick="selectOption(this,'${o.val}')">
          <span class="opt-emoji">${o.emoji}</span>
          <div class="opt-label">${o.label}</div>
          <div class="opt-sub">${o.sub}</div>
        </div>`).join('')}
    </div>`;
  const btn = document.getElementById('quizNextBtn');
  btn.classList.remove('enabled'); selectedOption = null;
  btn.textContent = currentQ < 3 ? 'Continue →' : 'Find My Fizz! ✨';
}

function selectOption(el, val) {
  document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected'); selectedOption = val;
  document.getElementById('quizNextBtn').classList.add('enabled');
}

function nextQuiz() {
  if (!selectedOption) return;
  answers.push(selectedOption);
  if (currentQ < 3) { currentQ++; renderQuestion(); }
  else {
    closeQuiz();
    const map = {fresh:'cucumber',fruity:'blueberry',sweet:'orange',surprise:'blueberry'};
    setTimeout(() => openResult(map[answers[2]] || 'cucumber'), 200);
  }
}


/* ══════════════════ RESULT + SUBSCRIBE ══════════════════ */
const flavors = {
  cucumber: { emoji:'🥒', name:'Cucumber-Mint',   bgCard:'#E8F5EE', textColor:'#2D5A3D', bg:'linear-gradient(135deg,#A7F3D0,#059669)', desc:'Spa-like serenity in a sip. Crisp cucumber and cooling mint with a fizzy lift.' },
  blueberry:{ emoji:'🫐', name:'Blueberry Litchi', bgCard:'#FEF0F6', textColor:'#9D174D', bg:'linear-gradient(135deg,#FBCFE8,#EC4899)', desc:'Sweet blueberries and exotic litchi, fizzed up and guilt-free. Your afternoon pick-me-up.' },
  orange:   { emoji:'🍊', name:'Orange & Cream',   bgCard:'#FFF7ED', textColor:'#B45309', bg:'linear-gradient(135deg,#FED7AA,#F97316)', desc:'Ice cream in a can — without the guilt. Orange meets creamy vanilla in the most nostalgic sip.' },
};
let currentFlavor = 'cucumber';

function openResult(flavor) {
  currentFlavor = flavor;
  const f = flavors[flavor];
  document.getElementById('resultEmoji').textContent = f.emoji;
  document.getElementById('resultSub').textContent = 'We found your fizz ✨';
  const card = document.getElementById('resultCard');
  card.style.background = f.bgCard;
  card.innerHTML = `
    <div class="flavor-icon-big" style="background:${f.bg}"><span style="font-size:36px">${f.emoji}</span></div>
    <div>
      <h3 style="color:${f.textColor}">${f.name}</h3>
      <p>${f.desc}</p>
      <div class="result-price" style="color:${f.textColor}">₹475 <s>₹594</s></div>
    </div>`;
  isSubscribed = false; currentPack = 6; currentBasePrice = 475;
  document.getElementById('subToggle').classList.remove('on');
  document.getElementById('subDetails').classList.remove('open');
  document.getElementById('subToggleWrap').classList.remove('active');
  updatePricing();
  document.getElementById('resultOverlay').classList.add('active');
}
function closeResult() { document.getElementById('resultOverlay').classList.remove('active'); }

function selectPack(btn, price, qty) {
  document.querySelectorAll('.pack-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active'); currentPack = qty; currentBasePrice = price; updatePricing();
}
function toggleSub() {
  isSubscribed = !isSubscribed;
  document.getElementById('subToggle').classList.toggle('on', isSubscribed);
  document.getElementById('subDetails').classList.toggle('open', isSubscribed);
  document.getElementById('subToggleWrap').classList.toggle('active', isSubscribed);
  updatePricing();
}
function selectFreq(btn) {
  document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function updatePricing() {
  const base = currentBasePrice;
  const discounted = isSubscribed ? Math.round(base * 0.85) : base;
  const savings = base - discounted;
  document.getElementById('finalPrice').textContent = '₹' + discounted;
  document.getElementById('origPrice').textContent   = '₹' + (isSubscribed ? base : Math.round(base * 1.25));
  document.getElementById('perCanPrice').textContent = '₹' + (discounted / currentPack).toFixed(2) + ' per can';
  document.getElementById('savingsAmt').textContent  = savings;
  document.getElementById('totalSave').textContent   = '₹' + savings;
}
function addToCart() {
  const btn = document.querySelector('.btn-add-cart');
  btn.textContent = '✅ Added to Cart!'; btn.style.background = 'var(--success)';
  setTimeout(() => { btn.textContent = 'Add to Cart 🛒'; btn.style.background = ''; closeResult(); }, 1500);
}

/* Auto-show scratch card once per session */
window.addEventListener('load', () => {
  setTimeout(() => {
    if (!sessionStorage.getItem('scratchSeen')) {
      openScratch();
      sessionStorage.setItem('scratchSeen', '1');
    }
  }, 2000);
});
