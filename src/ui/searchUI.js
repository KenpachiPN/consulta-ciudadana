export function initSearchUI(openChatPanel) {
    const resultsPanel = document.querySelector("#search-results");
    const searchForm = document.querySelector("#search-form");
    const searchInput = document.querySelector("#search-input");
    const infoDialog = document.querySelector("#info-dialog");

    function showSearchResult(query) {
        const searchTerm = query.trim();
        if (!searchTerm) {
            resultsPanel.hidden = true;
            searchInput.focus();
            return;
        }

        const title = document.createElement("h2");
        title.textContent = `Consulta: ${searchTerm}`;
        const description = document.createElement("p");
        description.textContent =
            "Este prototipo no contiene información oficial de trámites. Los requisitos, documentos, costos, pasos y entidades responsables están pendientes de confirmación.";
        const tags = document.createElement("div");
        tags.className = "result-tags";

        ["Requisitos", "Documentos", "Costos", "Pasos", "Entidad responsable"].forEach((label) => {
            const tag = document.createElement("span");
            tag.className = "result-tag";
            tag.textContent = label;
            tags.append(tag);
        });

        resultsPanel.replaceChildren(title, description, tags);
        resultsPanel.hidden = false;
        resultsPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    searchForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        showSearchResult(searchInput.value);
    });

    document.querySelectorAll(".category-action").forEach((button) => {
        button.addEventListener("click", () => infoDialog?.showModal());
    });

    document.querySelectorAll(".quick-action").forEach((button) => {
        button.addEventListener("click", () => {
            if (button.dataset.topic === "Preguntas frecuentes") {
                openChatPanel();
                return;
            }
            infoDialog?.showModal();
        });
    });

    document.querySelector("#dialog-close")?.addEventListener("click", () => {
        infoDialog?.close();
    });
}