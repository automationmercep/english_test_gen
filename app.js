const STORAGE_KEY = "bright-english-quizzes-v1";
const CATEGORIES_STORAGE_KEY = "bright-english-categories-v1";
const SOUND_MESSAGES_STORAGE_KEY = "bright-english-sound-messages-v1";
const DAILY_WORDS_STORAGE_KEY = "bright-english-daily-words-v1";
const AUTO_ADVANCE_STORAGE_KEY = "bright-english-auto-advance-v1";
const THEME_STORAGE_KEY = "bright-english-theme-v1";
const MUSIC_STORAGE_KEY = "bright-english-music-v1";
const SR_STORAGE_KEY = "bright-english-sr-v1";
const QUESTION_TIME_STORAGE_KEY = "bright-english-qtime-v1";
const READ_ANSWER_STORAGE_KEY = "bright-english-read-answer-v1";
const DEFAULT_SOUND_MESSAGES = {
  correct: "Correct answer",
  wrong: "Wrong answer",
  perfect: "Brawo Lila",
  belowPerfect: "Spróbuj jeszcze raz"
};
const DEFAULT_DAILY_WORDS = [
  { word: "curious", pronunciation: "/ˈkjʊə.ri.əs/", translation: "ciekawy" },
  { word: "brave", pronunciation: "/breɪv/", translation: "odważny" },
  { word: "cheerful", pronunciation: "/ˈtʃɪə.fəl/", translation: "radosny" },
  { word: "journey", pronunciation: "/ˈdʒɜː.ni/", translation: "podróż" },
  { word: "improve", pronunciation: "/ɪmˈpruːv/", translation: "poprawiać" },
  { word: "thoughtful", pronunciation: "/ˈθɔːt.fəl/", translation: "troskliwy" },
  { word: "peaceful", pronunciation: "/ˈpiːs.fəl/", translation: "spokojny" },
  { word: "discover", pronunciation: "/dɪˈskʌv.ər/", translation: "odkrywać" },
  { word: "confident", pronunciation: "/ˈkɒn.fɪ.dənt/", translation: "pewny siebie" },
  { word: "grateful", pronunciation: "/ˈɡreɪt.fəl/", translation: "wdzięczny" },
  { word: "challenge", pronunciation: "/ˈtʃæl.ɪndʒ/", translation: "wyzwanie" },
  { word: "achieve", pronunciation: "/əˈtʃiːv/", translation: "osiągać" },
  { word: "gentle", pronunciation: "/ˈdʒen.təl/", translation: "łagodny" },
  { word: "clever", pronunciation: "/ˈklev.ər/", translation: "sprytny" },
  { word: "patient", pronunciation: "/ˈpeɪ.ʃənt/", translation: "cierpliwy" },
  { word: "useful", pronunciation: "/ˈjuːs.fəl/", translation: "przydatny" },
  { word: "exciting", pronunciation: "/ɪkˈsaɪ.tɪŋ/", translation: "ekscytujący" },
  { word: "friendly", pronunciation: "/ˈfrend.li/", translation: "przyjazny" },
  { word: "careful", pronunciation: "/ˈkeə.fəl/", translation: "ostrożny" },
  { word: "wonderful", pronunciation: "/ˈwʌn.də.fəl/", translation: "wspaniały" }
];

const starterQuizzes = [
  {
    id: "everyday-english",
    title: "Everyday English",
    level: "A2",
    category: "Codzienność",
    questions: [
      { type: "choice", prompt: "How ___ you today?", answers: ["is", "are", "am", "be"], correct: 1 },
      { type: "fill", prompt: "Uzupełnij: I ___ coffee every morning.", answer: "drink" },
      { type: "choice", prompt: "Wybierz poprawne tłumaczenie: „Mam dwie siostry.”", answers: ["I have two sisters.", "I has two sisters.", "I am two sisters.", "I got sister two."], correct: 0 },
      { type: "choice", prompt: "What time ___ the shop open?", answers: ["do", "does", "is", "are"], correct: 1 },
      { type: "fill", prompt: "Uzupełnij: She is good ___ cooking.", answer: "at" },
      { type: "choice", prompt: "Które zdanie jest poprawne?", answers: ["He don't like rain.", "He doesn't likes rain.", "He doesn't like rain.", "He not like rain."], correct: 2 }
    ]
  },
  {
    id: "travel-essentials",
    title: "Travel Essentials",
    level: "B1",
    category: "Podróże",
    questions: [
      { type: "choice", prompt: "Where can I ___ my luggage?", answers: ["leave", "leaving", "left", "leaves"], correct: 0 },
      { type: "fill", prompt: "Uzupełnij: I'd like a window ___, please.", answer: "seat" },
      { type: "choice", prompt: "Co znaczy „delayed”?", answers: ["odwołany", "opóźniony", "zarezerwowany", "zatłoczony"], correct: 1 },
      { type: "choice", prompt: "Could you tell me how to get ___ the station?", answers: ["at", "on", "to", "for"], correct: 2 },
      { type: "fill", prompt: "Uzupełnij: Is breakfast ___ in the price?", answer: "included" }
    ]
  },
  {
    id: "past-simple",
    title: "Past Simple",
    level: "A2",
    category: "Gramatyka",
    questions: [
      { type: "choice", prompt: "Yesterday, we ___ to the cinema.", answers: ["go", "went", "gone", "going"], correct: 1 },
      { type: "fill", prompt: "Uzupełnij: She ___ (buy) a new book last week.", answer: "bought" },
      { type: "choice", prompt: "___ you see Tom yesterday?", answers: ["Do", "Were", "Did", "Have"], correct: 2 },
      { type: "choice", prompt: "Wybierz poprawne zdanie przeczące.", answers: ["I didn't called.", "I not call.", "I didn't call.", "I don't called."], correct: 2 }
    ]
  },
  {
    id: "grammar-power-pack",
    title: "Grammar Power Pack",
    level: "A1",
    category: "Gramatyka",
    dynamic: true,
    questions: [
      { type: "choice", prompt: "I ___ happy today.", answers: ["am", "is", "are", "be"], correct: 0 },
      { type: "choice", prompt: "My sister ___ twelve years old.", answers: ["am", "are", "is", "be"], correct: 2 },
      { type: "fill", prompt: "Uzupełnij jednym słowem: We ___ from Poland.", answer: "are" },
      { type: "choice", prompt: "Wybierz poprawne przeczenie: He is tired.", answers: ["He not is tired.", "He isn't tired.", "He don't tired.", "He aren't tired."], correct: 1 },
      { type: "choice", prompt: "___ they at school now?", answers: ["Is", "Am", "Are", "Be"], correct: 2 },
      { type: "fill", prompt: "Uzupełnij pytanie jednym słowem: ___ she your teacher?", answer: "Is" },
      { type: "choice", prompt: "Wybierz poprawne zdanie.", answers: ["You is very kind.", "You are very kind.", "You am very kind.", "You be very kind."], correct: 1 },
      { type: "fill", prompt: "Uzupełnij przeczenie jednym słowem: I ___ not hungry.", answer: "am" },
      { type: "choice", prompt: "Tom ___ got a new bicycle.", answers: ["have", "has", "is", "can"], correct: 1 },
      { type: "fill", prompt: "Uzupełnij jednym słowem: We ___ got two cats.", answer: "have" },
      { type: "choice", prompt: "Wybierz poprawne przeczenie: She has got a dog.", answers: ["She hasn't got a dog.", "She haven't got a dog.", "She doesn't got a dog.", "She not has got a dog."], correct: 0 },
      { type: "choice", prompt: "___ you got a brother?", answers: ["Has", "Are", "Have", "Can"], correct: 2 },
      { type: "fill", prompt: "Uzupełnij pytanie jednym słowem: ___ Anna got blue eyes?", answer: "Has" },
      { type: "choice", prompt: "Wybierz poprawne zdanie.", answers: ["They has got a big house.", "They have got a big house.", "They got have a big house.", "They are got a big house."], correct: 1 },
      { type: "fill", prompt: "Uzupełnij przeczenie jednym słowem: Jack hasn't ___ a laptop.", answer: "got" },
      { type: "choice", prompt: "Has your mum got a car? — Wybierz krótką odpowiedź twierdzącą.", answers: ["Yes, she have.", "Yes, she is.", "Yes, she has.", "Yes, she got."], correct: 2 },
      { type: "choice", prompt: "Birds ___ fly.", answers: ["can", "are", "have", "has"], correct: 0 },
      { type: "fill", prompt: "Uzupełnij jednym słowem: My little brother ___ swim very well.", answer: "can" },
      { type: "choice", prompt: "Wybierz poprawne przeczenie: I can speak Spanish.", answers: ["I don't can speak Spanish.", "I can not to speak Spanish.", "I can't speak Spanish.", "I am not can speak Spanish."], correct: 2 },
      { type: "choice", prompt: "___ your dad cook?", answers: ["Is", "Has", "Does can", "Can"], correct: 3 },
      { type: "fill", prompt: "Uzupełnij pytanie jednym słowem: ___ I open the window?", answer: "Can" },
      { type: "choice", prompt: "Can Emma play the piano? — Wybierz krótką odpowiedź przeczącą.", answers: ["No, she can't.", "No, she isn't.", "No, she doesn't can.", "No, she hasn't."], correct: 0 },
      { type: "choice", prompt: "Które pytanie jest poprawne?", answers: ["Can you to help me?", "Do you can help me?", "Are you can help me?", "Can you help me?"], correct: 3 },
      { type: "fill", prompt: "Uzupełnij przeczenie jednym słowem: Cats ___ fly.", answer: "can't" }
    ]
  }
];

let quizzes = loadQuizzes();
let customCategories = loadCategories();

// Gdy Firebase załaduje dane z chmury, zastąp lokalne
window.__onCloudQuizzesLoaded = function(cloudQuizzes) {
  if (cloudQuizzes && cloudQuizzes.length > 0) {
    quizzes = cloudQuizzes.map(function(q) { var savedAt = q.savedAt; var rest = Object.assign({}, q); delete rest.savedAt; return rest; });
    customCategories = loadCategories();
    renderQuizGrid();
    showToast("Testy załadowane z chmury ☁");
  } else if (window.__firebaseFirstSync) {
    // pierwsze logowanie – wyślij lokalne testy do Firebase
    if (typeof window.firebaseDB !== "undefined" && quizzes.length > 0) {
      window.firebaseDB.saveAllQuizzes(quizzes).then(function() {
        showToast("Testy zsynchronizowane z chmurą ☁");
      });
    }
    renderQuizGrid();
  } else {
    renderQuizGrid();
  }
};
let soundMessages = loadSoundMessages();
let dailyWords = loadDailyWords();
let activeQuiz = null;
let questionIndex = 0;
let selectedAnswer = null;
let hasChecked = false;
let results = [];
let soundEnabled = true;
let musicEnabled = localStorage.getItem(MUSIC_STORAGE_KEY) !== "false";
let musicCtx = null;
let musicMaster = null;
let musicTimer = null;
let musicChordStep = 0;
let srData = loadSrData();
let questionTimeLimit = loadQuestionTimeLimit();
let readAnswer = loadReadAnswer();
let questionTimerInterval = null;
let questionTimerRemaining = 0;
let autoAdvanceSeconds = loadAutoAdvanceSeconds();
let autoAdvanceTimer = null;
let autoAdvanceCountdownTimer = null;
let resultsShown = false;
let questionCounter = 0;
let editingQuizId = null;
let creatorImageData = "";
let activeCategory = "all";
let draggingQuizId = null;
let suppressCardClick = false;
let mouseQuizDrag = null;
let pendingCategoryDeletion = null;
let matchSelectedTileId = null;
const MATCH_COLORS = ["#2fa4dc", "#d1263f", "#f0a95c", "#1c7a41", "#c25fd1", "#2340b8", "#2bbd80", "#e2551f", "#7332c4", "#1e9bdb"];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function loadQuizzes() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starterQuizzes));
    return starterQuizzes;
  }
  catch { return starterQuizzes; }
}
function saveQuizzes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
}
function loadCategories() {
  try {
    const saved = JSON.parse(localStorage.getItem(CATEGORIES_STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch {}
  return [...new Set(quizzes.map(quiz => quiz.category || "Angielski"))];
}
function saveCategories() { localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(customCategories)); }
function loadSoundMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem(SOUND_MESSAGES_STORAGE_KEY));
    return saved && typeof saved === "object" ? { ...DEFAULT_SOUND_MESSAGES, ...saved } : { ...DEFAULT_SOUND_MESSAGES };
  } catch {
    return { ...DEFAULT_SOUND_MESSAGES };
  }
}
function saveSoundMessages() { localStorage.setItem(SOUND_MESSAGES_STORAGE_KEY, JSON.stringify(soundMessages)); }
function loadDailyWords() {
  try {
    const saved = JSON.parse(localStorage.getItem(DAILY_WORDS_STORAGE_KEY));
    return Array.isArray(saved) && saved.length ? saved : [...DEFAULT_DAILY_WORDS];
  } catch {
    return [...DEFAULT_DAILY_WORDS];
  }
}
function saveDailyWords() { localStorage.setItem(DAILY_WORDS_STORAGE_KEY, JSON.stringify(dailyWords)); }
function loadAutoAdvanceSeconds() {
  const stored = localStorage.getItem(AUTO_ADVANCE_STORAGE_KEY);
  if (stored === null) return 5;
  const saved = Number(stored);
  return Number.isFinite(saved) && saved >= 0 && saved <= 60 ? saved : 5;
}
function saveAutoAdvanceSeconds() { localStorage.setItem(AUTO_ADVANCE_STORAGE_KEY, String(autoAdvanceSeconds)); }
function loadSrData() {
  try { const saved = JSON.parse(localStorage.getItem(SR_STORAGE_KEY)); return saved && typeof saved === "object" ? saved : {}; }
  catch { return {}; }
}
function saveSrData() { localStorage.setItem(SR_STORAGE_KEY, JSON.stringify(srData)); }
function loadQuestionTimeLimit() {
  const stored = localStorage.getItem(QUESTION_TIME_STORAGE_KEY);
  if (stored === null) return 0;
  const val = Number(stored);
  return Number.isFinite(val) && val >= 0 && val <= 300 ? val : 0;
}
function saveQuestionTimeLimit() { localStorage.setItem(QUESTION_TIME_STORAGE_KEY, String(questionTimeLimit)); }
function loadReadAnswer() { return localStorage.getItem(READ_ANSWER_STORAGE_KEY) !== "false"; }
function saveReadAnswer() { localStorage.setItem(READ_ANSWER_STORAGE_KEY, String(readAnswer)); }
function escapeHtml(value = "") { return value.replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char])); }

function renderRandomDailyWord() {
  const lastWord = sessionStorage.getItem("bright-english-last-word");
  const availableWords = dailyWords.filter(item => item.word !== lastWord);
  const selected = availableWords[Math.floor(Math.random() * availableWords.length)] || dailyWords[0];
  $("#dailyWord").textContent = selected.word;
  $("#dailyPronunciation").textContent = selected.pronunciation;
  $("#dailyPronunciation").hidden = !selected.pronunciation;
  $("#dailyTranslation").textContent = selected.translation;
  sessionStorage.setItem("bright-english-last-word", selected.word);
}

