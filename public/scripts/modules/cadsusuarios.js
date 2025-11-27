/// =======================================================
// 👤 cadsusuarios.js — Cadastro Completo de Usuários (SCV)
// =======================================================

import api from "./api.js";

export function initUsuarios() {
  console.log("🟦 Módulo de usuários carregado.");

  // -------------------------------------------------------
  // 🔗 Seleção dos elementos do DOM
  // -------------------------------------------------------
  const titulo = document.querySelector("h1");
  const mosaico = document.querySelector(".cadmosaico");

  const modalUsuarios = document.getElementById("modalUsuarios");
  const btnUsuarios = document.getElementById("btUsuarios");
  const btnFecharUsuarios = document.getElementById("btnFecharUsuarios");

  const formUsuarios = document.getElementById("formUsuarios");

  const selectAlterar = document.getElementById("selectUsuariosAlterar");
  const selectExcluir = document.getElementById("selectUsuarios");

  const btnIncluir = document.getElementById("btnIncluirUsuario");
  const btnAlterarSenha = document.getElementById("btnAlterarSenha");
  const btnExcluirUsuario = document.getElementById("btnExcluirUsuario");

  const inputLogin = document.getElementById("login");
  const inputSenha = document.getElementById("senha");
  const inputNovaSenha = document.getElementById("novaSenha");

  if (!modalUsuarios || !btnUsuarios) {
    console.warn("⚠️ Módulo de usuários não pôde ser inicializado.");
    return;
  }

  // -------------------------------------------------------
  // 🧩 Função auxiliar para atualizar selects
  // -------------------------------------------------------
  async function atualizarSelects() {
    const usuarios = await api.listarUsuarios();

    // LIMPA os selects
    selectAlterar.innerHTML =
      `<option value="">Selecione um usuário para alterar</option>`;
    selectExcluir.innerHTML =
      `<option value="">Selecione um usuário para excluir</option>`;

    usuarios.forEach((u) => {
      selectAlterar.innerHTML += `<option value="${u._id}">${u.login}</option>`;
      selectExcluir.innerHTML += `<option value="${u._id}">${u.login}</option>`;
    });
  }

  // -------------------------------------------------------
  // 🟦 ABRIR modal
  // -------------------------------------------------------
  btnUsuarios.addEventListener("click", async () => {
    console.log("👤 Abrindo cadastro de usuários...");

    titulo.style.display = "none";
    mosaico.style.display = "none";

    modalUsuarios.style.display = "flex";

    await atualizarSelects(); // carrega usuários ao abrir
  });

  // -------------------------------------------------------
  // 🔴 FECHAR modal
  // -------------------------------------------------------
  btnFecharUsuarios.addEventListener("click", () => {
    modalUsuarios.style.display = "none";

    titulo.style.display = "block";
    mosaico.style.display = "grid";
  });

  // -------------------------------------------------------
  // 🟢 INCLUIR USUÁRIO (POST)
  // -------------------------------------------------------
  btnIncluir.addEventListener("click", async (e) => {
    e.preventDefault();

    const login = inputLogin.value.trim();
    const senha = inputSenha.value.trim();

    if (!login || !senha) {
      alert("Preencha login e senha.");
      return;
    }

    try {
      const resp = await api.registrarUsuario(login, senha);
      alert("Usuário cadastrado com sucesso!");

      inputLogin.value = "";
      inputSenha.value = "";

      atualizarSelects();
    } catch (err) {
      alert(err.message);
    }
  });

  // -------------------------------------------------------
  // 🟡 ALTERAR SENHA (PUT)
  // -------------------------------------------------------
  btnAlterarSenha.addEventListener("click", async () => {
    const id = selectAlterar.value;
    const novaSenha = inputNovaSenha.value.trim();

    if (!id) return alert("Selecione um usuário para alterar.");
    if (!novaSenha) return alert("Digite a nova senha.");

    try {
      await api.atualizarUsuario(id, { senha: novaSenha });
      alert("Senha alterada com sucesso!");

      inputNovaSenha.value = "";
      atualizarSelects();
    } catch (err) {
      alert(err.message);
    }
  });

  // -------------------------------------------------------
  // 🔴 EXCLUIR USUÁRIO (DELETE)
  // -------------------------------------------------------
  btnExcluirUsuario.addEventListener("click", async () => {
    const id = selectExcluir.value;

    if (!id) return alert("Selecione um usuário para excluir.");

    if (!confirm("Deseja realmente excluir este usuário?")) return;

    try {
      await api.excluirUsuario(id);
      alert("Usuário excluído!");

      atualizarSelects();
    } catch (err) {
      alert(err.message);
    }
  });
}
