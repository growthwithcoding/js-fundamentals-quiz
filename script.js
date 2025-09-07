// ===============================================
// SCRIPT.JS — DOMination Quiz Brain
// Spunky commentary included, free of charge.
// - Data lives at the top (add your questions!)
// - Pure DOM, no frameworks, no frills
// - Instant red/green feedback, keyboard-friendly
// ===============================================

// QUIZ DATA — swap in your own Qs to taste
// Each item = { question, options[...], answer:index }
const quizData = [
  { question: "Which array method adds an element to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], answer: 0 },
  { question: "What keyword declares a block-scoped variable?", options: ["var", "let", "def", "static"], answer: 1 },
  { question: "What does document.querySelector('div.title') return?", options: ["A NodeList", "The first element", "An HTMLCollection", "Always null"], answer: 1 },
  { question: "Which loop runs at least once before its condition is checked?", options: ["for", "while", "do...while", "for...of"], answer: 2 },
  { question: "What is the result of typeof null?", options: ["'null'", "'object'", "'undefined'", "'number'"], answer: 1 }
];

// STATE — the tiny brain that remembers stuff between clicks
let currentIndex = 0;   // which question are we on?
let score = 0;          // how many high-fives so far
let accepting = true;   // block double-click chaos
let randomizeQuestions = true; // shuffle? yes chef

// DOM cache — fewer queries, more speed, extra tidy
const startEl = document.getElementById('start-container');
const shuffleToggle = document.getElementById('shuffle-toggle');

const quizEl = document.getElementById('quiz-container');
const qNumEl = document.getElementById('qnum');
const qTotalEl = document.getElementById('qtotal');
const questionEl = document.getElementById('question-container');
const optionsEl = document.getElementById('options-container');
const nextBtn = document.getElementById('next-button');
const scoreEl = document.getElementById('score');

const scoreScreen = document.getElementById('score-container');
const finalText = document.getElementById('final-text');
const restartBtn = document.getElementById('restart-button');
const reviewBtn = document.getElementById('review-button');
const reviewPanel = document.getElementById('review-panel');

// Review history so we can show what was picked later
let askedQuestions = []; // {question, options, answer, picked}

// Fisher–Yates shuffle (fair, fast, fabulous)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]; // swap dance
  }
  return a;
}

// Paint the current question onto the page
function loadQuestion() {
  accepting = true;         // arms open for clicks
  nextBtn.disabled = true;  // no skipping the line

  const current = askedQuestions[currentIndex];
  qNumEl.textContent = currentIndex + 1;
  qTotalEl.textContent = askedQuestions.length;

  questionEl.textContent = current.question;
  optionsEl.innerHTML = '';

  current.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'btn option-btn';
    btn.type = 'button';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectOption(idx, btn));
    optionsEl.appendChild(btn);
  });

  // lil' entrance animation for nice feel
  quizEl.classList.add('fade');
  // If last question, change button text to 'Show Results', else 'Next Question'
  if (currentIndex === askedQuestions.length - 1) {
    nextBtn.textContent = 'Show Results';
  } else {
    nextBtn.textContent = 'Next Question';
  }
  setTimeout(() => quizEl.classList.remove('fade'), 250);
}

// Deal with a pick (and keep it honest)
function selectOption(selectedIndex, selectedBtn) {
  if (!accepting) return;   // nope, one pick per question
  accepting = false;

  const current = askedQuestions[currentIndex];
  const correctIndex = current.answer;

  // lock all buttons, reveal the truth
  const optionButtons = optionsEl.querySelectorAll('button');
  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correctIndex) btn.classList.add('correct');
  });

  // points if you nailed it, gentle red if not
  if (selectedIndex === correctIndex) {
    score++;
    scoreEl.textContent = String(score);
  } else {
    selectedBtn.classList.add('incorrect');
  }

  // receipts for review mode
  current.picked = selectedIndex;

  nextBtn.disabled = false;
  nextBtn.focus();
}

// Next up or show the scoreboard
nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < askedQuestions.length) loadQuestion();
  else showScore();
});

// Final tally + cleanup of review panel
function showScore() {
  quizEl.classList.add('hidden');
  scoreScreen.classList.remove('hidden');
  finalText.textContent = `You scored ${score} out of ${askedQuestions.length}.`;
  reviewPanel.innerHTML = '';
  reviewPanel.classList.add('hidden');
}

// New game smell
function startQuiz() {
  // pick the order (random or straight)
  askedQuestions = randomizeQuestions ? shuffle(quizData) : [...quizData];
  // strip old choices so review stays accurate
  askedQuestions = askedQuestions.map(q => ({ ...q, picked: null }));

  currentIndex = 0;
  score = 0;
  scoreEl.textContent = '0';

  startEl.classList.add('hidden');
  scoreScreen.classList.add('hidden');
  quizEl.classList.remove('hidden');

  loadQuestion();
}

document.getElementById('start-button').addEventListener('click', startQuiz);
// patched: restart now goes back to start screen
restartBtn.addEventListener('click', () => {
  scoreScreen.classList.add('hidden');
  startEl.classList.remove('hidden');
});

// Optional: study hall after the exam
reviewBtn.addEventListener('click', () => {
  if (!reviewPanel.classList.contains('hidden')) {
    reviewPanel.classList.add('hidden');
    reviewBtn.textContent = 'Review Answers';
    return;
  }

  const frag = document.createDocumentFragment();
  askedQuestions.forEach((q, i) => {
    const wrap = document.createElement('div');
    // Special class so CSS can keep these inside the parent
    wrap.className = 'card stack review-card';
    wrap.style.padding = '16px';
    wrap.innerHTML = `
      <div class="qmeta">Question ${i + 1} of ${askedQuestions.length}</div>
      <div class="question">${q.question}</div>
    `;
    q.options.forEach((opt, idx) => {
      const b = document.createElement('button');
      b.className = 'btn option-btn';
      b.disabled = true; // it's review, not a redo
      b.textContent = opt;
      if (idx === q.answer) b.classList.add('correct');
      if (idx === q.picked && q.picked !== q.answer) b.classList.add('incorrect');
      wrap.appendChild(b);
    });
    frag.appendChild(wrap);
  });
  reviewPanel.innerHTML = '';
  reviewPanel.appendChild(frag);
  reviewPanel.classList.remove('hidden');
  reviewBtn.textContent = 'Hide Review';
});

// Shuffle toggle = chaos knob
shuffleToggle.addEventListener('click', () => {
  randomizeQuestions = !randomizeQuestions;
  shuffleToggle.setAttribute('aria-pressed', String(randomizeQuestions));
  shuffleToggle.textContent = `Shuffle: ${randomizeQuestions ? 'On' : 'Off'}`;
});

// Keyboard shortcuts = fast fingers win
// Enter advances when allowed; number keys 1–9 pick options
// Accessibility note: aria-live on the quiz container announces updates
document.addEventListener('keydown', (e) => {
  if (!quizEl.classList.contains('hidden')) {
    if (e.key === 'Enter' && !nextBtn.disabled) nextBtn.click();
    const n = Number(e.key);
    if (Number.isInteger(n) && n >= 1 && n <= 9) {
      const btn = optionsEl.querySelectorAll('button')[n - 1];
      if (btn) btn.click();
    }
  }
});
