// =====================================================================
// 🎛️ módulos/mosaico.js — Controle dos botões do mosaico do painel
// =====================================================================

const mosaico = {

  // 🔥 GUARDA o display original do botão Finalizar Sistema
  _displayOriginalFinalizar: null,

  // ------------------------------------------------------------
  // 🔵 Esconder mosaico + botão finalizar
  // ------------------------------------------------------------
  esconderMosaico() {
    const area = document.querySelector(".mosaico");
    const btnFinalizar = document.getElementById("btnFinalizarSistema");

    if (area) area.style.display = "none";

    if (btnFinalizar) {

      // salva display original apenas 1 vez
      if (!this._displayOriginalFinalizar) {
        this._displayOriginalFinalizar =
          btnFinalizar.style.display ||
          window.getComputedStyle(btnFinalizar).display;
      }

      btnFinalizar.style.display = "none";
    }
  },

  // ------------------------------------------------------------
  // 🔵 Mostrar mosaico + restaurar botão finalizar
  // ------------------------------------------------------------
  mostrarMosaico() {
    const area = document.querySelector(".mosaico");
    const btnFinalizar = document.getElementById("btnFinalizarSistema");

    if (area) area.style.display = "grid";  // padrão do mosaico

    if (btnFinalizar) {
      btnFinalizar.style.display =
        this._displayOriginalFinalizar || "flex";
    }
  },

  // ------------------------------------------------------------
  // 🔵 Inicialização dos botões
  // ------------------------------------------------------------
  init() {

    // ---------------------------------------------------
    // BOTÃO: Cadastros
    // ---------------------------------------------------
    const btnCadastros = document.querySelector(".btn.cadastros");
    if (btnCadastros) {
      btnCadastros.addEventListener("click", () => {
        this.esconderMosaico(); // 👈 agora esconde
        window.location.href = "/public/pages/painelcadastros.html";
      });
    }

    // ---------------------------------------------------
    // BOTÃO: Dashboard
    // ---------------------------------------------------
    const btnDashboard = document.querySelector(".btn.dashboard");
    if (btnDashboard) {
      btnDashboard.addEventListener("click", () => {

        const footer = document.getElementById("footerVetora");
        if (footer) footer.style.display = "none";

        window.location.href = "/public/pages/dashboard.html";
      });
    }

    // ---------------------------------------------------
    // BOTÕES INTERNOS QUE ESCONDEM O MOSAICO
    // ---------------------------------------------------

    // Operação
    const btnOperacao = document.querySelector(".btn.operacao");
    if (btnOperacao) {
      btnOperacao.addEventListener("click", () => {
        this.esconderMosaico();

        const sec = document.getElementById("operacoes");
        if (sec) sec.style.display = "block";
      });
    }

    // Frota
    const btnFrota = document.querySelector(".btn.frota");
    if (btnFrota) {
      btnFrota.addEventListener("click", () => {
        this.esconderMosaico();
        console.log("👉 Botão Frota clicado.");
      });
    }

    // Status
    const btnStatus = document.querySelector(".btn.status");
    if (btnStatus) {
      btnStatus.addEventListener("click", () => {
        this.esconderMosaico();
        console.log("👉 Botão Status clicado.");
      });
    }

    // Configurações
    const btnConfiguracoes = document.querySelector(".btn.configuracoes");
    if (btnConfiguracoes) {
      btnConfiguracoes.addEventListener("click", () => {
        this.esconderMosaico();
        console.log("👉 Botão Configurações clicado.");
      });
    }

    // ---------------------------------------------------
    // BOTÃO SAIR DO FORMULÁRIO DE OPERAÇÕES
    // ---------------------------------------------------
    const btnSaiOP = document.getElementById("btnSaiOP");
    if (btnSaiOP) {
      btnSaiOP.addEventListener("click", () => {

        const sec = document.getElementById("operacoes");
        if (sec) sec.style.display = "none";

        this.mostrarMosaico(); // ✔ volta tudo
      });
    }

    // ---------------------------------------------------
    // BOTÃO FINALIZAR SISTEMA
    // ---------------------------------------------------
    const btnFinalizar = document.getElementById("btnFinalizarSistema");
    if (btnFinalizar) {

      // guarda display original na inicialização também
      if (!this._displayOriginalFinalizar) {
        this._displayOriginalFinalizar =
          btnFinalizar.style.display ||
          window.getComputedStyle(btnFinalizar).display;
      }

      btnFinalizar.addEventListener("click", () => {
        window.location.href = "./pu; // volta ao login
      });
    }
  }
};

// EXPORTAÇÃO MODULAR
export default mosaico;
