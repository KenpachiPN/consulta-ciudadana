import { initAuthUI } from "./ui/authUI.js";
import { initChatUI } from "./ui/chatUI.js";
import { initSearchUI } from "./ui/searchUI.js";

initAuthUI();
const { openChatPanel } = initChatUI();
initSearchUI(openChatPanel);