function formatDailyWordCsvField(value) {
  const text = String(value || "");
  return /[,"\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

function dailyWordsToCsv(words) {
  return words.map(item => [
    formatDailyWordCsvField(item.word),
    formatDailyWordCsvField(item.translation)
  ].join(", ")).join("\n");
}

function openDailyWordsSettings() {
  $("#dailyWordsInput").value = dailyWordsToCsv(dailyWords);
  $("#dailyWordsModal").hidden = false;
  setTimeout(() => $("#dailyWordsInput").focus(), 0);
}

function closeDailyWordsSettings() {
  $("#dailyWordsModal").hidden = true;
}

function restoreDefaultDailyWords() {
  $("#dailyWordsInput").value = dailyWordsToCsv(DEFAULT_DAILY_WORDS);
  showToast("Wczytano domyślną listę — kliknij „Zapisz listę\u201d");
}

function saveConfiguredDailyWords(event) {
  event.preventDefault();
  const rows = $("#dailyWordsInput").value.split(/\r?\n/).filter(line => line.trim());
  const parsed = rows.map(parseCsvLine).map(fields => {
    if (!fields || fields.length < 2) return null;
    const [word, ...translationParts] = fields;
    const translation = translationParts.join(",").trim();
    if (!word.trim() || !translation) return null;
    return { word: word.trim(), pronunciation: "", translation };
  }).filter(Boolean);
  if (!parsed.length) return showToast("Nie znaleziono prawidłowych słówek");
  dailyWords = parsed;
  saveDailyWords();
  sessionStorage.removeItem("bright-english-last-word");
  renderRandomDailyWord();
  closeDailyWordsSettings();
  const skipped = rows.length - parsed.length;
  const wordLabel = parsed.length === 1 ? "słówko" : parsed.length >= 2 && parsed.length <= 4 ? "słówka" : "słówek";
  showToast("Zapisano " + parsed.length + " " + wordLabel + (skipped ? ". Pominięto: " + skipped : ""));
}

function shuffled(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pick(items) { return items[Math.floor(Math.random() * items.length)]; }
function capitalize(value) { return value.charAt(0).toUpperCase() + value.slice(1); }

function choiceQuestion(prompt, correctAnswer, distractors) {
  const answers = shuffled([correctAnswer, ...distractors.filter(answer => answer !== correctAnswer)]).slice(0, 4);
  return { type: "choice", prompt, answers, correct: answers.indexOf(correctAnswer) };
}

function getCorrectIndexes(question) {
  const indexes = Array.isArray(question.correctAnswers) ? question.correctAnswers : [question.correct];
  return [...new Set(indexes.map(Number).filter(index => Number.isInteger(index) && index >= 0 && index < question.answers.length))];
}

function prepareQuestions(questions, options = {}) {
  const { shuffleQuestions = true, shuffleAnswers = true } = options;
  const orderedQuestions = shuffleQuestions ? shuffled(questions) : [...questions];
  return orderedQuestions.map(question => {
    if (question.type === "order") {
      const words = Array.isArray(question.words) && question.words.length ? question.words : String(question.answer || "").split(/\s+/).filter(Boolean);
      const tiles = words.map((word, index) => ({ word, id: index }));
      return { ...question, words: [...words], wordTiles: shuffleAnswers ? shuffled(tiles) : tiles };
    }
    if (question.type === "match") {
      const pairs = Array.isArray(question.pairs) ? question.pairs : [];
      const tiles = pairs.map((pair, index) => ({ id: index, left: pair.left }));
      return { ...question, pairs: [...pairs], matchTiles: shuffleAnswers ? shuffled(tiles) : tiles };
    }
    if (question.type !== "choice") return { ...question };
    const correctIndexes = getCorrectIndexes(question);
    if (!shuffleAnswers) return { ...question, answers: [...question.answers], correct: correctIndexes[0], correctAnswers: correctIndexes };
    const entries = shuffled(question.answers.map((answer, index) => ({ answer, isCorrect: correctIndexes.includes(index) })));
    const shuffledCorrect = entries.map((entry, index) => entry.isCorrect ? index : -1).filter(index => index >= 0);
    return { ...question, answers: entries.map(entry => entry.answer), correct: shuffledCorrect[0], correctAnswers: shuffledCorrect };
  });
}

function generateGrammarQuestions() {
  const profiles = [
    { label: "I", middle: "I", be: "am", have: "have", negBe: "am not", negHave: "haven't" },
    { label: "You", middle: "you", be: "are", have: "have", negBe: "aren't", negHave: "haven't" },
    { label: "He", middle: "he", be: "is", have: "has", negBe: "isn't", negHave: "hasn't" },
    { label: "She", middle: "she", be: "is", have: "has", negBe: "isn't", negHave: "hasn't" },
    { label: "We", middle: "we", be: "are", have: "have", negBe: "aren't", negHave: "haven't" },
    { label: "They", middle: "they", be: "are", have: "have", negBe: "aren't", negHave: "haven't" },
    { label: "Tom", middle: "Tom", be: "is", have: "has", negBe: "isn't", negHave: "hasn't" },
    { label: "My friends", middle: "your friends", be: "are", have: "have", negBe: "aren't", negHave: "haven't" }
  ];
  const adjectives = ["happy", "tired", "ready", "hungry", "busy", "friendly", "at home", "from London"];
  const places = ["at school", "at home", "ready", "in the garden", "from Poland", "busy today"];
  const possessions = ["a new bike", "a blue backpack", "a pet", "a computer", "two sisters", "a red jacket", "a big room", "a guitar"];
  const abilities = ["swim", "cook", "sing", "ride a bike", "speak English", "play chess", "dance", "draw well"];
  const questions = [];
  const beProfiles = shuffled(profiles);
  const haveProfiles = shuffled(profiles);
  const canProfiles = shuffled(profiles);

  beProfiles.forEach((profile, index) => {
    const description = pick(adjectives);
    if (index % 4 === 0) questions.push(choiceQuestion(`${profile.label} ___ ${description}.`, profile.be, ["am", "is", "are", "be"]));
    if (index % 4 === 1) questions.push({ type: "fill", prompt: `Uzupełnij jednym słowem: ${profile.label} ___ ${description}.`, answer: profile.be });
    if (index % 4 === 2) questions.push(choiceQuestion(`___ ${profile.middle} ${pick(places)}?`, capitalize(profile.be), ["Am", "Is", "Are", "Do"]));
    if (index % 4 === 3) questions.push(choiceQuestion(`Wybierz poprawne przeczenie: ${profile.label} ${profile.be} ${description}.`, `${profile.label} ${profile.negBe} ${description}.`, [`${profile.label} not ${profile.be} ${description}.`, `${profile.label} don't be ${description}.`, `${profile.label} no ${profile.be} ${description}.`]));
  });

  haveProfiles.forEach((profile, index) => {
    const possession = pick(possessions);
    if (index % 4 === 0) questions.push(choiceQuestion(`${profile.label} ___ got ${possession}.`, profile.have, ["have", "has", "is", "can"]));
    if (index % 4 === 1) questions.push({ type: "fill", prompt: `Uzupełnij jednym słowem: ${profile.label} ___ got ${possession}.`, answer: profile.have });
    if (index % 4 === 2) questions.push(choiceQuestion(`___ ${profile.middle} got ${possession}?`, capitalize(profile.have), ["Have", "Has", "Is", "Can"]));
    if (index % 4 === 3) questions.push(choiceQuestion(`Wybierz poprawne przeczenie: ${profile.label} ${profile.have} got ${possession}.`, `${profile.label} ${profile.negHave} got ${possession}.`, [`${profile.label} not ${profile.have} got ${possession}.`, `${profile.label} doesn't got ${possession}.`, `${profile.label} ${profile.have} not got ${possession}.`]));
  });

  canProfiles.forEach((profile, index) => {
    const ability = pick(abilities);
    if (index % 4 === 0) questions.push(choiceQuestion(`${profile.label} ___ ${ability}.`, "can", ["is", "has", "does"]));
    if (index % 4 === 1) questions.push({ type: "fill", prompt: `Uzupełnij jednym słowem: ${profile.label} ___ ${ability}.`, answer: "can" });
    if (index % 4 === 2) questions.push(choiceQuestion(`___ ${profile.middle} ${ability}?`, "Can", ["Is", "Has", "Does"]));
    if (index % 4 === 3) questions.push(choiceQuestion(`Wybierz poprawne przeczenie: ${profile.label} can ${ability}.`, `${profile.label} can't ${ability}.`, [`${profile.label} don't can ${ability}.`, `${profile.label} isn't can ${ability}.`, `${profile.label} can not to ${ability}.`]));
  });

  return prepareQuestions(questions);
}

function showView(name) {
  $$(".view").forEach(view => view.classList.remove("active"));
  $(`#${name}View`).classList.add("active");
  $$(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.view === name));
  if (name === "home") renderQuizGrid();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getCategories() {
  return [...new Set([...customCategories, ...quizzes.map(quiz => quiz.category || "Angielski")])].sort((a, b) => a.localeCompare(b, "pl"));
}

function createCategory() {
  $("#categoryModal").hidden = false;
  $("#newCategoryName").value = "";
  setTimeout(() => $("#newCategoryName").focus(), 0);
}

function closeCategoryModal() {
  $("#categoryModal").hidden = true;
}

function saveCreatedCategory(event) {
  event.preventDefault();
  const categoryName = $("#newCategoryName").value.trim().replace(/\s+/g, " ");
  if (!categoryName) return showToast("Nazwa kategorii nie może być pusta");
  if (categoryName.length > 40) return showToast("Nazwa kategorii może mieć maksymalnie 40 znaków");
  const existingCategory = getCategories().find(category => category.localeCompare(categoryName, "pl", { sensitivity: "base" }) === 0);
  if (!existingCategory) {
    customCategories.push(categoryName);
    saveCategories();
  }
  activeCategory = existingCategory || categoryName;
  closeCategoryModal();
  renderQuizGrid();
  showToast(existingCategory ? "Ta kategoria już istnieje" : "Dodano kategorię „" + categoryName + "\u201d");
}

function openSoundMessages() {
  $("#correctSoundText").value = soundMessages.correct;
  $("#wrongSoundText").value = soundMessages.wrong;
  $("#perfectSoundText").value = soundMessages.perfect;
  $("#belowPerfectSoundText").value = soundMessages.belowPerfect;
  $("#autoAdvanceSeconds").value = autoAdvanceSeconds;
  $("#questionTimeLimit").value = questionTimeLimit;
  $("#readAnswerToggle").checked = readAnswer;
  $("#soundMessagesModal").hidden = false;
  setTimeout(() => $("#correctSoundText").focus(), 0);
}

function closeSoundMessages() {
  $("#soundMessagesModal").hidden = true;
}

function saveConfiguredSoundMessages(event) {
  event.preventDefault();
  soundMessages = {
    correct: $("#correctSoundText").value.trim(),
    wrong: $("#wrongSoundText").value.trim(),
    perfect: $("#perfectSoundText").value.trim(),
    belowPerfect: $("#belowPerfectSoundText").value.trim()
  };
  saveSoundMessages();
  autoAdvanceSeconds = Math.min(60, Math.max(0, Number($("#autoAdvanceSeconds").value) || 0));
  saveAutoAdvanceSeconds();
  questionTimeLimit = Math.min(300, Math.max(0, Number($("#questionTimeLimit").value) || 0));
  saveQuestionTimeLimit();
  readAnswer = $("#readAnswerToggle").checked;
  saveReadAnswer();
  closeSoundMessages();
  showToast("Komunikaty dźwiękowe zostały zapisane");
}

function requestCategoryDeletion(category) {
  const count = quizzes.filter(quiz => (quiz.category || "Angielski") === category).length;
  pendingCategoryDeletion = category;
  $("#deleteCategoryTitle").textContent = "Usunąć kategorię „" + category + "\u201d?";
  $("#deleteCategoryDescription").textContent = count
    ? "Liczba testów, które zostaną trwale usunięte: " + count + "."
    : "Kategoria jest pusta i zostanie trwale usunięta.";
  $("#deleteCategoryModal").hidden = false;
  $("#confirmDeleteCategory").focus();
}

function closeDeleteCategoryModal() {
  pendingCategoryDeletion = null;
  $("#deleteCategoryModal").hidden = true;
}

function deleteCategoryWithQuizzes() {
  if (!pendingCategoryDeletion) return;
  const category = pendingCategoryDeletion;
  const toDelete = quizzes.filter(quiz => (quiz.category || "Angielski") === category);
  quizzes = quizzes.filter(quiz => (quiz.category || "Angielski") !== category);
  customCategories = customCategories.filter(item => item !== category);
  saveQuizzes();
  saveCategories();
  if (window.firebaseDB) toDelete.forEach(q => window.firebaseDB.deleteQuiz(q.id));
  activeCategory = "all";
  closeDeleteCategoryModal();
  renderQuizGrid();
  showToast("Usunięto kategorię „" + category + "\u201d wraz z jej testami");
}

function closeCategoryDropdown() {
  $("#categoryDropdown").hidden = true;
  $("#quizCategory").setAttribute("aria-expanded", "false");
  $("#categoryDropdownToggle").setAttribute("aria-expanded", "false");
}

function renderCreatorCategoryOptions() {
  const categories = getCategories();
  const dropdown = $("#categoryDropdown");
  dropdown.innerHTML = categories.length ? categories.map((category, index) => {
    const count = quizzes.filter(quiz => (quiz.category || "Angielski") === category).length;
    return `<button type="button" role="option" data-category-option="${index}"><span>${escapeHtml(category)}</span><small>${count} ${testCountLabel(count)}</small></button>`;
  }).join("") : '<div class="category-dropdown-empty">Brak zapisanych kategorii</div>';
  $$("[data-category-option]", dropdown).forEach(button => button.addEventListener("click", () => {
    $("#quizCategory").value = categories[Number(button.dataset.categoryOption)];
    closeCategoryDropdown();
    $("#quizCategory").focus();
  }));
}

function toggleCategoryDropdown(forceOpen = null) {
  const dropdown = $("#categoryDropdown");
  const shouldOpen = forceOpen === null ? dropdown.hidden : forceOpen;
  if (shouldOpen) renderCreatorCategoryOptions();
  dropdown.hidden = !shouldOpen;
  $("#quizCategory").setAttribute("aria-expanded", String(shouldOpen));
  $("#categoryDropdownToggle").setAttribute("aria-expanded", String(shouldOpen));
}

function testCountLabel(count) {
  if (count === 1) return "test";
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14)) return "testy";
  return "testów";
}

function renderCategoryTabs() {
  const categories = getCategories();
  if (activeCategory !== "all" && !categories.includes(activeCategory)) activeCategory = "all";
  const tabs = [{ key: "all", label: "Wszystkie", count: quizzes.length }, ...categories.map(category => ({ key: category, label: category, count: quizzes.filter(quiz => (quiz.category || "Angielski") === category).length }))];
  const container = $("#categoryTabs");
  container.innerHTML = tabs.map((tab, index) => `<div class="category-folder"><button type="button" class="category-tab ${activeCategory === tab.key ? "active" : ""}" role="tab" aria-selected="${activeCategory === tab.key}" aria-label="${escapeHtml(tab.label)}, testów: ${tab.count}" data-category-index="${index}"><strong>${escapeHtml(tab.label)}</strong><small>${tab.count} ${testCountLabel(tab.count)}</small></button>${tab.key === "all" ? "" : `<button type="button" class="delete-category" data-delete-category-index="${index}" aria-label="Usuń kategorię ${escapeHtml(tab.label)}" title="Usuń kategorię i jej testy">×</button>`}</div>`).join("");
  $$(".category-tab", container).forEach(button => {
    const tab = tabs[Number(button.dataset.categoryIndex)];
    button.addEventListener("click", () => { activeCategory = tab.key; renderQuizGrid(); });
    if (tab.key !== "all") {
      button.addEventListener("dragover", event => {
        if (!draggingQuizId) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        button.classList.add("drag-over");
      });
      button.addEventListener("dragleave", () => button.classList.remove("drag-over"));
      button.addEventListener("drop", event => {
        event.preventDefault();
        if (draggingQuizId) moveQuizToCategory(draggingQuizId, tab.key);
      });
    }
  });
  $$("[data-delete-category-index]", container).forEach(button => button.addEventListener("click", event => {
    event.stopPropagation();
    const tab = tabs[Number(button.dataset.deleteCategoryIndex)];
    if (tab?.key && tab.key !== "all") requestCategoryDeletion(tab.key);
  }));
}

function cleanupQuizDrag() {
  draggingQuizId = null;
  document.body.classList.remove("is-dragging-quiz");
  $$(".category-tab").forEach(tab => tab.classList.remove("drag-target", "drag-over"));
  $$(".quiz-card").forEach(card => card.classList.remove("dragging"));
}

function showQuizDragTargets(card) {
  card.classList.add("dragging");
  document.body.classList.add("is-dragging-quiz");
  $$(".category-tab").forEach(tab => {
    if (Number(tab.dataset.categoryIndex) !== 0) tab.classList.add("drag-target");
  });
}

function moveQuizToCategory(id, category) {
  const quiz = quizzes.find(item => item.id === id);
  if (!quiz || (quiz.category || "Angielski") === category) {
    cleanupQuizDrag();
    setTimeout(() => { suppressCardClick = false; }, 0);
    return;
  }
  quizzes = quizzes.map(item => item.id === id ? { ...item, category } : item);
  saveQuizzes();
  cleanupQuizDrag();
  setTimeout(() => { suppressCardClick = false; }, 0);
  activeCategory = category;
  renderQuizGrid();
  showToast(`Przeniesiono „${quiz.title}" do kategorii „${category}"`);
}

function renderQuizGrid() {
  renderCategoryTabs();
  const grid = $("#quizGrid");
  if (!quizzes.length) { grid.innerHTML = '<div class="empty-state">Nie masz jeszcze żadnego testu. Stwórz pierwszy i zacznij ćwiczyć!</div>'; return; }
  const visibleQuizzes = activeCategory === "all" ? quizzes : quizzes.filter(quiz => (quiz.category || "Angielski") === activeCategory);
  if (!visibleQuizzes.length) {
    grid.innerHTML = '<div class="empty-state"><strong>Kategoria „' + escapeHtml(activeCategory) + '\u201d jest pusta.</strong><span>Utwórz nowy test lub przeciągnij tutaj istniejący.</span></div>';
    return;
  }
  grid.innerHTML = visibleQuizzes.map((quiz) => `
    <article class="quiz-card" data-id="${quiz.id}" data-letter="${escapeHtml(quiz.title.charAt(0).toUpperCase())}" tabindex="0" role="button" draggable="true" title="Przeciągnij na folder, aby zmienić kategorię" aria-label="Rozpocznij test ${escapeHtml(quiz.title)}">
      <div class="card-tags"><span class="tag level">${escapeHtml(quiz.level)}</span><span class="tag">${escapeHtml(quiz.category || "Angielski")}</span>${quiz.dynamic ? '<span class="tag random-tag">↻ Losowany</span>' : !starterQuizzes.some(item => item.id === quiz.id) ? (quiz.shuffleQuestions !== false || quiz.shuffleAnswers !== false ? '<span class="tag random-tag">↻ Losowany</span>' : '<span class="tag fixed-tag">Stała kolejność</span>') : ""}${srHardTag(quiz.id)}</div>
      <h3>${escapeHtml(quiz.title)}</h3><p>${quiz.questions.length} ${quiz.questions.length === 1 ? "pytanie" : "pytań"}</p>
      <div class="card-footer"><span>Rozpocznij</span><span class="play-circle">→</span></div>
      <div class="card-tools"><button class="card-tool delete-quiz" title="Usuń test" aria-label="Usuń test">Usuń</button><button class="card-tool print-quiz" title="Drukuj test" aria-label="Drukuj test">🖨 Drukuj</button><button class="card-tool edit-quiz" title="Edytuj test" aria-label="Edytuj test">✎ Edytuj</button></div>
    </article>`).join("");
  $$(".quiz-card", grid).forEach(card => {
    card.addEventListener("click", event => {
      if (suppressCardClick) return;
      if (event.target.closest(".delete-quiz")) return deleteQuiz(card.dataset.id);
      if (event.target.closest(".print-quiz")) return printQuiz(card.dataset.id);
      if (event.target.closest(".edit-quiz")) return editQuiz(card.dataset.id);
      startQuiz(card.dataset.id);
    });
    card.addEventListener("keydown", event => { if (event.target.closest(".card-tool")) return; if (event.key === "Enter" || event.key === " ") { event.preventDefault(); startQuiz(card.dataset.id); } });
    card.addEventListener("dragstart", event => {
      draggingQuizId = card.dataset.id;
      suppressCardClick = true;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggingQuizId);
      showQuizDragTargets(card);
    });
    card.addEventListener("dragend", () => {
      cleanupQuizDrag();
      setTimeout(() => { suppressCardClick = false; }, 0);
    });
  });
}

