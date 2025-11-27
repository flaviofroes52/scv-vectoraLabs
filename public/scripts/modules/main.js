/// =======================================================
// 🧭 main.js — Somente DOM + Inicialização da UI
// 🚫 Não consome API
// 🚫 Não faz operações
// 🚫 Não atualiza dashboard
// =======================================================

import ui from "./ui.js";

// =======================================================
// 🟦 OBJETO MAIN — CONTROLADOR DE TELA
// =======================================================
const main = {

  // ----------------------------------------------------
  // 🟩 Inicialização geral da página
  // ----------------------------------------------------
  async init() {
    console.log("🟦 main.js carregado…");

    // UI controla toda lógica e dados
    await ui.init();

    // Configura botões do painel administrativo
    this.configurarMosaico();
  },

  // ----------------------------------------------------
  // 🟩 Controlar navegação do mosaico
  // ----------------------------------------------------
  configurarMosaico() {
    const btnOperacoes = document.getElementById("btnOperacoes");
    const btnDashboard = document.querySelector(".btn.dashboard");
    const btnFrota = document.querySelector(".btn.frota");
    const btnCadastros = document.querySelector(".btn.cadastros");
    const btnStatus = document.querySelector(".btn.status");
    const btnConfig = document.querySelector(".btn.configuracoes");

    // -------------------------------
    // 🔵 Botão OPERAÇÕES (abre o form)
    // -------------------------------
    if (btnOperacoes) {
      btnOperacoes.addEventListener("click", () => {
        const sec = document.getElementById("operacoes");
        const mosaico = document.querySelector(".mosaico");
        const titulo = document.querySelector("h1");

        if (sec && mosaico) {
          sec.style.display = "block";
          mosaico.style.display = "none";
          if (titulo) titulo.style.display = "none";

          window.scrollTo({ top: 0, behavior: "smooth" });
        }

        // ⭐⭐⭐ IMPORTANTÍSSIMO ⭐⭐⭐
        // → sem isso, os campos do formulário não funcionam
        ui.initOperacoes();
      });
    }

    // -------------------------------
    // 🔵 Botão DASHBOARD
    // -------------------------------
    if (btnDashboard) {
      btnDashboard.addEventListener("click", () => {
        window.location.href = "/public/pages/dashboard.html";
      });
    }

    // -------------------------------
    // 🔵 Botão FROTA
    // -------------------------------
    if (btnFrota) {
      btnFrota.addEventListener("click", () => {
        window.location.href = "/public/pages/frota.html";
      });
    }

    // -------------------------------
    // 🔵 Botão CADASTROS
    // -------------------------------
    if (btnCadastros) {
      btnCadastros.addEventListener("click", () => {

        // 🔥🔥🔥 LINHA REMOVIDA AQUI
        // window.location.href = "/public/pages/cadastros.html";

        // Painel correto dos cadastros
        window.location.href = "/public/pages/painelcadastros.html";
      });
    }

    // -------------------------------
    // 🔵 Botão STATUS
    // -------------------------------
    if (btnStatus) {
      btnStatus.addEventListener("click", () => {
        window.location.href = "/public/pages/status.html";
      });
    }

    // -------------------------------
    // 🔵 Botão CONFIGURAÇÕES
    // -------------------------------
    if (btnConfig) {
      btnConfig.addEventListener("click", () => {
        window.location.href = "/public/pages/config.html";
      });
    }
  },
};

// =======================================================
// 🚀 Ativar automaticamente quando a página carregar
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  main.init();
});

export default main;
