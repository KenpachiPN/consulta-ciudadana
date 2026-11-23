import { getGenerativeModel } from "firebase/ai";
import { ai, setupError } from "../config/firebase.js";

const PRIMARY_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-3.5-flash-lite";
const FALLBACK_MODEL = "gemini-3.7-flash";
const REQUEST_TIMEOUT_MS = 30000;

const SYSTEM_INSTRUCTION =
    "Eres un asistente informativo para un prototipo de consulta ciudadana de trámites de tránsito en colombia. Responde en español, de forma clara y breve. No tienes acceso a fuentes oficiales: no inventes requisitos, costos, plazos ni enlaces. Explica que la información depende de la entidad competente y recomienda confirmarla en sus canales oficiales. No solicites datos personales ni información identificable del vehículo.";

let chatSession = null;

function createSession(modelName) {
    if (!ai) return null;
    const model = getGenerativeModel(ai, {
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
    });
    return model.startChat({
        generationConfig: { maxOutputTokens: 500, temperature: 0.4 },
    });
}

if (ai) {
    chatSession = createSession(PRIMARY_MODEL);
}

export function getChatStatus() {
    return {
        ready: Boolean(chatSession),
        message: setupError || "Tus preguntas se enviarán a Gemini. No compartas información personal.",
    };
}

function withTimeout(promise, ms) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("TIMEOUT: La petición tardó demasiado (revisa App Check o tu red).")), ms)
        ),
    ]);
}

export async function askGemini(question) {
    if (!chatSession) {
        throw new Error(setupError || "El servicio de chat no está disponible.");
    }

    try {
        const result = await withTimeout(chatSession.sendMessage(question), REQUEST_TIMEOUT_MS);
        return result.response.text();
    } catch (error) {
        const shouldSwitchModel =
            error?.message?.includes("500") ||
            error?.message?.includes("503") ||
            error?.message?.includes("429") ||
            error?.message?.includes("high demand") ||
            error?.message?.includes("Quota exceeded");

        if (shouldSwitchModel && PRIMARY_MODEL !== FALLBACK_MODEL) {
            const backup = createSession(FALLBACK_MODEL);
            if (backup) {
                chatSession = backup;
                const retry = await withTimeout(chatSession.sendMessage(question), REQUEST_TIMEOUT_MS);
                return retry.response.text();
            }
        }
        throw error;
    }
}