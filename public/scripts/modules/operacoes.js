// =======================================================
// 🛠️ operacoes.js — Abrir e Fechar Formulário de Operações
// =======================================================

const operacoes = {
  init() {
    console.log("🟦 operacoes.js carregado");

    const btnOperacao = document.getElementById("btnOperacoes"); // botão do mosaico
    const secOperacoes = document.getElementById("operacoes");  // formulário
    const mosaico = document.querySelector(".mosaico");         // mosaico do painel
    const tituloPainel = document.querySelector("h1");          // título "Painel Administrativo"
    const btnSai = document.getElementById("btnSaiOP");         // botão sair do form

    if (!btnOperacao || !secOperacoes) return;

    // 🔵 INICIALMENTE, esconder o formulário
    secOperacoes.style.display = "none";

    // 👉 Abrir formulário de operações
    btnOperacao.addEventListener("click", () => {
      secOperacoes.style.display = "block";
      mosaico.style.display = "none";
      if (tituloPainel) tituloPainel.style.display = "none";

      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // 👉 Botão Sair fecha o formulário
    btnSai.addEventListener("click", () => {
      secOperacoes.style.display = "none";
      mosaico.style.display = "grid";
      if (tituloPainel) tituloPainel.style.display = "block";
    });
  }
};

export default operacoes;