function deleteQuiz(id) {
  const quiz = quizzes.find(item => item.id === id);
  if (quiz && confirm(`Usunąć test „${quiz.title}"?`)) {
    quizzes = quizzes.filter(item => item.id !== id);
    saveQuizzes();
    if (window.firebaseDB) window.firebaseDB.deleteQuiz(id);
    renderQuizGrid();
    showToast("Test usunięty z biblioteki");
  }
}

function buildPrintableQuestionHtml(question, index) {
  const number = index + 1;
  if (question.type === "choice") {
    const options = question.answers.map((answer, i) => `<li><span class="print-option-letter">${String.fromCharCode(65 + i)}.</span> ${escapeHtml(answer)}</li>`).join("");
    return `<div class="print-question"><p><strong>${number}.</strong> ${escapeHtml(question.prompt)}</p><ol class="print-options">${options}</ol></div>`;
  }
  if (question.type === "order") {
    const words = Array.isArray(question.words) && question.words.length ? question.words : String(question.answer || "").split(/\s+/).filter(Boolean);
    return `<div class="print-question"><p><strong>${number}.</strong> ${escapeHtml(question.prompt)}</p><p class="print-order-words">${words.map(escapeHtml).join(" / ")}</p><p class="print-answer-line">Odpowiedź: ______________________________________________</p></div>`;
  }
  if (question.type === "flashcard") {
    return `<div class="print-question"><p><strong>${number}.</strong> ${escapeHtml(question.prompt)}</p><p class="print-answer-line">Tłumaczenie: ______________________________________________</p></div>`;
  }
  if (question.type === "match") {
    const lefts = shuffled(question.pairs.map(pair => pair.left));
    const rows = question.pairs.map(pair => `<li>${escapeHtml(pair.right)} — ______________________________</li>`).join("");
    return `<div class="print-question"><p><strong>${number}.</strong> ${escapeHtml(question.prompt)}</p><p class="print-order-words">${lefts.map(escapeHtml).join(" / ")}</p><ol class="print-options">${rows}</ol></div>`;
  }
  return `<div class="print-question"><p><strong>${number}.</strong> ${escapeHtml(question.prompt)}</p><p class="print-answer-line">Odpowiedź: ______________________________________________</p></div>`;
}

function buildAnswerKeyHtml(question, index) {
  const number = index + 1;
  let answerText;
  if (question.type === "choice") {
    const correctIndexes = getCorrectIndexes(question);
    answerText = correctIndexes.map(i => `${String.fromCharCode(65 + i)}. ${question.answers[i]}`).join(", ");
  } else if (question.type === "order") {
    answerText = question.answer;
  } else if (question.type === "match") {
    answerText = question.pairs.map(pair => `${pair.left} → ${pair.right}`).join(", ");
  } else {
    answerText = question.answer;
  }
  return `<li><strong>${number}.</strong> ${escapeHtml(answerText)}</li>`;
}

