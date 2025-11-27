// =======================================================
// 🔐 validacao.js — Autenticação do Login (versão final)
// =======================================================

import api from "./api.js";

console.log("🟦 Módulo de validação carregado!");

const validacao = {

  // =====================================================
  // 🔰 Inicialização do Login
  // =====================================================
  init() {
    console.log("🔐 validacao.init() executado!");

    const form = document.getElementById("loginForm");
    const inputLogin = document.getElementById("email");
    const inputSenha = document.getElementById("senha");

    if (!form || !inputLogin || !inputSenha) {
      console.error("❌ Formulário de login não encontrado.");
      return;
    }

    // Limpa campos ao abrir o login
    inputLogin.value = "";
    inputSenha.value = "";

    // Evento de login
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const login = inputLogin.value.trim();
      const senha = inputSenha.value.trim();

      if (!login || !senha) {
        alert("⚠️ Preencha todos os campos!");
        return;
      }

      try {
        console.log("📤 Autenticando usuário pela API...");

        // 🚀 Agora usa a API CENTRALIZADA
        const resposta = await api.autenticarUsuario(login, senha);

        // ================================
        //   ❌ Falha no login
        // ================================
        if (!resposta || !resposta.usuario) {
          alert("🚫 Usuário ou senha incorretos!");
          return;
        }

        // ================================
        //   ✅ Login OK
        // ================================
        console.log("✅ Login bem-sucedido!", resposta.usuario);

        // ✔ Salva o usuário COMPLETO no localStorage (SEM ALTERAR)
        localStorage.setItem(
          "usuarioLogado",
          JSON.stringify(resposta.usuario)
        );

        // ⭐⭐⭐⭐⭐ ADIÇÃO CIRÚRGICA (SAUDAÇÃO)
        // 👉 Salva somente o e-mail para exibir na saudação
        localStorage.setItem("emailLogado", login);
        // ⭐⭐⭐⭐⭐ FIM DA ADIÇÃO — NADA MAIS FOI ALTERADO

        // ✔ Redireciona pro Painel Administrativo
        window.location.href = "./public/pages/painel.html";

      } catch (erro) {
        console.error("❌ Erro ao autenticar:", erro);
        alert("❌ Falha ao conectar com a API. Verifique o servidor.");
      }
    });
  },

  // ======================================================
  // 🚪 LOGOUT
  // ======================================================
  encerrarSessao() {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("emailLogado"); // ← mantém limpo
    console.log("🚪 Sessão encerrada.");
    window.location.href = "../index.html";
  }
};

// =======================================================
// 📤 EXPORTAÇÃO DO MÓDULO
// =======================================================
export default validacao;
