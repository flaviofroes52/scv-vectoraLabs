// =======================================================
// 👨‍✈️ motoristas.js — Integração total com api.js (CORRIGIDO FINAL)
// =======================================================

import api from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("🟢 Script de motoristas carregado.");

  // =====================================================
  // 🔗 Seleção dos elementos
  // =====================================================
  const nome = document.querySelector("#nome");
  const cpf = document.querySelector("#cpf");
  const telefone = document.querySelector("#telefone");
  const cnh = document.querySelector("#habilitacao");   // ⭐ corrigido
  const categoria = document.querySelector("#categoria");
  const infoAdicionais = document.querySelector(".textarea");
  const selectMotoristas = document.querySelector(".sel");

  const inputFoto = document.querySelector("#inputFoto");
  const previewFoto = document.querySelector("#previewFoto");

  const btnIncluir = document.querySelector(".fab-blue");
  const btnAlterar   = document.querySelector(".fab-yellow");
  const btnExcluir   = document.querySelector(".fab-red");
  const btnSair      = document.querySelector(".fab-gray");

  let imagemBase64 = "";

  // =====================================================
  // 🖼️ Preview da imagem
  // =====================================================
  inputFoto.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      imagemBase64 = reader.result;
      previewFoto.src = imagemBase64;
    };
    reader.readAsDataURL(file);
  });

  // =====================================================
  // 🔄 Carregar motoristas
  // =====================================================
  async function carregarMotoristas() {
    try {
      const lista = await api.listarMotoristas();
      selectMotoristas.innerHTML = "";

      const placeholder = document.createElement("option");
      placeholder.textContent = "Selecione um motorista (para alterar/excluir)";
      placeholder.disabled = true;
      placeholder.selected = true;
      selectMotoristas.appendChild(placeholder);

      lista.forEach((m) => {
        const opt = document.createElement("option");
        opt.value = m._id;
        opt.textContent = m.nome;
        selectMotoristas.appendChild(opt);
      });
    } catch (erro) {
      console.error("❌ Erro ao carregar motoristas:", erro.message);
    }
  }

  // =====================================================
  // 🔍 Preencher ao selecionar motorista
  // =====================================================
  selectMotoristas.addEventListener("change", async () => {
    const id = selectMotoristas.value;
    if (!id) return;

    try {
      const lista = await api.listarMotoristas();
      const m = lista.find((x) => x._id === id);
      if (!m) return;

      nome.value = m.nome || "";
      cpf.value = m.cpf || "";
      telefone.value = m.telefone || "";
      cnh.value = m.cnh || "";                 // ⭐ corrigido
      categoria.value = m.categoria || "";
      infoAdicionais.value = m.infoAdicionais || m.informacoesAdicionais || "";

      if (m.imagemMotorista) {
        previewFoto.src = m.imagemMotorista;
        imagemBase64 = m.imagemMotorista;
      } else {
        previewFoto.src = "../images/placeholder-user.png";
        imagemBase64 = "";
      }

    } catch (erro) {
      console.error("❌ Erro ao preencher motorista:", erro.message);
    }
  });

  // =====================================================
  // 🟢 INCLUIR Motorista
  // =====================================================
  btnIncluir.addEventListener("click", async () => {
    const dados = {
      nome: nome.value.trim(),
      cpf: cpf.value.trim(),
      telefone: telefone.value.trim(),
      cnh: cnh.value.trim(),                        // ⭐ corrigido
      categoria: categoria.value.trim(),
      infoAdicionais: infoAdicionais.value.trim(),
      imagemMotorista: imagemBase64,
    };

    if (!dados.nome || !dados.cpf || !dados.telefone || !dados.cnh || !dados.categoria) {
      return alert("⚠️ Preencha todos os campos obrigatórios!");
    }

    try {
      const lista = await api.listarMotoristas();

      const jaCPF = lista.find((m) => m.cpf === dados.cpf);
      const jaCNH = lista.find((m) => m.cnh === dados.cnh);  // ⭐ corrigido

      if (jaCPF || jaCNH) {
        return alert("⚠️ CPF ou CNH já cadastrado!");
      }

      await api.criarMotorista(dados);
      alert("✅ Motorista cadastrado com sucesso!");

      limparCampos();
      carregarMotoristas();

    } catch (erro) {
      console.error("❌ Erro ao criar:", erro.message);
    }
  });

  // =====================================================
  // ✏️ ALTERAR Motorista
  // =====================================================
  btnAlterar.addEventListener("click", async () => {
    const id = selectMotoristas.value;
    if (!id) return alert("⚠️ Selecione um motorista para alterar.");

    const dados = {
      nome: nome.value.trim(),
      cpf: cpf.value.trim(),
      telefone: telefone.value.trim(),
      cnh: cnh.value.trim(),                              // ⭐ corrigido
      categoria: categoria.value.trim(),
      infoAdicionais: infoAdicionais.value.trim(),
      imagemMotorista: imagemBase64,
    };

    try {
      const lista = await api.listarMotoristas();

      const jaCPF = lista.find((m) => m.cpf === dados.cpf && m._id !== id);
      const jaCNH = lista.find((m) => m.cnh === dados.cnh && m._id !== id); // ⭐ corrigido

      if (jaCPF || jaCNH) {
        return alert("⚠️ CPF ou CNH já existente!");
      }

      await api.atualizarMotorista(id, dados);
      alert("✏️ Motorista atualizado!");

      limparCampos();
      carregarMotoristas();

    } catch (erro) {
      console.error("❌ Erro ao atualizar:", erro.message);
    }
  });

  // =====================================================
  // 🗑️ EXCLUIR Motorista
  // =====================================================
  btnExcluir.addEventListener("click", async () => {
    const id = selectMotoristas.value;
    if (!id) return alert("⚠️ Selecione um motorista!");

    if (!confirm("Deseja excluir este motorista?")) return;

    try {
      await api.deletarMotorista(id);
      alert("🗑️ Motorista excluído!");

      limparCampos();
      carregarMotoristas();

    } catch (erro) {
      console.error("❌ Erro ao excluir:", erro.message);
    }
  });

  // =====================================================
  // 🚪 SAIR
  // =====================================================
  btnSair.addEventListener("click", () => {
    window.location.href = "../pages/painelcadastros.html";
  });

  // =====================================================
  // 🧼 LIMPAR FORMULÁRIO
  // =====================================================
  function limparCampos() {
    nome.value = "";
    cpf.value = "";
    telefone.value = "";
    cnh.value = "";
    categoria.value = "";
    infoAdicionais.value = "";
    inputFoto.value = "";
    imagemBase64 = "";
    previewFoto.src = "../images/placeholder-user.png";
    selectMotoristas.selectedIndex = 0;
  }

  carregarMotoristas();
});
