// =======================================================
// 🟦 authDashboard.js — Saudação do Painel Administrativo
// =======================================================

export function carregarSaudacao() {
  console.log("🟦 Carregando saudação...");

  // Recupera o email salvo no login
  const emailLogado = localStorage.getItem("emailLogado");

  if (!emailLogado) {
    console.warn("⚠️ Nenhum e-mail encontrado para saudação.");
    return;
  }

  // Determinar período (Bom dia / Boa tarde / Boa noite)
  const h = new Date().getHours();
  let periodo = "Boa noite";
  if (h >= 5 && h < 12) periodo = "Bom dia";
  if (h >= 12 && h < 18) periodo = "Boa tarde";

  // Elemento onde a saudação será exibida
  const saudacaoEl = document.getElementById("usuarioSaudacao");

  if (!saudacaoEl) {
    console.warn("⚠️ Elemento usuarioSaudacao não encontrado.");
    return;
  }

  // Exibir: "Bom dia, email@gmail.com"
  const textoFinal = `${periodo}, ${emailLogado}`;

  saudacaoEl.textContent = textoFinal;
  saudacaoEl.style.display = "block"; // garante que aparece

  console.log("🟦 Saudação exibida:", textoFinal);

  // =======================================================
  // 🕒 NOVO: Saudação desaparece automaticamente após 3s
  // =======================================================
  setTimeout(() => {
    if (saudacaoEl) {
      saudacaoEl.style.opacity = "0";       // efeito fade suave
      saudacaoEl.style.transition = "opacity 0.8s ease";

      setTimeout(() => {
        saudacaoEl.style.display = "none";  // remove de vez
      }, 800);
    }
  }, 1500); // <-- 3 segundos
}
