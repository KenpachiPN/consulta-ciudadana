export function initAuthUI() {
    const loginScreen = document.querySelector("#login-screen");
    const registerScreen = document.querySelector("#register-screen");
    const homeScreen = document.querySelector("#home-screen");
    const loginForm = document.querySelector("#login-form");
    const loginMessage = document.querySelector("#login-message");
    const registerForm = document.querySelector("#register-form");
    const registerMessage = document.querySelector("#register-message");
    const resultsPanel = document.querySelector("#search-results");

    function showHome() {
        loginScreen.hidden = true;
        registerScreen.hidden = true;
        homeScreen.hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function connectPasswordToggle(inputId, buttonId) {
        const input = document.querySelector(inputId);
        const button = document.querySelector(buttonId);
        if (!input || !button) return;

        button.addEventListener("click", () => {
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            button.setAttribute("aria-label", isPassword ? "Ocultar contraseña" : "Mostrar contraseña");
        });
    }

    connectPasswordToggle("#password", "#toggle-password");
    connectPasswordToggle("#register-password", "#toggle-register-password");

    loginForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!loginForm.reportValidity()) return;
        showHome();
    });

    document.querySelector("#continue-guest")?.addEventListener("click", showHome);

    document.querySelector("#show-register")?.addEventListener("click", () => {
        loginScreen.hidden = true;
        registerScreen.hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.querySelector("#register-name")?.focus({ preventScroll: true });
    });

    document.querySelector("#back-to-login")?.addEventListener("click", () => {
        registerScreen.hidden = true;
        loginScreen.hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.querySelector("#email")?.focus({ preventScroll: true });
    });

    registerForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!registerForm.reportValidity()) return;
        registerMessage.textContent = "El registro aún no está habilitado en este prototipo.";
    });

    document.querySelector("#forgot-password")?.addEventListener("click", () => {
        loginMessage.textContent = "La recuperación de contraseña no está disponible en este prototipo.";
    });

    document.querySelector("#sign-out")?.addEventListener("click", () => {
        homeScreen.hidden = true;
        loginScreen.hidden = false;
        if (resultsPanel) resultsPanel.hidden = true;
        loginMessage.textContent = "";
        loginForm?.reset();
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.querySelector("#email")?.focus({ preventScroll: true });
    });
}