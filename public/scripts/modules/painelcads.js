// =======================================================
// 🧾 painelcads.js — Controle do Mosaico de Cadastros
// =======================================================

export function initPainelCads() {
  console.log("📄 Painel de Cadastros iniciado...");

  // Elementos principais
  const titulo = document.querySelector("h1");
  const mosaico = document.querySelector(".cadmosaico");

  // Motoristas
  const cardMotoristas = document.getElementById("cadMotoristas");
  const btnMotoristas = document.getElementById("btMotoristas");
  const btnSairMotorista = document.querySelector(".fab-gray");

  // Veículos
  const cadVeiculos = document.getElementById("cadVeiculos");
  const btnVeiculos = document.getElementById("btVeiculos");
  const btnSairVeiculos = document.getElementById("btSairVeiculos");

  // Usuários (modal)
  const btnUsuarios = document.getElementById("btUsuarios");
  const modalUsuarios = document.getElementById("modalUsuarios");
  const btnFecharUsuarios = document.getElementById("btnFecharUsuarios");

  if (!titulo || !mosaico) {
    console.warn("⚠️ Elementos principais não encontrados.");
    return;
  }

  // =====================================================
  // Oculta todos no início
  // =====================================================
  if (cardMotoristas) cardMotoristas.style.display = "none";
  if (cadVeiculos) cadVeiculos.style.display = "none";
  if (modalUsuarios) modalUsuarios.style.display = "none";

  // =====================================================
  // 🧍‍♂️ Abrir Motoristas
  // =====================================================
  if (btnMotoristas) {
    btnMotoristas.addEventListener("click", () => {
      titulo.style.display = "none";
      mosaico.style.display = "none";

      cadVeiculos.style.display = "none";
      modalUsuarios.style.display = "none";

      cardMotoristas.style.display = "block";
    });
  }

  // =====================================================
  // 🚚 Abrir Veículos
  // =====================================================
  if (btnVeiculos) {
    btnVeiculos.addEventListener("click", () => {
      titulo.style.display = "none";
      mosaico.style.display = "none";

      cardMotoristas.style.display = "none";
      modalUsuarios.style.display = "none";

      cadVeiculos.style.display = "block";
    });
  }

  // =====================================================
  // 👤 Abrir Usuários (Modal)
  // =====================================================
  if (btnUsuarios) {
    btnUsuarios.addEventListener("click", () => {
      titulo.style.display = "none";
      mosaico.style.display = "none";

      cardMotoristas.style.display = "none";
      cadVeiculos.style.display = "none";

      modalUsuarios.style.display = "flex";
    });
  }

  // =====================================================
  // ❌ Fechar Modal Usuários
  // =====================================================
  if (btnFecharUsuarios) {
    btnFecharUsuarios.addEventListener("click", () => {
      modalUsuarios.style.display = "none";

      // volta para o mosaico
      titulo.style.display = "block";
      mosaico.style.display = "grid";
    });
  }

  // =====================================================
  // ↩ Voltar de Motoristas
  // =====================================================
  if (btnSairMotorista) {
    btnSairMotorista.addEventListener("click", () => {
      cardMotoristas.style.display = "none";

      titulo.style.display = "block";
      mosaico.style.display = "grid";
    });
  }

  // =====================================================
  // ↩ Voltar de Veículos
  // =====================================================
  if (btnSairVeiculos) {
    btnSairVeiculos.addEventListener("click", () => {
      cadVeiculos.style.display = "none";

      titulo.style.display = "block";
      mosaico.style.display = "grid";
    });
  }

  // =====================================================
  // 🔙 Botão Sair geral (volta ao painel principal)
  // =====================================================
  const btnSairPainel = document.getElementById("btSair");
  if (btnSairPainel) {
    btnSairPainel.addEventListener("click", () => {
      window.location.href = "/public/pages/painel.html";
    });
  }
}
