import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAI, GoogleAIBackend } from "firebase/ai";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY;

export let ai = null;
export let setupError = null;

const isMissingConfig = Object.values(firebaseConfig).some((value) => !value) || !recaptchaSiteKey;

if (isMissingConfig) {
    setupError = "Completa la configuración web de Firebase y App Check para habilitar Gemini.";
} else {
    try {

        if (import.meta.env.DEV) {
            self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
        }

        const app = initializeApp(firebaseConfig);
        initializeAppCheck(app, {
            provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
            isTokenAutoRefreshEnabled: true,
        });


        ai = getAI(app, { backend: new GoogleAIBackend() });

    } catch (error) {
        console.error("Error inicializando Firebase:", error);
        setupError = "No se pudo inicializar Firebase AI Logic. Revisa App Check y el .env.";
    }
}