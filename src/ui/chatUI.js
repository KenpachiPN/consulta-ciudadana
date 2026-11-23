import { askGemini, getChatStatus } from "../services/geminiService.js";

export function initChatUI() {
    const chatDialog = document.querySelector("#chat-dialog");
    const chatForm = document.querySelector("#chat-form");
    const chatInput = document.querySelector("#chat-input");
    const chatMessages = document.querySelector("#chat-messages");
    const chatSuggestions = document.querySelector("#chat-suggestions");
    const chatStatusNote = document.querySelector("#chat-status-note");
    const chatSendButton = document.querySelector("#chat-send");
    const chatSuggestionButtons = document.querySelectorAll(".chat-suggestion");

    function appendMessage(text, sender, extraClass = "") {
        const bubble = document.createElement("div");
        bubble.className = `chat-message ${sender}-message ${extraClass}`.trim();
        bubble.textContent = text;
        chatMessages.append(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return bubble;
    }

    function setEnabled(enabled) {
        chatInput.disabled = !enabled;
        chatSendButton.disabled = !enabled;
        chatSuggestionButtons.forEach((btn) => {
            btn.disabled = !enabled;
        });
    }

    function openChatPanel() {
        chatDialog?.showModal();
        const status = getChatStatus();
        chatStatusNote.textContent = status.message;
        setEnabled(status.ready);
        if (status.ready) chatInput.focus();
    }

    chatForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const question = chatInput.value.trim();
        if (!question) return;

        appendMessage(question, "user");
        chatInput.value = "";
        chatSuggestions.hidden = true;
        setEnabled(false);

        const pending = appendMessage("Escribiendo...", "assistant", "chat-pending");

        try {
            const reply = await askGemini(question);
            if (!reply?.trim()) throw new Error("Respuesta vacía.");
            pending.remove();
            appendMessage(reply, "assistant");
        } catch (error) {
            console.error("Error en chat:", error);
            pending.textContent = error.message.startsWith("TIMEOUT")
                ? "La consulta tardó demasiado. Revisa tu conexión o el estado de App Check."
                : "No se pudo obtener una respuesta en este momento. Intenta de nuevo.";
            pending.classList.add("chat-error");
        } finally {
            if (chatDialog?.open) {
                setEnabled(true);
                chatInput.focus();
            }
        }
    });

    chatSuggestionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            chatInput.value = button.dataset.prompt;
            chatForm?.requestSubmit();
        });
    });

    document.querySelector("#chat-close")?.addEventListener("click", () => {
        chatDialog?.close();
    });

    return { openChatPanel };
}