function printQuiz(id) {
  const quiz = quizzes.find(item => item.id === id);
  if (!quiz) return;
  const questions = quiz.dynamic ? generateGrammarQuestions() : quiz.questions;
  const questionsHtml = questions.map((question, index) => buildPrintableQuestionHtml(question, index)).join("");
  const answerKeyHtml = questions.map((question, index) => buildAnswerKeyHtml(question, index)).join("");
  const printWindow = window.open("", "_blank");
  if (!printWindow) return showToast("Zablokowano otwarcie okna wydruku — sprawdź ustawienia przeglądarki");
  printWindow.document.write(`<!doctype html><html lang="pl"><head><meta charset="UTF-8" /><title>${escapeHtml(quiz.title)} — wydruk</title>
    <style>
      body { font: 15px/1.5 "DM Sans", Arial, sans-serif; color: #17251f; margin: 0; padding: 32px; }
      h1 { font-size: 24px; margin: 0 0 4px; }
      .print-meta { color: #556158; font-size: 13px; margin-bottom: 24px; }
      .print-name-line { margin-bottom: 28px; font-size: 14px; }
      .print-question { margin-bottom: 20px; }
      .print-question p { margin: 0 0 6px; }
      .print-options { list-style: none; margin: 0; padding: 0 0 0 18px; display: grid; gap: 4px; }
      .print-option-letter { font-weight: 700; margin-right: 4px; }
      .print-order-words { font-style: italic; color: #445048; }
      .print-answer-line { color: #445048; }
      .print-answer-key { page-break-before: always; }
      .print-answer-key ol, .print-answer-key ul { padding-left: 18px; }
      .print-answer-key li { margin-bottom: 6px; }
      @media print { .print-answer-key { page-break-before: always; } }
    </style>
  </head><body>
    <h1>${escapeHtml(quiz.title)}</h1>
    <p class="print-meta">Poziom: ${escapeHtml(quiz.level || "")} · ${questions.length} ${questions.length === 1 ? "pytanie" : "pytań"}</p>
    <p class="print-name-line">Imię i nazwisko: ______________________________________________ &nbsp;&nbsp; Data: ______________</p>
    ${questionsHtml}
    <div class="print-answer-key">
      <h1>${escapeHtml(quiz.title)} — klucz odpowiedzi</h1>
      <ul>${answerKeyHtml}</ul>
    </div>
  </body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => printWindow.print();
  setTimeout(() => { if (!printWindow.closed) printWindow.print(); }, 400);
}

function startQuiz(id) {
  const sourceQuiz = quizzes.find(quiz => quiz.id === id);
  if (!sourceQuiz) return;
  let preparedQs = sourceQuiz.dynamic
    ? generateGrammarQuestions()
    : prepareQuestions(sourceQuiz.questions, {
        shuffleQuestions: sourceQuiz.shuffleQuestions !== false,
        shuffleAnswers: sourceQuiz.shuffleAnswers !== false
      });
  if (!sourceQuiz.dynamic) preparedQs = applySpacedRepetition(id, preparedQs);
  activeQuiz = { ...sourceQuiz, questions: preparedQs };
  questionIndex = 0; results = []; resultsShown = false; renderQuestion(); showView("play");
  startMusic();
}

function startQuizWrong() {
  if (!activeQuiz) return;
  const wrongQs = activeQuiz.questions
    .filter((q, i) => results[i] && !results[i].correct)
    .map(q => {
      if (q.type !== "order") return q;
      const { wordTiles, ...rest } = q;
      return { ...rest, words: q.words || String(q.answer).split(/\s+/).filter(Boolean) };
    });
  if (!wrongQs.length) return;
  activeQuiz = { ...activeQuiz, questions: prepareQuestions(wrongQs, { shuffleQuestions: true, shuffleAnswers: true }) };
  questionIndex = 0; results = []; resultsShown = false;
  renderQuestion(); showView("play"); startMusic();
}

function applySpacedRepetition(quizId, questions) {
  const quizSr = srData[quizId];
  if (!quizSr) return questions;
  return [...questions].sort((a, b) => srScore(quizSr, b.prompt) - srScore(quizSr, a.prompt));
}
function srScore(quizSr, prompt) {
  const entry = quizSr[String(prompt).slice(0, 80).trim()];
  return entry ? entry.wrong - entry.correct : 0;
}
function updateSrAfterQuiz(quizId, quizResults, questions) {
  if (!quizId || !Array.isArray(quizResults) || !Array.isArray(questions)) return;
  if (!srData[quizId]) srData[quizId] = {};
  quizResults.forEach((result, i) => {
    if (!questions[i]) return;
    const key = String(questions[i].prompt).slice(0, 80).trim();
    if (!srData[quizId][key]) srData[quizId][key] = { wrong: 0, correct: 0 };
    if (result.correct) srData[quizId][key].correct++;
    else srData[quizId][key].wrong++;
  });
  saveSrData();
}
function getQuizSrHardCount(quizId) {
  const quizSr = srData[quizId];
  if (!quizSr) return 0;
  return Object.values(quizSr).filter(e => e.wrong > e.correct).length;
}
function srHardTag(quizId) {
  const n = getQuizSrHardCount(quizId);
  return n > 0 ? `<span class="tag sr-hard-tag" title="Pytania, które sprawiają trudność">⚡ ${n} ${n === 1 ? "trudne" : "trudnych"}</span>` : "";
}

function clearQuestionTimer() {
  clearInterval(questionTimerInterval);
  questionTimerInterval = null;
  questionTimerRemaining = 0;
  const bar = $("#questionTimerBar");
  const badge = $("#questionTimerBadge");
  if (bar) bar.hidden = true;
  if (badge) badge.hidden = true;
}
function startQuestionTimer() {
  if (!questionTimeLimit) return;
  clearQuestionTimer();
  questionTimerRemaining = questionTimeLimit;
  const bar = $("#questionTimerBar");
  const fill = $("#questionTimerFill");
  const badge = $("#questionTimerBadge");
  if (!bar || !fill || !badge) return;
  function updateDisplay() {
    const pct = (questionTimerRemaining / questionTimeLimit) * 100;
    fill.style.width = pct + "%";
    const urgent = questionTimerRemaining <= Math.ceil(questionTimeLimit * 0.25);
    fill.classList.toggle("urgent", urgent);
    badge.textContent = "⏱ " + questionTimerRemaining;
    badge.classList.toggle("urgent", urgent);
  }
  bar.hidden = false; badge.hidden = false; updateDisplay();
  questionTimerInterval = setInterval(() => {
    if (hasChecked) { clearQuestionTimer(); return; }
    questionTimerRemaining--;
    updateDisplay();
    if (questionTimerRemaining <= 0) { clearQuestionTimer(); }
  }, 1000);
}

function setQuestionText(prompt) {
  const el = $("#questionText");
  const m = /^(.{3,50}):\s+(.+)$/.exec(prompt);
  if (m && m[1].trim().split(/\s+/).length <= 6) {
    el.innerHTML = `<span class="q-instruction">${escapeHtml(m[1])}:</span>${escapeHtml(m[2])}`;
  } else {
    el.textContent = prompt;
  }
}

function renderQuestion() {
  clearAutoAdvance();
  clearQuestionTimer();
  const question = activeQuiz.questions[questionIndex];
  selectedAnswer = question.type === "choice" || question.type === "order" ? [] : question.type === "match" ? {} : null; hasChecked = false;
  matchSelectedTileId = null;
  const playImage = $("#playQuizImage");
  playImage.hidden = true;
  playImage.onload = () => { playImage.hidden = false; };
  playImage.onerror = () => { playImage.hidden = true; playImage.removeAttribute("src"); };
  const questionImage = question.type === "choice" || question.type === "fill" ? question.image : "";
  const displayImage = questionImage || activeQuiz.image;
  if (displayImage) {
    playImage.src = displayImage;
    if (playImage.complete && playImage.naturalWidth > 0) playImage.hidden = false;
  } else playImage.removeAttribute("src");
  $(".quiz-stage").classList.toggle("picture-mode", Boolean(questionImage));
  $("#progressFill").style.width = `${((questionIndex + 1) / activeQuiz.questions.length) * 100}%`;
  $("#progressText").textContent = `${questionIndex + 1} / ${activeQuiz.questions.length}`;
  $("#questionMeta").textContent = question.instruction || (question.type === "choice" ? "Wybierz odpowiedź" : question.type === "order" ? "Uporządkuj zdanie" : question.type === "match" ? "Dopasuj" : question.type === "flashcard" ? "Fiszka" : "Uzupełnij zdanie");
  setQuestionText(question.prompt);
  const requiredChoices = question.type === "choice" ? getCorrectIndexes(question).length : 0;
  if (!question.instruction && question.type === "choice" && requiredChoices > 1) $("#questionMeta").textContent = "Wybierz odpowiedzi";
  $("#questionHint").textContent = question.type === "choice"
    ? requiredChoices > 1 ? "Zaznacz " + requiredChoices + " prawidłowe odpowiedzi." : "Kliknij jedną z odpowiedzi."
    : question.type === "order" ? "Klikaj lub przeciągaj słowa, aby ułożyć poprawne zdanie."
    : question.type === "match" ? "Przeciągnij kolorowe kafelki na właściwe pola lub kliknij kafelek, a potem pole."
    : question.type === "flashcard" ? "Kliknij \u201ePokaż odpowiedź\u201d, a następnie oceń, czy ją znałeś."
    : "Wpisz brakujące słowo lub wyrażenie.";
  $("#feedback").className = "feedback"; $("#feedback").innerHTML = "";
  const area = $("#answerArea");
  if (question.type === "choice") {
    area.innerHTML = question.answers.map((answer, i) => `<button class="answer-option" data-index="${i}"><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${escapeHtml(answer)}</span></button>`).join("");
    $$(".answer-option", area).forEach(option => option.addEventListener("click", () => selectChoice(Number(option.dataset.index))));
  } else if (question.type === "order") {
    renderOrderAnswer(question);
  } else if (question.type === "match") {
    renderMatchAnswer(question);
  } else if (question.type === "flashcard") {
    area.innerHTML = '<div class="flashcard-back-hidden" role="button" tabindex="0" aria-label="Pokaż odpowiedź"><span class="flashcard-hidden-icon" aria-hidden="true">?</span><p>Kliknij, aby zobaczyć odpowiedź</p></div>';
    const hiddenCard = $(".flashcard-back-hidden", area);
    hiddenCard.addEventListener("click", () => { if (!hasChecked) revealFlashcard(question); });
    hiddenCard.addEventListener("keydown", event => { if ((event.key === "Enter" || event.key === " ") && !hasChecked) { event.preventDefault(); revealFlashcard(question); } });
  } else {
    area.innerHTML = '<input class="fill-answer" id="fillInput" autocomplete="off" placeholder="Wpisz odpowiedź…" aria-label="Twoja odpowiedź" />';
    const input = $("#fillInput");
    input.addEventListener("input", () => { selectedAnswer = input.value.trim(); $("#checkAnswer").disabled = !selectedAnswer; });
    input.addEventListener("keydown", event => { if (event.key === "Enter" && input.value.trim()) checkOrNext(); });
    area.addEventListener("click", () => { const i = document.querySelector("#fillInput"); if (i && !i.disabled) i.focus(); });
    requestAnimationFrame(() => requestAnimationFrame(() => { const i = document.querySelector("#fillInput"); if (i && !i.disabled) i.focus(); }));
  }
  const savedResult = results[questionIndex];
  $("#previousQuestion").disabled = questionIndex === 0;
  const check = $("#checkAnswer"); check.hidden = false; check.textContent = question.type === "flashcard" ? "Pokaż odpowiedź" : "Sprawdź odpowiedź"; check.disabled = question.type !== "flashcard";
  if (savedResult) restoreCheckedQuestion(question, savedResult);
  else startQuestionTimer();
}

function renderOrderAnswer(question, disabled = false) {
  const area = $("#answerArea");
  const chosen = new Set(selectedAnswer);
  const selectedTiles = selectedAnswer.map(id => question.wordTiles.find(tile => tile.id === id)).filter(Boolean);
  const availableTiles = question.wordTiles.filter(tile => !chosen.has(tile.id));
  area.innerHTML = `<div class="order-builder ${disabled ? "disabled" : ""}"><div class="order-zone order-sentence" data-zone="sentence" aria-label="Układane zdanie">${selectedTiles.map(tile => `<button type="button" class="word-tile" draggable="${!disabled}" data-id="${tile.id}">${escapeHtml(tile.word)}</button>`).join("") || '<span class="order-placeholder">Tutaj ułóż zdanie</span>'}</div><div class="order-zone order-bank" data-zone="bank" aria-label="Dostępne słowa">${availableTiles.map(tile => `<button type="button" class="word-tile" draggable="${!disabled}" data-id="${tile.id}">${escapeHtml(tile.word)}</button>`).join("")}</div></div>`;
  if (disabled) return;
  $$(".word-tile", area).forEach(tile => {
    tile.addEventListener("click", () => moveOrderTile(question, Number(tile.dataset.id), tile.closest(".order-sentence") ? "bank" : "sentence"));
    tile.addEventListener("dragstart", event => event.dataTransfer.setData("text/plain", tile.dataset.id));
    if (tile.closest(".order-sentence")) {
      tile.addEventListener("dragover", event => { event.preventDefault(); event.stopPropagation(); tile.classList.add("drop-before"); });
      tile.addEventListener("dragleave", () => tile.classList.remove("drop-before"));
      tile.addEventListener("drop", event => {
        event.preventDefault();
        event.stopPropagation();
        tile.classList.remove("drop-before");
        moveOrderTile(question, Number(event.dataTransfer.getData("text/plain")), "sentence", Number(tile.dataset.id));
      });
    }
  });
  $$(".order-zone", area).forEach(zone => {
    zone.addEventListener("dragover", event => event.preventDefault());
    zone.addEventListener("drop", event => { event.preventDefault(); moveOrderTile(question, Number(event.dataTransfer.getData("text/plain")), zone.dataset.zone); });
  });
  $("#checkAnswer").disabled = selectedAnswer.length !== question.wordTiles.length;
}

function revealFlashcard(question) {
  const area = $("#answerArea");
  area.innerHTML = `<div class="flashcard-back-revealed"><p class="flashcard-answer-text">${escapeHtml(question.answer)}</p></div><div class="flashcard-eval"><button class="button flashcard-knew" type="button">✓ Wiedziałem</button><button class="button flashcard-didnt" type="button">✗ Nie wiedziałem</button></div>`;
  const check = $("#checkAnswer");
  check.disabled = true;
  check.hidden = true;
  $(".flashcard-knew", area).addEventListener("click", () => submitFlashcard(question, true));
  $(".flashcard-didnt", area).addEventListener("click", () => submitFlashcard(question, false));
}

function submitFlashcard(question, correct) {
  const correctSentence = buildCorrectSentence(question, question.answer);
  const result = { prompt: question.prompt, correct, answer: question.answer, correctAnswer: question.answer, selectedIndexes: [], correctSentence };
  results[questionIndex] = result;
  hasChecked = true;
  showCheckedQuestion(question, result);
  if (correct) celebrate();
  playSound(correct, correctSentence, scheduleAutoAdvance);
}

function moveOrderTile(question, id, destination, beforeId = null) {
  if (hasChecked) return;
  selectedAnswer = selectedAnswer.filter(item => item !== id);
  if (destination === "sentence") {
    const insertionIndex = beforeId === null ? -1 : selectedAnswer.indexOf(beforeId);
    if (insertionIndex >= 0) selectedAnswer.splice(insertionIndex, 0, id);
    else selectedAnswer.push(id);
  }
  renderOrderAnswer(question);
}

function renderMatchAnswer(question, disabled = false) {
  const area = $("#answerArea");
  const tiles = question.matchTiles;
  const placedTileIds = new Set(Object.values(selectedAnswer));
  const bankTiles = tiles.filter(tile => !placedTileIds.has(tile.id));
  const tileHtml = tile => `<button type="button" class="match-tile" draggable="${!disabled}" data-id="${tile.id}" style="background:${MATCH_COLORS[tile.id % MATCH_COLORS.length]}" aria-pressed="${matchSelectedTileId === tile.id}">${escapeHtml(tile.left)}</button>`;
  area.innerHTML = `<div class="match-builder ${disabled ? "disabled" : ""}"><div class="match-bank" data-zone="bank" aria-label="Dostępne kafelki">${bankTiles.map(tileHtml).join("") || '<span class="order-placeholder">Wszystkie kafelki umieszczone</span>'}</div><div class="match-slots">${question.pairs.map((pair, slotIndex) => {
    const placedId = selectedAnswer[slotIndex];
    const placedTile = placedId !== undefined ? tiles.find(t => t.id === placedId) : null;
    return `<div class="match-slot ${placedTile ? "filled" : ""}" data-slot="${slotIndex}"><div class="match-slot-drop" data-slot-drop="${slotIndex}">${placedTile ? `<button type="button" class="match-tile placed" draggable="${!disabled}" data-id="${placedTile.id}" style="background:${MATCH_COLORS[placedTile.id % MATCH_COLORS.length]}">${escapeHtml(placedTile.left)}</button>` : '<span class="match-slot-placeholder">Upuść tutaj</span>'}</div><span class="match-slot-label">${escapeHtml(pair.right)}</span></div>`;
  }).join("")}</div></div>`;
  if (disabled) return;
  $$(".match-tile", area).forEach(tile => {
    tile.addEventListener("click", () => handleMatchTileClick(question, Number(tile.dataset.id)));
    tile.addEventListener("dragstart", event => { event.dataTransfer.setData("text/plain", tile.dataset.id); requestAnimationFrame(() => tile.classList.add("dragging")); });
    tile.addEventListener("dragend", () => tile.classList.remove("dragging"));
  });
  $(".match-bank", area).addEventListener("dragover", event => event.preventDefault());
  $(".match-bank", area).addEventListener("drop", event => { event.preventDefault(); placeMatchTile(question, Number(event.dataTransfer.getData("text/plain")), null); });
  $$(".match-slot-drop", area).forEach(dropZone => {
    dropZone.addEventListener("dragover", event => event.preventDefault());
    dropZone.addEventListener("drop", event => { event.preventDefault(); placeMatchTile(question, Number(event.dataTransfer.getData("text/plain")), Number(dropZone.dataset.slotDrop)); });
    dropZone.addEventListener("click", () => { if (matchSelectedTileId !== null) placeMatchTile(question, matchSelectedTileId, Number(dropZone.dataset.slotDrop)); });
  });
  $("#checkAnswer").disabled = Object.keys(selectedAnswer).length !== question.pairs.length;
}

function handleMatchTileClick(question, tileId) {
  if (hasChecked) return;
  const placedSlot = Object.entries(selectedAnswer).find(([, id]) => id === tileId);
  if (placedSlot) { placeMatchTile(question, tileId, null); return; }
  matchSelectedTileId = matchSelectedTileId === tileId ? null : tileId;
  renderMatchAnswer(question);
}

function placeMatchTile(question, tileId, slotIndex) {
  if (hasChecked || Number.isNaN(tileId)) return;
  Object.keys(selectedAnswer).forEach(key => { if (selectedAnswer[key] === tileId) delete selectedAnswer[key]; });
  if (slotIndex !== null) selectedAnswer[slotIndex] = tileId;
  matchSelectedTileId = null;
  renderMatchAnswer(question);
}

function selectChoice(index) {
  if (hasChecked) return;
  const question = activeQuiz.questions[questionIndex];
  const requiredChoices = getCorrectIndexes(question).length;
  const existingIndex = selectedAnswer.indexOf(index);
  if (existingIndex >= 0) selectedAnswer.splice(existingIndex, 1);
  else if (selectedAnswer.length < requiredChoices) selectedAnswer.push(index);
  else return showToast("Najpierw odznacz jedną z wybranych odpowiedzi");
  $$(".answer-option").forEach((option, i) => {
    const isSelected = selectedAnswer.includes(i);
    option.classList.toggle("selected", isSelected);
    option.setAttribute("aria-pressed", String(isSelected));
  });
  $("#checkAnswer").disabled = selectedAnswer.length !== requiredChoices;
}

function normalize(value) { return String(value).trim().toLocaleLowerCase("en").replace(/[.!?]$/, ""); }
function clearAutoAdvance() {
  clearTimeout(autoAdvanceTimer);
  clearInterval(autoAdvanceCountdownTimer);
  autoAdvanceTimer = null;
  autoAdvanceCountdownTimer = null;
  const countdown = $("#autoAdvanceCountdown");
  if (countdown) { countdown.hidden = true; countdown.textContent = ""; }
}

function goToNextQuestion() {
  if (resultsShown) return;
  clearAutoAdvance();
  questionIndex++;
  if (questionIndex >= activeQuiz.questions.length) showResults(); else renderQuestion();
}

function goToPreviousQuestion() {
  if (questionIndex === 0) return;
  clearAutoAdvance();
  questionIndex--;
  renderQuestion();
}

function scheduleAutoAdvance() {
  clearAutoAdvance();
  if (!autoAdvanceSeconds || !hasChecked) return;
  const countdown = $("#autoAdvanceCountdown");
  const deadline = Date.now() + autoAdvanceSeconds * 1000;
  const updateCountdown = () => {
    const secondsLeft = Math.max(1, Math.ceil((deadline - Date.now()) / 1000));
    countdown.textContent = `Następne pytanie za ${secondsLeft} s`;
    countdown.hidden = false;
  };
  updateCountdown();
  autoAdvanceCountdownTimer = setInterval(updateCountdown, 200);
  autoAdvanceTimer = setTimeout(() => {
    if (hasChecked) goToNextQuestion();
  }, autoAdvanceSeconds * 1000);
}

function checkOrNext() {
  if (hasChecked) return goToNextQuestion();
  clearQuestionTimer();
  const question = activeQuiz.questions[questionIndex];
  if (question.type === "flashcard") { revealFlashcard(question); return; }
  const correctIndexes = question.type === "choice" ? getCorrectIndexes(question) : [];
  const selectedIndexes = question.type === "choice" ? [...selectedAnswer].sort((a, b) => a - b) : [];
  const correct = question.type === "choice"
    ? selectedIndexes.length === correctIndexes.length && selectedIndexes.every((index, position) => index === [...correctIndexes].sort((a, b) => a - b)[position])
    : question.type === "order" ? normalize(selectedAnswer.map(id => question.wordTiles.find(tile => tile.id === id)?.word || "").join(" ")) === normalize(question.answer)
    : question.type === "match" ? question.pairs.every((pair, i) => selectedAnswer[i] === i)
    : normalize(selectedAnswer) === normalize(question.answer);
  const correctText = question.type === "choice" ? correctIndexes.map(index => question.answers[index]).join(", ")
    : question.type === "match" ? question.pairs.map(pair => `${pair.left} → ${pair.right}`).join(", ")
    : question.answer;
  const correctSentence = buildCorrectSentence(question, correctText);
  const userText = question.type === "choice" ? selectedIndexes.map(index => question.answers[index]).join(", ")
    : question.type === "order" ? selectedAnswer.map(id => question.wordTiles.find(tile => tile.id === id)?.word || "").join(" ")
    : question.type === "match" ? question.pairs.map((pair, i) => `${question.matchTiles.find(tile => tile.id === selectedAnswer[i])?.left || "?"} → ${pair.right}`).join(", ")
    : selectedAnswer;
  const result = { prompt: question.prompt, correct, answer: userText, correctAnswer: correctText, selectedIndexes: question.type === "order" ? [...selectedAnswer] : selectedIndexes, matchAssignment: question.type === "match" ? { ...selectedAnswer } : undefined, correctSentence };
  results[questionIndex] = result;
  hasChecked = true;
  showCheckedQuestion(question, result);
  if (correct) celebrate();
  playSound(correct, correctSentence, scheduleAutoAdvance);
}

function showCheckedQuestion(question, result) {
  const correctIndexes = question.type === "choice" ? getCorrectIndexes(question) : [];
  const selectedIndexes = result.selectedIndexes || [];
  if (question.type === "choice") {
    $$(".answer-option").forEach((option, i) => { option.disabled = true; option.classList.remove("selected"); if (correctIndexes.includes(i)) option.classList.add("correct"); else if (selectedIndexes.includes(i)) option.classList.add("wrong"); });
  } else if (question.type === "order") {
    selectedAnswer = [...(result.selectedIndexes || [])];
    renderOrderAnswer(question, true);
    $(".order-sentence")?.classList.add(result.correct ? "correct" : "wrong");
  } else if (question.type === "match") {
    selectedAnswer = { ...(result.matchAssignment || {}) };
    renderMatchAnswer(question, true);
    $$(".match-slot").forEach((slot, i) => {
      const isCorrect = selectedAnswer[i] === i;
      slot.classList.add(isCorrect ? "correct" : "wrong");
      const tile = $(".match-tile", slot);
      if (tile) tile.insertAdjacentHTML("beforeend", `<span class="match-tile-badge" aria-hidden="true">${isCorrect ? "✓" : "✗"}</span>`);
    });
  } else if (question.type === "flashcard") {
    $("#answerArea").innerHTML = `<div class="flashcard-back-revealed ${result.correct ? "correct" : "wrong"}"><p class="flashcard-answer-text">${escapeHtml(question.answer)}</p></div>`;
  } else { const input = $("#fillInput"); input.value = result.answer || ""; input.disabled = true; input.classList.add(result.correct ? "correct" : "wrong"); }
  const feedback = $("#feedback"); feedback.classList.add(result.correct ? "good" : "bad");
  feedback.innerHTML = result.correct
    ? "✓ " + escapeHtml(soundMessages.correct) + "<small>To jest prawidłowa odpowiedź.</small>"
    : escapeHtml(soundMessages.wrong) + "<small>Poprawna odpowiedź: <strong>" + escapeHtml(result.correctAnswer) + "</strong></small>";
  feedback.dataset.spokenSentence = result.correctSentence;
  const replayButton = document.createElement("button");
  replayButton.type = "button";
  replayButton.className = "replay-sentence";
  replayButton.innerHTML = '<span aria-hidden="true">🔊</span> Odtwórz poprawne zdanie ponownie';
  replayButton.addEventListener("click", () => {
    clearAutoAdvance();
    replayCorrectSentence(result.correctSentence, scheduleAutoAdvance);
  });
  feedback.append(replayButton);
  const check = $("#checkAnswer"); check.hidden = false; check.disabled = false; check.textContent = questionIndex === activeQuiz.questions.length - 1 ? "Zobacz wynik →" : "Następne pytanie →";
}

function restoreCheckedQuestion(question, result) {
  hasChecked = true;
  selectedAnswer = question.type === "choice" || question.type === "order" ? [...(result.selectedIndexes || [])]
    : question.type === "match" ? { ...(result.matchAssignment || {}) }
    : result.answer;
  showCheckedQuestion(question, result);
}

function celebrate() {
  const stage = $(".quiz-stage");
  stage.classList.remove("success-pop");
  void stage.offsetWidth;
  stage.classList.add("success-pop");

  const burst = document.createElement("div");
  burst.className = "celebration-burst";
  burst.setAttribute("aria-hidden", "true");
  const colors = ["#287a55", "#ff856f", "#f5cf65", "#a9c85a", "#ffffff"];
  for (let i = 0; i < 72; i++) {
    const confetti = document.createElement("i");
    confetti.style.setProperty("--left", `${(i * 37) % 101}%`);
    confetti.style.setProperty("--drift", `${-90 + (i * 53) % 181}px`);
    confetti.style.setProperty("--delay", `${(i % 12) * 0.025}s`);
    confetti.style.setProperty("--duration", `${1.45 + (i % 7) * 0.1}s`);
    confetti.style.setProperty("--r", `${240 + i * 47}deg`);
    confetti.style.setProperty("--scale", `${0.7 + (i % 5) * 0.12}`);
    confetti.style.background = colors[i % colors.length];
    burst.append(confetti);
  }
  document.body.append(burst);
  setTimeout(() => { burst.remove(); stage.classList.remove("success-pop"); }, 2300);
}

function buildCorrectSentence(question, correctText) {
  const prompt = String(question.prompt || "").trim();
  const answer = String(correctText || "").trim();
  if (/_{2,}/.test(prompt)) {
    const completedSentence = prompt
      .replace(/^(?:uzupełnij|complete)[^:]*:\s*/i, "")
      .replace(/_{2,}/, answer)
      .trim();
    return completedSentence.charAt(0).toUpperCase() + completedSentence.slice(1);
  }
  return answer;
}

function playSound(correct, correctSentence = "", onComplete = null) {
  if (!soundEnabled) { if (onComplete) onComplete(); return; }
  const configuredMessage = correct ? soundMessages.correct : soundMessages.wrong;
  if ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window) {
    window.speechSynthesis.cancel();
    if (configuredMessage) speakMessage(configuredMessage, "en-US", .9);
    if (correctSentence && readAnswer) speakMessage(correctSentence, "en-US", .82, onComplete);
    else if (onComplete) onComplete();
    return;
  }
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) { if (onComplete) onComplete(); return; }
  const ctx = new AudioContext();
  const notes = correct ? [523.25, 659.25, 783.99] : [260, 205];
  notes.forEach((frequency, index) => {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = correct ? "sine" : "triangle"; osc.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, ctx.currentTime + index * .1); gain.gain.exponentialRampToValueAtTime(.12, ctx.currentTime + index * .1 + .02); gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + index * .1 + .18);
    osc.connect(gain).connect(ctx.destination); osc.start(ctx.currentTime + index * .1); osc.stop(ctx.currentTime + index * .1 + .2);
  });
  if (onComplete) setTimeout(onComplete, notes.length * 100 + 220);
}

function replayCorrectSentence(correctSentence, onComplete = null) {
  if (!soundEnabled) { showToast("Włącz dźwięk, aby odtworzyć zdanie"); if (onComplete) onComplete(); return; }
  if (!correctSentence) return;
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) { showToast("Ta przeglądarka nie obsługuje odtwarzania mowy"); if (onComplete) onComplete(); return; }
  window.speechSynthesis.cancel();
  speakMessage(correctSentence, "en-US", .82, onComplete);
}

function speakMessage(text, fallbackLanguage = "en-US", rate = .9, onEnd = null) {
  if (!text || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
  const isPolish = /[ąćęłńóśźż]/i.test(text) || /\b(?:brawo|spróbuj|jeszcze|świetnie|dobrze)\b/i.test(text);
  const language = isPolish ? "pl-PL" : fallbackLanguage;
  const message = new SpeechSynthesisUtterance(text);
  message.lang = language;
  message.rate = rate;
  message.pitch = 1;
  message.volume = 1;
  if (onEnd) { message.onend = onEnd; message.onerror = onEnd; }
  const voice = window.speechSynthesis.getVoices().find(item => item.lang.toLowerCase().startsWith(language.slice(0, 2).toLowerCase()));
  if (voice) message.voice = voice;
  window.speechSynthesis.speak(message);
}

function playResultSound(percent) {
  if (!soundEnabled) return;
  if ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window) {
    window.speechSynthesis.cancel();
    speakMessage(percent === 100 ? soundMessages.perfect : soundMessages.belowPerfect, "pl-PL", .92);
  }
}

// ── Background music (Web Audio) ────────────────────────────────────────────
const MUSIC_BPM    = 92;
const MUSIC_BEAT   = 60 / MUSIC_BPM;
const MUSIC_BAR    = MUSIC_BEAT * 4;
const MUSIC_EIGHTH = MUSIC_BEAT / 2;

// C – Am – F – G: bass root, pad tones (mid oct), melody arpeggios (high oct)
const MUSIC_CHORDS = [
  { bass: 130.81, pad: [261.63, 329.63, 392.00], mel: [523.25, 659.25, 783.99, 659.25] },
  { bass: 110.00, pad: [220.00, 261.63, 329.63], mel: [440.00, 523.25, 659.25, 523.25] },
  { bass: 174.61, pad: [174.61, 220.00, 261.63], mel: [349.23, 440.00, 523.25, 440.00] },
  { bass: 196.00, pad: [196.00, 246.94, 293.66], mel: [392.00, 493.88, 587.33, 493.88] },
];
// Melody pattern: index into mel[] per 8th note over 2 bars (16 slots), -1 = rest
const MUSIC_MEL_PAT = [0, -1, 1, 2, 1, -1, 0, -1, 0, -1, 2, 1, -1, 2, 0, 1];

function musicInit() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return false;
  musicCtx = new Ctx();
  musicMaster = musicCtx.createGain();
  musicMaster.gain.value = 0.1;
  musicMaster.connect(musicCtx.destination);
  return true;
}

function musicPlayStep() {
  if (!musicEnabled || !musicCtx || musicCtx.state === "closed") return;
  const ch = MUSIC_CHORDS[musicChordStep % MUSIC_CHORDS.length];
  musicChordStep++;
  const t   = musicCtx.currentTime;
  const dur = MUSIC_BAR * 2;

  // ── Pad — warm sustained chord, slight detuning for richness ──
  ch.pad.forEach((hz, i) => {
    [1.0, 1.004].forEach(d => {
      const osc = musicCtx.createOscillator(), env = musicCtx.createGain();
      osc.type = i === 0 ? "triangle" : "sine";
      osc.frequency.value = hz * d;
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.06 / ch.pad.length, t + 0.5);
      env.gain.setValueAtTime(0.06 / ch.pad.length, t + dur - 0.7);
      env.gain.linearRampToValueAtTime(0, t + dur);
      osc.connect(env); env.connect(musicMaster);
      osc.start(t + i * 0.07); osc.stop(t + dur + 0.1);
    });
  });

  // ── Bass — punchy sine on beats 1 & 3 of each of the 2 bars ──
  for (let bar = 0; bar < 2; bar++) {
    [[0, 1.0], [MUSIC_BEAT * 2, 1.5]].forEach(([off, mult]) => {
      const osc = musicCtx.createOscillator(), env = musicCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = ch.bass * mult;
      const nt = t + bar * MUSIC_BAR + off;
      env.gain.setValueAtTime(0, nt);
      env.gain.linearRampToValueAtTime(0.2, nt + 0.04);
      env.gain.exponentialRampToValueAtTime(0.001, nt + MUSIC_BEAT * 1.7);
      osc.connect(env); env.connect(musicMaster);
      osc.start(nt); osc.stop(nt + MUSIC_BEAT * 1.8);
    });
  }

  // ── Melody — arpeggiated notes at 8th note intervals ──
  MUSIC_MEL_PAT.forEach((idx, i) => {
    if (idx < 0) return;
    const nt = t + i * MUSIC_EIGHTH;
    const osc = musicCtx.createOscillator(), env = musicCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = ch.mel[idx % ch.mel.length];
    env.gain.setValueAtTime(0, nt);
    env.gain.linearRampToValueAtTime(0.065, nt + 0.025);
    env.gain.exponentialRampToValueAtTime(0.001, nt + MUSIC_EIGHTH * 1.6);
    osc.connect(env); env.connect(musicMaster);
    osc.start(nt); osc.stop(nt + MUSIC_EIGHTH * 1.7);
  });

  // ── Hi-hat — subtle filtered noise on every offbeat ──
  for (let bar = 0; bar < 2; bar++) {
    for (let beat = 0; beat < 4; beat++) {
      const nt  = t + bar * MUSIC_BAR + beat * MUSIC_BEAT + MUSIC_BEAT / 2;
      const buf = musicCtx.createBuffer(1, Math.ceil(musicCtx.sampleRate * 0.045), musicCtx.sampleRate);
      const dat = buf.getChannelData(0);
      for (let j = 0; j < dat.length; j++) dat[j] = Math.random() * 2 - 1;
      const src = musicCtx.createBufferSource();
      src.buffer = buf;
      const hpf = musicCtx.createBiquadFilter();
      hpf.type = "highpass"; hpf.frequency.value = 8500;
      const env = musicCtx.createGain();
      env.gain.setValueAtTime(0.018, nt);
      env.gain.exponentialRampToValueAtTime(0.001, nt + 0.045);
      src.connect(hpf); hpf.connect(env); env.connect(musicMaster);
      src.start(nt); src.stop(nt + 0.05);
    }
  }

  musicTimer = setTimeout(musicPlayStep, (dur - 0.35) * 1000);
}

function startMusic() {
  if (!musicEnabled) return;
  if (!musicCtx || musicCtx.state === "closed") { if (!musicInit()) return; }
  clearTimeout(musicTimer); musicTimer = null;
  musicChordStep = 0;
  if (musicCtx.state === "suspended") { musicCtx.resume().then(musicPlayStep); }
  else musicPlayStep();
}

function stopMusic() {
  clearTimeout(musicTimer); musicTimer = null;
  if (!musicCtx) return;
  try { musicMaster.gain.linearRampToValueAtTime(0, musicCtx.currentTime + 0.6); } catch {}
  setTimeout(() => { try { musicCtx.close(); } catch {} musicCtx = null; musicMaster = null; }, 700);
}

function updateMusicToggle() {
  const btn = $("#musicToggle");
  if (!btn) return;
  btn.classList.toggle("muted", !musicEnabled);
  btn.setAttribute("aria-label", musicEnabled ? "Wyłącz muzykę w tle" : "Włącz muzykę w tle");
  btn.title = musicEnabled ? "Muzyka włączona" : "Muzyka wyłączona";
}
// ─────────────────────────────────────────────────────────────────────────────

function celebratePerfectScore() {
  const hearts = document.createElement("div");
  hearts.className = "heart-celebration";
  const colors = ["#ff7285", "#ef5570", "#f59aaa", "#d84e67", "#ffb0ba"];
  for (let i = 0; i < 36; i++) {
    const heart = document.createElement("span");
    heart.textContent = "♥";
    heart.style.setProperty("--left", Math.random() * 100 + "%");
    heart.style.setProperty("--size", 18 + Math.random() * 24 + "px");
    heart.style.setProperty("--delay", Math.random() * .9 + "s");
    heart.style.setProperty("--duration", 2.4 + Math.random() * 1.5 + "s");
    heart.style.setProperty("--drift", -70 + Math.random() * 140 + "px");
    heart.style.setProperty("--heart-color", colors[i % colors.length]);
    hearts.append(heart);
  }
  document.body.append(hearts);
  setTimeout(() => hearts.remove(), 4500);
}

function showResults() {
  if (resultsShown) return;
  resultsShown = true;
  clearAutoAdvance();
  clearQuestionTimer();
  stopMusic();
  const correct = results.filter(result => result.correct).length;
  const percent = Math.round(correct / results.length * 100);
  $("#scorePercent").textContent = `${percent}%`; $(".score-ring").style.setProperty("--score", `${percent * 3.6}deg`);
  $("#correctCount").textContent = correct; $("#wrongCount").textContent = results.length - correct; $("#totalCount").textContent = results.length;
  $("#resultTitle").textContent = percent === 100 ? "Perfekcyjnie!" : percent >= 70 ? "Świetna robota!" : percent >= 40 ? "Dobry początek!" : "Praktyka czyni mistrza";
  $("#resultSubtitle").textContent = `Ukończyłeś test „${activeQuiz.title}". ${percent >= 70 ? "Tak trzymaj!" : "Sprawdź odpowiedzi i spróbuj ponownie."}`;
  $("#reviewList").innerHTML = results.map((result, i) => `<article class="review-item ${result.correct ? "good" : "bad"}"><span class="review-status">${result.correct ? "✓" : "×"}</span><div><p>${i+1}. ${escapeHtml(result.prompt)}</p><small>Twoja odpowiedź: ${escapeHtml(result.answer || "brak")}</small></div><div class="review-answer">Poprawna odpowiedź<strong>${escapeHtml(result.correctAnswer)}</strong></div></article>`).join("");
  updateSrAfterQuiz(activeQuiz.id, results, activeQuiz.questions);
  const wrongResults = results.filter(r => !r.correct).length;
  const retryWrongBtn = $("#retryWrong");
  if (retryWrongBtn) {
    retryWrongBtn.hidden = wrongResults === 0;
    if (wrongResults > 0) { const lbl = wrongResults === 1 ? "pytanie" : wrongResults < 5 ? "pytania" : "pytań"; retryWrongBtn.textContent = `↺ Powtórz ${wrongResults} błędne ${lbl}`; }
  }
  showView("results");
  playResultSound(percent);
  if (percent === 100) celebratePerfectScore();
}

function resetCreator() {
  $("#quizForm").reset();
  creatorImageData = "";
  updateImagePreview();
  $("#questionList").innerHTML = ""; questionCounter = 0; addQuestion("choice"); addQuestion("fill");
}

function updateImagePreview() {
  const preview = $("#imagePreview");
  preview.innerHTML = "";
  if (creatorImageData) {
    const image = document.createElement("img");
    image.src = creatorImageData;
    image.alt = "Podgląd obrazka testu";
    preview.append(image);
  } else preview.innerHTML = '<span aria-hidden="true">▧</span><small>Brak obrazka</small>';
  $("#removeQuizImage").hidden = !creatorImageData;
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Nie udało się odczytać pliku"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Nieprawidłowy plik obrazu"));
      image.onload = () => {
        const maxWidth = 1400;
        const maxHeight = 1000;
        const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", .85));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handleQuizImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) return showToast("Wybierz plik graficzny JPG, PNG lub WebP");
  try {
    creatorImageData = await compressImage(file);
    $("#quizImageUrl").value = "";
    updateImagePreview();
    showToast("Obrazek został dodany");
  } catch (error) { showToast(error.message); }
}

