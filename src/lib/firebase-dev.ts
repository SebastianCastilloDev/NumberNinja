// ==========================================================================
// CONFIGURACIÓN DE FIREBASE PARA DESARROLLO
// Version simplificada para pruebas locales
// ==========================================================================

// Verificar si las variables de entorno están configuradas
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id",
};

// Verificar si estamos en modo demo
const isDemoMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "demo-api-key";

console.log("🔥 Firebase Config Status:", {
  isDemoMode,
  hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: firebaseConfig.projectId,
});

// Solo intentar inicializar Firebase si tenemos credenciales reales
let db: any = null;
let auth: any = null;

if (!isDemoMode) {
  try {
    const { initializeApp } = require("firebase/app");
    const { getFirestore } = require("firebase/firestore");
    const { getAuth } = require("firebase/auth");

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
  }
} else {
  console.log("🧪 Running in demo mode - Firebase disabled");
}

export { db, auth };
export default null;
