import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMI0w36fJINeJ1gYSWKrX6cG-AI2Yx4oM",
  authDomain: "selftestgenerator.firebaseapp.com",
  projectId: "selftestgenerator",
  storageBucket: "selftestgenerator.firebasestorage.app",
  messagingSenderId: "686766106811",
  appId: "1:686766106811:web:7c5dd5654c3f8b828ea19e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let currentUser = null;

function quizzesRef(uid) {
  return collection(db, "users", uid, "quizzes");
}

async function loadCloudQuizzes(uid) {
  const q = query(quizzesRef(uid), orderBy("savedAt", "asc"));
  const snap = await getDocs(q).catch(() => null);
  if (!snap) return null;
  return snap.docs.map(d => d.data());
}

async function saveQuizToCloud(uid, quiz) {
  const ref = doc(quizzesRef(uid), quiz.id);
  await setDoc(ref, { ...quiz, savedAt: Date.now() });
}

async function deleteQuizFromCloud(uid, quizId) {
  await deleteDoc(doc(quizzesRef(uid), quizId));
}

async function saveAllQuizzesToCloud(uid, quizzes) {
  const batch = writeBatch(db);
  quizzes.forEach(quiz => {
    batch.set(doc(quizzesRef(uid), quiz.id), { ...quiz, savedAt: Date.now() });
  });
  await batch.commit();
}

async function replaceAllQuizzesInCloud(uid, quizzes) {
  const snap = await getDocs(quizzesRef(uid));
  await Promise.all(snap.docs.map(item => deleteDoc(item.ref)));
  await saveAllQuizzesToCloud(uid, quizzes);
}

function updateUI(user) {
  const loginBtn   = document.getElementById("loginButton");
  const userInfo   = document.getElementById("userInfo");
  const userAvatar = document.getElementById("userAvatar");
  const userName   = document.getElementById("userName");

  if (user) {
    loginBtn.hidden = true;
    userInfo.hidden = false;
    if (user.photoURL) { userAvatar.src = user.photoURL; userAvatar.hidden = false; }
    else userAvatar.hidden = true;
    userName.textContent = user.displayName || user.email || "Użytkownik";
  } else {
    loginBtn.hidden = false;
    userInfo.hidden = true;
  }
}

onAuthStateChanged(auth, async user => {
  currentUser = user;
  updateUI(user);
  if (user) {
    const cloudQuizzes = await loadCloudQuizzes(user.uid);
    if (cloudQuizzes && cloudQuizzes.length > 0) {
      window.__firebaseCloudQuizzes = cloudQuizzes;
      if (typeof window.__onCloudQuizzesLoaded === "function") {
        window.__onCloudQuizzesLoaded(cloudQuizzes);
      }
    } else {
      // pierwsze logowanie — wyślij lokalne testy do chmury
      window.__firebaseFirstSync = true;
      if (typeof window.__onCloudQuizzesLoaded === "function") {
        window.__onCloudQuizzesLoaded(null);
      }
    }
  }
});

const loginButton = document.getElementById("loginButton");
let authToastTimer = null;

function showAuthStatus(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  clearTimeout(authToastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  authToastTimer = setTimeout(() => toast.classList.remove("show"), 5000);
}

function setLoginPending(pending) {
  loginButton.disabled = pending;
  loginButton.setAttribute("aria-busy", String(pending));
  loginButton.textContent = pending ? "Łączenie…" : "🔒 Zaloguj się";
}

function handleLoginError(error) {
  if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") {
    showAuthStatus("Logowanie anulowane");
  } else if (error.code === "auth/unauthorized-domain") {
    showAuthStatus(`Logowanie nie jest dozwolone dla adresu ${location.hostname}. Dodaj go w Firebase Authentication → Authorized domains.`);
  } else if (error.code === "auth/popup-blocked") {
    showAuthStatus("Przeglądarka zablokowała okno logowania. Zezwól na wyskakujące okna i spróbuj ponownie.");
  } else {
    showAuthStatus("Nie udało się rozpocząć logowania. Spróbuj ponownie.");
    console.error("Firebase sign-in failed", error);
  }
  setLoginPending(false);
}

function startGoogleSignIn(useRedirect = false) {
  setLoginPending(true);
  showAuthStatus(useRedirect ? "Przekierowuję do logowania Google…" : "Otwieram logowanie Google…");
  const operation = useRedirect ? signInWithRedirect(auth, provider) : signInWithPopup(auth, provider);
  operation.catch(handleLoginError).finally(() => {
    if (!useRedirect) setLoginPending(false);
  });
}

loginButton.addEventListener("click", () => {
  if (location.hostname === "127.0.0.1") {
    const canonicalUrl = new URL(location.href);
    canonicalUrl.hostname = "localhost";
    canonicalUrl.searchParams.set("continueGoogleSignIn", "1");
    setLoginPending(true);
    showAuthStatus("Przełączam na adres obsługujący logowanie Google…");
    setTimeout(() => location.replace(canonicalUrl.href), 350);
    return;
  }
  startGoogleSignIn();
});

const currentUrl = new URL(location.href);
if (currentUrl.searchParams.get("continueGoogleSignIn") === "1") {
  currentUrl.searchParams.delete("continueGoogleSignIn");
  history.replaceState(null, "", currentUrl.href);
  startGoogleSignIn(true);
}

document.getElementById("logoutButton").addEventListener("click", () => {
  signOut(auth);
});

window.firebaseDB = {
  saveQuiz:      (quiz)         => currentUser ? saveQuizToCloud(currentUser.uid, quiz) : Promise.resolve(),
  deleteQuiz:    (id)           => currentUser ? deleteQuizFromCloud(currentUser.uid, id) : Promise.resolve(),
  saveAllQuizzes:(quizzes)      => currentUser ? saveAllQuizzesToCloud(currentUser.uid, quizzes) : Promise.resolve(),
  replaceAllQuizzes:(quizzes)   => currentUser ? replaceAllQuizzesInCloud(currentUser.uid, quizzes) : Promise.resolve(),
  getCurrentUser: ()            => currentUser
};