function handleQuizImageUrl() {
  const value = $("#quizImageUrl").value.trim();
  if (value) creatorImageData = value;
  else if (/^https?:/i.test(creatorImageData)) creatorImageData = "";
  updateImagePreview();
}

function removeQuizImage() {
  creatorImageData = "";
  $("#quizImage").value = "";
  $("#quizImageUrl").value = "";
  $("#imageSearchResults").hidden = true;
  updateImagePreview();
}

async function searchImages() {
  const query = $("#imageSearchQuery").value.trim();
  if (!query) return;
  const results = $("#imageSearchResults");
  results.hidden = false;
  results.innerHTML = '<span class="image-search-status">Szukam…</span>';
  try {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page_size=9&mature=false`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    if (!data.results?.length) {
      results.innerHTML = '<span class="image-search-status">Brak wyników — spróbuj po angielsku</span>';
      return;
    }
    results.innerHTML = data.results.map(item =>
      `<button type="button" class="image-search-thumb" data-url="${escapeHtml(item.url)}" title="${escapeHtml(item.title || '')}"><img src="${escapeHtml(item.thumbnail || item.url)}" alt="${escapeHtml(item.title || '')}" loading="lazy" /></button>`
    ).join("");
    $$("#imageSearchResults .image-search-thumb").forEach(btn => {
      btn.addEventListener("click", () => {
        creatorImageData = btn.dataset.url;
        $("#quizImageUrl").value = creatorImageData;
        updateImagePreview();
        $$("#imageSearchResults .image-search-thumb").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  } catch {
    results.innerHTML = '<span class="image-search-status">Nie udało się pobrać wyników. Sprawdź połączenie z internetem.</span>';
  }
}

function updateCreatorMode() {
  $("#createTitle").textContent = editingQuizId ? "Edytuj test" : "Stwórz nowy test";
  $("#saveQuizButton").innerHTML = editingQuizId ? "Zapisz zmiany <span>→</span>" : "Zapisz test <span>→</span>";
}

function beginNewQuiz() {
  editingQuizId = null;
  resetCreator();
  if (activeCategory !== "all") $("#quizCategory").value = activeCategory;
  renderCreatorCategoryOptions();
  updateCreatorMode();
  showView("create");
}

function editQuiz(id) {
  const quiz = quizzes.find(item => item.id === id);
  if (!quiz) return;
  editingQuizId = id;
  $("#quizForm").reset();
  $("#quizTitle").value = quiz.title;
  $("#quizLevel").value = quiz.level;
  $("#quizCategory").value = quiz.category || "";
  renderCreatorCategoryOptions();
  creatorImageData = quiz.image || "";
  $("#quizImageUrl").value = /^https?:/i.test(creatorImageData) ? creatorImageData : "";
  updateImagePreview();
  $("#shuffleQuestions").checked = quiz.shuffleQuestions !== false;
  $("#shuffleAnswers").checked = quiz.shuffleAnswers !== false;
  $("#questionList").innerHTML = "";
  questionCounter = 0;
  quiz.questions.forEach(question => {
    const card = addQuestion(question.type);
    $(".question-prompt", card).value = question.prompt;
    $(".question-instruction", card).value = question.instruction || "";
    if (question.type === "choice") {
      card.imageData = question.image || "";
      renderEditor(card, question.answers, getCorrectIndexes(question));
    } else if (question.type === "order") $(".order-correct", card).value = question.answer;
    else if (question.type === "match") renderEditor(card, question.pairs);
    else if (question.type === "fill") {
      card.imageData = question.image || "";
      $(".fill-correct", card).value = question.answer;
      updateQuestionImagePreview(card);
    }
    else $(".fill-correct", card).value = question.answer;
  });
  updateCreatorMode();
  showView("create");
}

function addQuestion(type = "choice") {
  questionCounter++;
  const card = document.createElement("article"); card.className = "question-card"; card.dataset.type = type; card.dataset.uid = questionCounter; card.imageData = "";
  card.innerHTML = `<div class="question-card-header"><span class="question-number">Pytanie <b></b></span><button type="button" class="remove-question" aria-label="Usuń pytanie">Usuń</button></div><div class="type-switch"><button type="button" class="type-option ${type === "choice" ? "active" : ""}" data-type="choice">Test wyboru</button><button type="button" class="type-option ${type === "fill" ? "active" : ""}" data-type="fill">Uzupełnij zdanie</button><button type="button" class="type-option ${type === "order" ? "active" : ""}" data-type="order">Uporządkuj</button><button type="button" class="type-option ${type === "match" ? "active" : ""}" data-type="match">Dopasuj</button><button type="button" class="type-option ${type === "flashcard" ? "active" : ""}" data-type="flashcard">Fiszka</button></div><input class="text-input question-instruction" placeholder="Polecenie nad pytaniem (opcjonalnie), np. Complete the sentence" maxlength="80" /><input class="text-input question-prompt" required placeholder="Wpisz treść pytania…" maxlength="180" /><div class="dynamic-editor"></div>`;
  $("#questionList").append(card); renderEditor(card); renumberQuestions();
  $(".remove-question", card).addEventListener("click", () => { if ($$(".question-card").length <= 1) return showToast("Test musi mieć co najmniej jedno pytanie"); card.remove(); renumberQuestions(); });
  $$(".type-option", card).forEach(button => button.addEventListener("click", () => switchQuestionType(card, button.dataset.type)));
  return card;
}

function switchQuestionType(card, nextType) {
  const currentType = card.dataset.type;
  if (currentType === nextType) return;

  if (currentType === "choice") {
    const answerInputs = $$(".answer-editor-row input[type='text']", card);
    const selected = $$(".answer-editor-row input[type='checkbox']:checked", card).map(input => Number(input.value));
    card.choiceCache = { answers: answerInputs.map(input => input.value), correctAnswers: selected.length ? selected : [0] };
    card.fillCache = card.choiceCache.answers[card.choiceCache.correctAnswers[0]] || "";
  } else if (currentType === "order") card.orderCache = $(".order-correct", card)?.value || "";
  else if (currentType === "match") card.matchCache = $$(".match-pair-row", card).map(row => ({ left: $(".match-pair-left", row).value, right: $(".match-pair-right", row).value }));
  else card.fillCache = $(".fill-correct", card)?.value || "";

  const matchFirstPairRight = card.matchCache?.find(pair => pair.right)?.right || "";
  const matchFirstPairLeft = card.matchCache?.find(pair => pair.left)?.left || "";

  card.dataset.type = nextType;
  $$(".type-option", card).forEach(button => button.classList.toggle("active", button.dataset.type === nextType));
  if (nextType === "fill" || nextType === "flashcard") {
    renderEditor(card);
    $(".fill-correct", card).value = card.fillCache || card.orderCache || matchFirstPairRight || "";
  } else if (nextType === "order") {
    renderEditor(card);
    $(".order-correct", card).value = card.orderCache || card.fillCache || card.choiceCache?.answers?.[card.choiceCache.correctAnswers[0]] || matchFirstPairLeft || "";
  } else if (nextType === "match") {
    renderEditor(card, card.matchCache);
  } else if (currentType === "match" && card.matchCache?.some(pair => pair.right)) {
    renderEditor(card, card.matchCache.slice(0, 4).map(pair => pair.right), [0]);
  } else {
    const cached = card.choiceCache || { answers: [card.fillCache || card.orderCache || "", "", "", ""], correctAnswers: [0] };
    renderEditor(card, cached.answers, cached.correctAnswers);
  }
}

function setAllQuestionTypes(type) {
  const cards = $$(".question-card");
  const convertedFromFill = type === "choice" && cards.some(card => card.dataset.type === "fill" && !card.choiceCache);
  cards.forEach(card => switchQuestionType(card, type));
  const typeLabel = type === "choice" ? "test wyboru" : type === "fill" ? "uzupełnij zdanie" : type === "match" ? "dopasuj" : type === "flashcard" ? "fiszka" : "uporządkuj zdanie";
  showToast(convertedFromFill ? "Zmieniono typ. Dopisz błędne odpowiedzi w nowych testach wyboru" : `Wszystkie pytania: ${typeLabel}`);
}

function updateChoiceCorrectCount(card) {
  const checked = $$(".answer-editor-row input[type='checkbox']:checked", card);
  const counter = $(".choice-correct-summary strong", card);
  if (counter) counter.textContent = checked.length;
  $$(".answer-editor-row", card).forEach(row => row.classList.toggle("correct-marked", $("input[type='checkbox']", row).checked));
}

function updateQuestionImagePreview(card) {
  const preview = $(".question-image-preview", card);
  if (!preview) return;
  preview.innerHTML = card.imageData
    ? `<img src="${escapeHtml(card.imageData)}" alt="" />`
    : '<span aria-hidden="true">▧</span><small>Obrazek pytania (opcjonalnie)</small>';
  const removeButton = $(".question-image-remove", card);
  if (removeButton) removeButton.hidden = !card.imageData;
}

function bindQuestionImagePicker(card) {
  const fileInput = $(".question-image-file", card);
  const urlInput = $(".question-image-url", card);
  const removeButton = $(".question-image-remove", card);
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    fileInput.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return showToast("Wybierz plik graficzny JPG, PNG lub WebP");
    try {
      card.imageData = await compressImage(file);
      urlInput.value = "";
      updateQuestionImagePreview(card);
    } catch (error) { showToast(error.message); }
  });
  urlInput.addEventListener("input", () => {
    const value = urlInput.value.trim();
    if (value) card.imageData = value;
    else if (/^https?:/i.test(card.imageData || "")) card.imageData = "";
    updateQuestionImagePreview(card);
  });
  removeButton.addEventListener("click", () => {
    card.imageData = "";
    urlInput.value = "";
    updateQuestionImagePreview(card);
  });
}

function questionImagePickerHtml(card) {
  const imageUrlValue = card.imageData && /^https?:/i.test(card.imageData) ? card.imageData : "";
  return `<div class="question-image-picker"><div class="question-image-preview">${card.imageData ? `<img src="${escapeHtml(card.imageData)}" alt="" />` : '<span aria-hidden="true">▧</span><small>Obrazek pytania (opcjonalnie)</small>'}</div><div class="question-image-actions"><label class="image-file-button">Wybierz plik<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="question-image-file" hidden /></label><input type="url" class="image-url-input question-image-url" placeholder="lub wklej adres URL obrazka…" value="${escapeHtml(imageUrlValue)}" /><button type="button" class="question-image-remove" ${card.imageData ? "" : "hidden"}>Usuń</button></div><p class="fill-editor-note">Dodaj obrazek, aby wyświetlić pytanie jak fiszkę ze zdjęciem i kolorowymi odpowiedziami.</p></div>`;
}

function renderEditor(card, answerValues = null, correctIndexes = [0]) {
  const editor = $(".dynamic-editor", card);
  const values = answerValues || ["", "", "", ""];
  if (card.dataset.type === "choice") {
    const selectedIndexes = correctIndexes.length ? correctIndexes : [0];
    editor.innerHTML = `<div class="choice-correct-summary">Liczba prawidłowych odpowiedzi: <strong>${selectedIndexes.length}</strong><span>Zaznacz checkbox przy każdej poprawnej odpowiedzi.</span></div><div class="answers-editor">${values.map((value, i) => `<label class="answer-editor-row ${selectedIndexes.includes(i) ? "correct-marked" : ""}"><input type="checkbox" value="${i}" ${selectedIndexes.includes(i) ? "checked" : ""} /><input type="text" required value="${escapeHtml(value)}" placeholder="Odpowiedź ${String.fromCharCode(65+i)}" maxlength="100" /></label>`).join("")}</div>${questionImagePickerHtml(card)}`;
    $$(".answer-editor-row input[type='checkbox']", card).forEach(input => input.addEventListener("change", () => updateChoiceCorrectCount(card)));
    bindQuestionImagePicker(card);
  }
  else if (card.dataset.type === "order") editor.innerHTML = '<p class="fill-editor-note">Wpisz całe poprawne zdanie. Aplikacja podzieli je na słowa i pomiesza kafelki.</p><input class="text-input order-correct" required placeholder="Np. I love you." maxlength="180" />';
  else if (card.dataset.type === "match") {
    const pairs = (Array.isArray(answerValues) && answerValues.length ? answerValues : null) || [{ left: "", right: "" }, { left: "", right: "" }, { left: "", right: "" }];
    editor.innerHTML = `<p class="fill-editor-note">Dodaj co najmniej dwie pary. Lewa kolumna to kafelek do przeciągnięcia, prawa to pole docelowe.</p><div class="match-pairs-editor">${pairs.map(pair => matchPairRowHtml(pair)).join("")}</div><button type="button" class="add-match-pair">+ Dodaj parę</button>`;
    bindMatchPairsEditor(card);
  }
  else if (card.dataset.type === "flashcard") editor.innerHTML = '<p class="fill-editor-note">Wpisz tłumaczenie lub definicję (tył fiszki). Treść pytania powyżej to awers.</p><input class="text-input fill-correct" required placeholder="Np. ciekawy" maxlength="200" />';
  else {
    editor.innerHTML = `<p class="fill-editor-note">Podaj odpowiedź akceptowaną jako prawidłowa (wielkość liter nie ma znaczenia).</p><input class="text-input fill-correct" required placeholder="Prawidłowa odpowiedź…" maxlength="100" />${questionImagePickerHtml(card)}`;
    bindQuestionImagePicker(card);
  }
}

function matchPairRowHtml(pair) {
  return `<div class="match-pair-row"><input type="text" class="match-pair-left" required value="${escapeHtml(pair.left || "")}" placeholder="Kafelek (np. pencil case)" maxlength="60" /><span class="match-pair-arrow" aria-hidden="true">→</span><input type="text" class="match-pair-right" required value="${escapeHtml(pair.right || "")}" placeholder="Pole (np. piórnik)" maxlength="60" /><button type="button" class="remove-match-pair" aria-label="Usuń parę">×</button></div>`;
}

function bindMatchPairsEditor(card) {
  const editor = $(".dynamic-editor", card);
  const list = $(".match-pairs-editor", editor);
  $$(".remove-match-pair", list).forEach(button => button.addEventListener("click", () => {
    if ($$(".match-pair-row", list).length <= 2) return showToast("Pytanie typu Dopasuj musi mieć co najmniej dwie pary");
    button.closest(".match-pair-row").remove();
  }));
  $(".add-match-pair", editor).addEventListener("click", () => {
    list.insertAdjacentHTML("beforeend", matchPairRowHtml({ left: "", right: "" }));
    const lastRow = list.lastElementChild;
    $(".remove-match-pair", lastRow).addEventListener("click", () => {
      if ($$(".match-pair-row", list).length <= 2) return showToast("Pytanie typu Dopasuj musi mieć co najmniej dwie pary");
      lastRow.remove();
    });
    $(".match-pair-left", lastRow).focus();
  });
}
function renumberQuestions() { $$(".question-card").forEach((card, i) => $(".question-number b", card).textContent = i + 1); }

function parseCsvLine(line) {
  const fields = [];
  let value = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { value += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(value.trim());
      value = "";
    } else value += char;
  }
  if (inQuotes) return null;
  fields.push(value.trim());
  return fields;
}

const VERB_GENERATOR_THIRD_PERSON_SUBJECTS = new Set(["he", "she", "it"]);
const VERB_GENERATOR_PRESENT_IRREGULAR_FORMS = { have: "has", be: "is" };
// Past Simple form is the same for every subject, so this list only needs the base → past mapping.
const VERB_GENERATOR_PAST_IRREGULAR_FORMS = {
  be: "was", have: "had", go: "went", do: "did", make: "made", get: "got", know: "knew",
  think: "thought", take: "took", see: "saw", come: "came", want: "wanted", look: "looked",
  give: "gave", use: "used", find: "found", tell: "told", ask: "asked", work: "worked",
  seem: "seemed", feel: "felt", try: "tried", leave: "left", call: "called", say: "said",
  become: "became", show: "showed", bring: "brought", write: "wrote", sit: "sat",
  stand: "stood", lose: "lost", pay: "paid", meet: "met", let: "let", begin: "began",
  keep: "kept", hold: "held", speak: "spoke", run: "ran", read: "read", grow: "grew",
  win: "won", teach: "taught", eat: "ate", drink: "drank", buy: "bought", send: "sent",
  build: "built", spend: "spent", set: "set", learn: "learnt", understand: "understood",
  hear: "heard", drive: "drove", break: "broke", catch: "caught",
  choose: "chose", cut: "cut", draw: "drew", fall: "fell", feed: "fed", fight: "fought",
  fly: "flew", forget: "forgot", forgive: "forgave", freeze: "froze", hide: "hid", hit: "hit",
  hurt: "hurt", lay: "laid", lead: "led", lend: "lent", lie: "lay", light: "lit",
  put: "put", ride: "rode", ring: "rang", rise: "rose", sell: "sold", shine: "shone",
  shoot: "shot", shut: "shut", sing: "sang", sink: "sank", sleep: "slept", smell: "smelt",
  speed: "sped", spell: "spelt", spill: "spilt", spread: "spread", swim: "swam",
  swing: "swung", throw: "threw", wake: "woke", wear: "wore", cost: "cost"
};

function parseVerbToken(token) {
  const [base, override] = token.split("=").map(part => part.trim());
  return { verb: base, override: override || null };
}

function conjugatePresentSimple(verb, thirdPersonSingular) {
  const trimmed = verb.trim();
  if (!thirdPersonSingular) return trimmed;
  const lower = trimmed.toLowerCase();
  if (VERB_GENERATOR_PRESENT_IRREGULAR_FORMS[lower]) return VERB_GENERATOR_PRESENT_IRREGULAR_FORMS[lower];
  if (/(?:s|x|z|sh|ch)$/i.test(trimmed)) return trimmed + "es";
  if (/[^aeiou]y$/i.test(trimmed)) return trimmed.slice(0, -1) + "ies";
  if (/o$/i.test(trimmed)) return trimmed + "es";
  return trimmed + "s";
}

function conjugatePastSimple(verb) {
  const trimmed = verb.trim();
  const lower = trimmed.toLowerCase();
  if (VERB_GENERATOR_PAST_IRREGULAR_FORMS[lower]) return VERB_GENERATOR_PAST_IRREGULAR_FORMS[lower];
  if (/e$/i.test(trimmed)) return trimmed + "d";
  if (/[^aeiou]y$/i.test(trimmed)) return trimmed.slice(0, -1) + "ied";
  if (/[^aeiou][aeiou][bcdfgklmnprtvz]$/i.test(trimmed) && trimmed.length <= 4) return trimmed + trimmed.slice(-1) + "ed";
  return trimmed + "ed";
}

function csvQuoteField(value) {
  const text = String(value || "");
  return /[,"\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

function updateVerbTenseOptionStyle(input) {
  input.closest(".verb-tense-option").classList.toggle("active", input.checked);
}

function questionAuxiliary(isPast, thirdPersonSingular) {
  if (isPast) return "Did";
  return thirdPersonSingular ? "Does" : "Do";
}

function openVerbGenerator() {
  $("#verbGeneratorModal").hidden = false;
  setTimeout(() => $("#verbGeneratorVerbs").focus(), 0);
}

function closeVerbGenerator() {
  $("#verbGeneratorModal").hidden = true;
}

function generateVerbGeneratorCsv(event) {
  event.preventDefault();
  const verbLines = $("#verbGeneratorVerbs").value.split(/\r?\n/).filter(line => line.trim());
  if (!verbLines.length) return showToast("Wpisz co najmniej jeden czasownik");
  const tenses = $$("#verbGeneratorTense input[type='checkbox']:checked").map(input => input.value);
  const formTypes = $$("#verbGeneratorFormType input[type='checkbox']:checked").map(input => input.value);
  if (!tenses.length) return showToast("Wybierz co najmniej jeden czas");
  if (!formTypes.length) return showToast("Wybierz co najmniej jedną formę zdania");
  const subjects = $$("#verbGeneratorSubjects input[type='checkbox']:checked").map(input => input.value);
  const names = $("#verbGeneratorNames").value.split(",").map(name => name.trim()).filter(Boolean);
  if (!subjects.length && !names.length) return showToast("Wybierz co najmniej jeden podmiot");

  const allSubjects = [...subjects, ...names];
  const rows = [];
  verbLines.forEach(line => {
    const fields = parseCsvLine(line);
    if (!fields || !fields[0]) return;
    const { verb, override } = parseVerbToken(fields[0]);
    const rest = (fields[1] || "").trim();
    tenses.forEach(tense => {
      const isPast = tense === "past";
      formTypes.forEach(formType => {
        const isQuestion = formType === "question";
        allSubjects.forEach(subject => {
          const thirdPersonSingular = names.includes(subject) || VERB_GENERATOR_THIRD_PERSON_SUBJECTS.has(subject.toLowerCase());
          let sentence, answer;
          if (isQuestion) {
            answer = questionAuxiliary(isPast, thirdPersonSingular);
            const displaySubject = subject === "I" || names.includes(subject) ? subject : subject.toLowerCase();
            sentence = `___ ${displaySubject} ${verb}${rest ? " " + rest : ""}`;
            if (!/[.?!]$/.test(sentence)) sentence += "?";
          } else {
            answer = override || (isPast ? conjugatePastSimple(verb) : conjugatePresentSimple(verb, thirdPersonSingular));
            sentence = `${subject} ___ (${verb})${rest ? " " + rest : ""}`;
            if (!/[.?!]$/.test(sentence)) sentence += ".";
          }
          rows.push(`${csvQuoteField(sentence)}, ${csvQuoteField(answer)}, fill`);
        });
      });
    });
  });
  if (!rows.length) return showToast("Nie udało się wygenerować pytań");

  const csvInput = $("#csvInput");
  csvInput.value = csvInput.value.trim() ? csvInput.value.trim() + "\n" + rows.join("\n") : rows.join("\n");
  closeVerbGenerator();
  showToast(`Wygenerowano ${rows.length} ${rows.length === 1 ? "pytanie" : "pytań"} — sprawdź pole CSV i kliknij „Wczytaj pytania”`);
  csvInput.scrollIntoView({ behavior: "smooth", block: "start" });
}

function importCsvQuestions() {
  const raw = $("#csvInput").value.trim();
  if (!raw) return showToast("Najpierw wklej pytania w formacie CSV");

  const rows = raw.split(/\r?\n/).filter(line => line.trim());
  const parsedRows = rows.map(parseCsvLine).map(fields => {
    if (!fields || !fields[0] || !fields[1]) return null;
    const typeToken = fields[fields.length - 1].toLocaleLowerCase("pl").normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
    const fillTokens = ["fill", "uzupelnij", "uzupelnianie", "uzupelnij zdanie"];
    const choiceTokens = ["choice", "wybor", "test wyboru", "multiple choice"];
    const orderTokens = ["order", "uporzadkuj", "uporzadkuj zdanie", "kolejnosc"];
    const flashcardTokens = ["flashcard", "fiszka", "fiszki"];
    const matchTokens = ["match", "dopasuj", "dopasowanie"];
    const hasType = fillTokens.includes(typeToken) || choiceTokens.includes(typeToken) || orderTokens.includes(typeToken) || flashcardTokens.includes(typeToken) || matchTokens.includes(typeToken);
    const type = matchTokens.includes(typeToken) ? "match" : flashcardTokens.includes(typeToken) ? "flashcard" : orderTokens.includes(typeToken) ? "order" : fillTokens.includes(typeToken) ? "fill" : "choice";
    const content = hasType ? fields.slice(0, -1) : fields;
    const [rawPrompt, ...rest] = content;
    const instructionMatch = /^\[([^\]]+)\]\s*(.+)$/.exec(rawPrompt || "");
    const instruction = instructionMatch ? instructionMatch[1].trim() : "";
    const prompt = instructionMatch ? instructionMatch[2].trim() : rawPrompt;
    if (type === "match") {
      const pairs = rest.map(field => {
        const [left, right] = field.split("=").map(part => part.trim());
        return left && right ? { left, right } : null;
      }).filter(Boolean);
      if (!prompt || pairs.length < 2) return null;
      return { type, prompt, pairs, instruction };
    }
    const [correct, ...incorrect] = rest;
    const correctAnswers = type === "choice" ? correct.split("|").map(answer => answer.trim()).filter(Boolean) : [correct];
    const incorrectAnswers = incorrect.filter(Boolean);
    if (!prompt || !correctAnswers.length || (type === "choice" && correctAnswers.length + incorrectAnswers.length < 2)) return null;
    return { type, prompt, correct: correctAnswers[0], correctAnswers, incorrect: incorrectAnswers, instruction };
  });
  const validRows = parsedRows.filter(Boolean);
  if (!validRows.length) return showToast("Nie znaleziono prawidłowych wierszy CSV");

  const existingCards = $$(".question-card");
  if (existingCards.every(card => !$(".question-prompt", card).value.trim())) $("#questionList").innerHTML = "";

  validRows.forEach(row => {
    const card = addQuestion(row.type);
    $(".question-prompt", card).value = row.prompt;
    if (row.instruction) $(".question-instruction", card).value = row.instruction;
    if (row.type === "choice") {
      const answers = [...row.correctAnswers, ...row.incorrect].slice(0, 4);
      const correctIndexes = row.correctAnswers.slice(0, answers.length).map((_, index) => index);
      renderEditor(card, answers, correctIndexes);
    }
    else if (row.type === "order") $(".order-correct", card).value = row.correct;
    else if (row.type === "match") renderEditor(card, row.pairs);
    else $(".fill-correct", card).value = row.correct;
  });
  renumberQuestions();
  const skipped = rows.length - validRows.length;
  showToast(`Dodano ${validRows.length} ${validRows.length === 1 ? "pytanie" : "pytań"}${skipped ? `. Pominięto: ${skipped}` : ""}`);
  $("#questionList").scrollIntoView({ behavior: "smooth", block: "start" });
}
function saveCreatedQuiz(event) {
  event.preventDefault();
  const questions = $$(".question-card").map((card) => {
    const prompt = $(".question-prompt", card).value.trim();
    const instruction = $(".question-instruction", card).value.trim();
    if (card.dataset.type === "flashcard") { const question = { type: "flashcard", prompt, answer: $(".fill-correct", card).value.trim() }; if (instruction) question.instruction = instruction; return question; }
    if (card.dataset.type === "fill") {
      const question = { type: "fill", prompt, answer: $(".fill-correct", card).value.trim() };
      if (card.imageData) question.image = card.imageData;
      if (instruction) question.instruction = instruction;
      return question;
    }
    if (card.dataset.type === "order") {
      const answer = $(".order-correct", card).value.trim();
      const question = { type: "order", prompt, answer, words: answer.split(/\s+/).filter(Boolean) };
      if (instruction) question.instruction = instruction;
      return question;
    }
    if (card.dataset.type === "match") {
      const pairs = $$(".match-pair-row", card).map(row => ({ left: $(".match-pair-left", row).value.trim(), right: $(".match-pair-right", row).value.trim() })).filter(pair => pair.left && pair.right);
      const question = { type: "match", prompt, pairs };
      if (instruction) question.instruction = instruction;
      return question;
    }
    const rawInputs = $$(".answer-editor-row input[type='text']", card).map((input, i) => ({ value: input.value.trim(), origIdx: i }));
    const filteredInputs = rawInputs.filter(item => item.value);
    const answers = filteredInputs.map(item => item.value);
    const checkedIndexes = $$(".answer-editor-row input[type='checkbox']:checked", card).map(input => Number(input.value));
    const correctAnswers = checkedIndexes.map(origIdx => filteredInputs.findIndex(item => item.origIdx === origIdx)).filter(i => i !== -1);
    const question = { type: "choice", prompt, answers, correct: correctAnswers[0] ?? 0, correctAnswers };
    if (card.imageData) question.image = card.imageData;
    if (instruction) question.instruction = instruction;
    return question;
  });
  if (questions.some(question => question.type === "choice" && !question.correctAnswers.length)) return showToast("Każde pytanie wyboru musi mieć co najmniej jedną poprawną odpowiedź");
  if (questions.some(question => question.type === "match" && question.pairs.length < 2)) return showToast("Każde pytanie typu Dopasuj musi mieć co najmniej dwie pełne pary");
  const wasEditing = Boolean(editingQuizId);
  const quiz = { id: editingQuizId || `quiz-${Date.now()}`, title: $("#quizTitle").value.trim(), level: $("#quizLevel").value, category: $("#quizCategory").value.trim() || "Angielski", image: creatorImageData, shuffleQuestions: $("#shuffleQuestions").checked, shuffleAnswers: $("#shuffleAnswers").checked, questions };
  if (wasEditing) quizzes = quizzes.map(item => item.id === editingQuizId ? quiz : item);
  else quizzes.unshift(quiz);
  if (!customCategories.some(category => category.localeCompare(quiz.category, "pl", { sensitivity: "base" }) === 0)) {
    customCategories.push(quiz.category);
    saveCategories();
  }
  saveQuizzes();
  if (window.firebaseDB) window.firebaseDB.saveQuiz(quiz);
  activeCategory = quiz.category;
  editingQuizId = null;
  resetCreator();
  updateCreatorMode();
  showView("home");
  showToast(wasEditing ? "Zmiany w teście zostały zapisane" : "Test zapisany — możesz zaczynać!");
}
function showToast(message) { const toast = $("#toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600); }

async function copyPlaceholderToClipboard(textareaSelector) {
  const example = $(textareaSelector)?.placeholder || "";
  if (!example) return showToast("Brak przykładu do skopiowania");
  try {
    await navigator.clipboard.writeText(example);
    showToast("Przykład skopiowany do schowka");
  } catch {
    showToast("Nie udało się skopiować — sprawdź uprawnienia przeglądarki");
  }
}

$$("[data-view]").forEach(button => button.addEventListener("click", () => button.dataset.view === "create" ? beginNewQuiz() : showView(button.dataset.view)));
$("#homeButton").addEventListener("click", () => showView("home"));
$("#addCategory").addEventListener("click", createCategory);
$("#cancelCategory").addEventListener("click", closeCategoryModal);
$("#categoryForm").addEventListener("submit", saveCreatedCategory);
$("#categoryModal").addEventListener("click", event => { if (event.target.id === "categoryModal") closeCategoryModal(); });
$("#cancelDeleteCategory").addEventListener("click", closeDeleteCategoryModal);
$("#confirmDeleteCategory").addEventListener("click", deleteCategoryWithQuizzes);
$("#deleteCategoryModal").addEventListener("click", event => { if (event.target.id === "deleteCategoryModal") closeDeleteCategoryModal(); });
$("#startFeatured").addEventListener("click", () => startQuiz(quizzes[0]?.id));
$("#soundToggle").addEventListener("click", () => { soundEnabled = !soundEnabled; if (!soundEnabled && "speechSynthesis" in window) window.speechSynthesis.cancel(); $("#soundToggle").classList.toggle("muted", !soundEnabled); $("#soundToggle").setAttribute("aria-label", soundEnabled ? "Wyłącz dźwięki" : "Włącz dźwięki"); $("#soundToggle").title = soundEnabled ? "Dźwięki włączone" : "Dźwięki wyłączone"; });
$("#soundSettings").addEventListener("click", openSoundMessages);
$("#musicToggle").addEventListener("click", () => {
  musicEnabled = !musicEnabled;
  localStorage.setItem(MUSIC_STORAGE_KEY, String(musicEnabled));
  updateMusicToggle();
  if (!musicEnabled) { stopMusic(); }
  else if ($("#playView").classList.contains("active")) { startMusic(); }
});
$("#cancelSoundMessages").addEventListener("click", closeSoundMessages);
$("#soundMessagesForm").addEventListener("submit", saveConfiguredSoundMessages);
$("#soundMessagesModal").addEventListener("click", event => { if (event.target.id === "soundMessagesModal") closeSoundMessages(); });
$("#dailyWordsSettings").addEventListener("click", openDailyWordsSettings);
$("#cancelDailyWords").addEventListener("click", closeDailyWordsSettings);
$("#restoreDailyWords").addEventListener("click", restoreDefaultDailyWords);
$("#dailyWordsForm").addEventListener("submit", saveConfiguredDailyWords);
$("#dailyWordsModal").addEventListener("click", event => { if (event.target.id === "dailyWordsModal") closeDailyWordsSettings(); });
$("#checkAnswer").addEventListener("click", checkOrNext);
$("#previousQuestion").addEventListener("click", goToPreviousQuestion);
$("#exitQuiz").addEventListener("click", () => { if (!results.length || confirm("Zakończyć test? Twój bieżący wynik nie zostanie zapisany.")) { clearAutoAdvance(); stopMusic(); showView("home"); } });
$("#retryQuiz").addEventListener("click", () => startQuiz(activeQuiz.id));
$("#retryWrong").addEventListener("click", startQuizWrong);
$("#addQuestion").addEventListener("click", () => addQuestion("choice"));
$("#importCsv").addEventListener("click", importCsvQuestions);
$("#copyCsvFormat").addEventListener("click", () => copyPlaceholderToClipboard("#csvInput"));
$("#copyDailyWordsFormat").addEventListener("click", () => copyPlaceholderToClipboard("#dailyWordsInput"));
$("#copyVerbGeneratorFormat").addEventListener("click", () => copyPlaceholderToClipboard("#verbGeneratorVerbs"));
$("#openVerbGenerator").addEventListener("click", openVerbGenerator);
$("#cancelVerbGenerator").addEventListener("click", closeVerbGenerator);
$("#verbGeneratorForm").addEventListener("submit", generateVerbGeneratorCsv);
$("#verbGeneratorModal").addEventListener("click", event => { if (event.target.id === "verbGeneratorModal") closeVerbGenerator(); });
$$("#verbGeneratorTense input[type='checkbox'], #verbGeneratorFormType input[type='checkbox']").forEach(input => {
  updateVerbTenseOptionStyle(input);
  input.addEventListener("change", () => updateVerbTenseOptionStyle(input));
});
$$("[data-bulk-type]").forEach(button => button.addEventListener("click", () => setAllQuestionTypes(button.dataset.bulkType)));
$("#quizImage").addEventListener("change", handleQuizImage);
$("#quizImageUrl").addEventListener("input", handleQuizImageUrl);
$("#removeQuizImage").addEventListener("click", removeQuizImage);
$("#imageSearchBtn").addEventListener("click", searchImages);
$("#imageSearchQuery").addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); searchImages(); } });
$("#categoryDropdownToggle").addEventListener("click", () => toggleCategoryDropdown());
$("#quizCategory").addEventListener("focus", () => toggleCategoryDropdown(true));
$("#quizCategory").addEventListener("keydown", event => { if (event.key === "Escape") closeCategoryDropdown(); });
document.addEventListener("click", event => { if (!event.target.closest(".category-combobox")) closeCategoryDropdown(); });
document.addEventListener("mousedown", event => {
  const card = event.target.closest(".quiz-card");
  if (!card || event.button !== 0 || event.target.closest(".card-tool")) return;
  mouseQuizDrag = { id: card.dataset.id, card, startX: event.clientX, startY: event.clientY, target: null, active: false };
  event.preventDefault();
});
document.addEventListener("mousemove", event => {
  if (!mouseQuizDrag) return;
  if (!mouseQuizDrag.active && Math.hypot(event.clientX - mouseQuizDrag.startX, event.clientY - mouseQuizDrag.startY) > 8) {
    mouseQuizDrag.active = true;
    draggingQuizId = mouseQuizDrag.id;
    suppressCardClick = true;
    showQuizDragTargets(mouseQuizDrag.card);
  }
  if (!mouseQuizDrag.active) return;
  event.preventDefault();
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".category-tab");
  $$(".category-tab").forEach(tab => tab.classList.remove("drag-over"));
  mouseQuizDrag.target = target && Number(target.dataset.categoryIndex) !== 0 ? target : null;
  mouseQuizDrag.target?.classList.add("drag-over");
});
document.addEventListener("mouseup", event => {
  if (!mouseQuizDrag) return;
  const completedDrag = mouseQuizDrag;
  mouseQuizDrag = null;
  if (!completedDrag.active) return;
  event.preventDefault();
  const categoryIndex = Number(completedDrag.target?.dataset.categoryIndex);
  if (completedDrag.target && categoryIndex > 0) {
    moveQuizToCategory(completedDrag.id, getCategories()[categoryIndex - 1]);
  } else {
    cleanupQuizDrag();
    setTimeout(() => { suppressCardClick = false; }, 0);
  }
});
$("#quizForm").addEventListener("submit", saveCreatedQuiz);

// ── Export / Import ───────────────────────────────────────────────────────────
function exportData() {
  const data = {
    version: 1,
    exported: new Date().toISOString(),
    quizzes:       JSON.parse(localStorage.getItem(STORAGE_KEY)               || "[]"),
    categories:    JSON.parse(localStorage.getItem(CATEGORIES_STORAGE_KEY)    || "[]"),
    soundMessages: JSON.parse(localStorage.getItem(SOUND_MESSAGES_STORAGE_KEY)|| "null"),
    dailyWords:    JSON.parse(localStorage.getItem(DAILY_WORDS_STORAGE_KEY)   || "null"),
    autoAdvance:   localStorage.getItem(AUTO_ADVANCE_STORAGE_KEY),
    theme:         localStorage.getItem(THEME_STORAGE_KEY)
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `bright-english-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  event.target.value = "";
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data.quizzes)) throw new Error("bad format");
      const count = data.quizzes.length;
      if (!confirm(`Importować ${count} ${count === 1 ? "test" : "testów"}?\nIstniejące dane zostaną zastąpione.`)) return;
      if (Array.isArray(data.quizzes))       localStorage.setItem(STORAGE_KEY,                JSON.stringify(data.quizzes));
      if (Array.isArray(data.categories))    localStorage.setItem(CATEGORIES_STORAGE_KEY,     JSON.stringify(data.categories));
      if (data.soundMessages)                localStorage.setItem(SOUND_MESSAGES_STORAGE_KEY, JSON.stringify(data.soundMessages));
      if (data.dailyWords)                   localStorage.setItem(DAILY_WORDS_STORAGE_KEY,    JSON.stringify(data.dailyWords));
      if (data.autoAdvance != null)          localStorage.setItem(AUTO_ADVANCE_STORAGE_KEY,   data.autoAdvance);
      if (data.theme)                        localStorage.setItem(THEME_STORAGE_KEY,          data.theme);
      location.reload();
    } catch {
      alert("Błąd: nie udało się wczytać pliku.\nUpewnij się, że to plik eksportu z Bright English.");
    }
  };
  reader.readAsText(file);
}

