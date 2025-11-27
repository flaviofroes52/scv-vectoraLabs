// =======================================================
// 🔐 scripts-login.js — Tela de Login
// =======================================================

import validacao from "./modules/validacao.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("🔵 Tela de Login carregada — iniciando validação...");
  validacao.init();
});


// =======================================================
// 🟦 scripts-painel.js — Painel Administrativo
// =======================================================

import mosaico from "./modules/paineladm.js";
import operacoes from "./modules/operacoes.js";

// Só roda se ESTIVER no painel administrativo
if (document.body.classList.contains("bodyMenu")) {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("🟢 Painel Administrativo iniciado...");

    mosaico.init();
    operacoes.init();
  });
}


// =======================================================
// 🧾 scripts-cadastros.js — Painel de Cadastros
// =======================================================

import { initPainelCads } from "./modules/painelcads.js";
import "./modules/motoristas.js";
import { initCadVeiculos } from "./modules/cadveiculos.js";
import { initUsuarios } from "./modules/cadsusuarios.js";

// Só roda se estiver na página de CADASTROS
if (document.body.classList.contains("painelcads")) {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("📄 Painel de Cadastros iniciado...");

    initPainelCads();
    initCadVeiculos();
    initUsuarios();
  });
}


// =======================================================
// 📊 scripts-dashboard.js — Dashboard
// =======================================================

import "./modules/main.js";
import { carregarSaudacao } from "./modules/authDashboard.js";

document.addEventListener("DOMContentLoaded", () => {
  carregarSaudacao();
});

// Botão Painel Administrativo
const btnPainAdm = document.getElementById("painAdm");
if (btnPainAdm) {
  btnPainAdm.addEventListener("click", () => {
    window.location.href = "/public/pages/painel.html";
  });
}

// ======================================================
// ⛔ FINALIZAR SISTEMA — Voltar ao Login (index.html)
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  const btnFinal = document.getElementById("btnFinalizarSistema");

  if (btnFinal) {
    btnFinal.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      localStorage.removeItem("operacoesAtivas");
      window.location.href = "/index.html";
    });
  }
});

// ======================================================
// 📅 FOOTER — Atualiza Ano Automaticamente
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  const anoFooter = document.getElementById("anoFooter");
  if (anoFooter) {
    anoFooter.textContent = new Date().getFullYear();
  }
});
