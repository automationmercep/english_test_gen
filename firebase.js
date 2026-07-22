import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
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

document.getElementById("loginButton").addEventListener("click", () => {
  signInWithPopup(auth, provider).catch(err => {
    if (err.code !== "auth/popup-closed-by-user") {
      alert("Błąd logowania: " + err.message);
    }
  });
});

document.getElementById("logoutButton").addEventListener("click", () => {
  signOut(auth);
});

window.firebaseDB = {
  saveQuiz:      (quiz)         => currentUser ? saveQuizToCloud(currentUser.uid, quiz) : Promise.resolve(),
  deleteQuiz:    (id)           => currentUser ? deleteQuizFromCloud(currentUser.uid, id) : Promise.resolve(),
  saveAllQuizzes:(quizzes)      => currentUser ? saveAllQuizzesToCloud(currentUser.uid, quizzes) : Promise.resolve(),
  getCurrentUser: ()            => currentUser
};