function mergeQuizzes(event) {
  const file = event.target.files[0];
  if (!file) return;
  event.target.value = "";
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      const incoming = Array.isArray(data) ? data : Array.isArray(data.quizzes) ? data.quizzes : null;
      if (!incoming || !incoming.length) throw new Error("no quizzes");
      const existingIds = new Set(quizzes.map(q => q.id));
      let added = 0;
      incoming.forEach(q => {
        if (!q.id || !q.title || !Array.isArray(q.questions)) return;
        if (existingIds.has(q.id)) return;
        quizzes.unshift(q);
        const cat = q.category || "Angielski";
        if (!customCategories.some(c => c.localeCompare(cat, "pl", { sensitivity: "base" }) === 0)) customCategories.push(cat);
        added++;
      });
      if (added > 0) {
        saveQuizzes(); saveCategories(); renderQuizGrid();
        const lbl = added === 1 ? "test" : added < 5 ? "testy" : "testów";
        showToast(`Dodano ${added} nowe ${lbl} do biblioteki`);
      } else {
        showToast("Wszystkie testy już istnieją w bibliotece");
      }
    } catch {
      showToast("Błąd: nie udało się wczytać pliku z testami");
    }
  };
  reader.readAsText(file);
}

$("#exportData").addEventListener("click", exportData);
$("#importDataFile").addEventListener("change", importData);
$("#mergeQuizzesFile").addEventListener("change", mergeQuizzes);
$("#toggleDataPanel").addEventListener("click", event => {
  event.stopPropagation();
  const panel = $("#dataActionsPanel");
  const btn = $("#toggleDataPanel");
  const open = panel.hidden;
  panel.hidden = !open;
  btn.setAttribute("aria-expanded", String(open));
  btn.classList.toggle("data-toggle-open", open);
});
document.addEventListener("click", event => {
  if (!event.target.closest(".data-actions-wrap")) {
    const panel = $("#dataActionsPanel");
    if (panel && !panel.hidden) {
      panel.hidden = true;
      const btn = $("#toggleDataPanel");
      btn?.setAttribute("aria-expanded", "false");
      btn?.classList.remove("data-toggle-open");
    }
  }
});
// ─────────────────────────────────────────────────────────────────────────────

// ── Theme switcher ────────────────────────────────────────────────────────────
const THEMES = ["forest","ocean","sunset","lavender","night"];

function applyTheme(theme) {
  THEMES.forEach(t => document.body.classList.remove("theme-" + t));
  if (theme && theme !== "forest") document.body.classList.add("theme-" + theme);
  const paperColor = getComputedStyle(document.documentElement).getPropertyValue("--paper").trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", paperColor || "#f7f4ec");
  $$(".theme-swatch").forEach(s => s.classList.toggle("active", s.dataset.theme === (theme || "forest")));
}

function setTheme(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}

$("#themeToggle").addEventListener("click", event => {
  event.stopPropagation();
  const panel = $("#themePanel");
  panel.hidden = !panel.hidden;
});

$$(".theme-swatch").forEach(swatch => {
  swatch.addEventListener("click", () => {
    setTheme(swatch.dataset.theme);
    $("#themePanel").hidden = true;
  });
});

document.addEventListener("click", event => {
  if (!event.target.closest(".theme-picker-wrap")) $("#themePanel").hidden = true;
});

applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || "forest");
// ─────────────────────────────────────────────────────────────────────────────

updateMusicToggle();
renderRandomDailyWord();
renderQuizGrid();
