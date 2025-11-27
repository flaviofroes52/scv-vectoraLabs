// =======================================================
// 🚗 Módulo: Cadastro de Veículos
// Arquivo: public/scripts/modules/cadveiculos.js
// =======================================================
import api from "./api.js";

export function initCadVeiculos() {
  console.log("👉 Módulo de Cadastro de Veículos Iniciado");

  // ===== Elementos =====
  const preview = document.getElementById("previewVeiculo");
  const fotoInput = document.getElementById("fotoVeiculo");

  const inpVeiculo = document.getElementById("veiculo");
  const inpMarca = document.getElementById("marca");
  const inpAno = document.getElementById("ano");
  const inpCor = document.getElementById("cor");
  const inpPlaca = document.getElementById("placa");
  const inpPatrimonio = document.getElementById("patrimonio");

  const selectVeiculos = document.getElementById("selectVeiculos");

  const btIncluir = document.getElementById("btIncluirVeiculo");
  const btAlterar = document.getElementById("btAlterarVeiculo");
  const btExcluir = document.getElementById("btExcluirVeiculo");
  const btSair = document.getElementById("btSairVeiculos");

  const secCad = document.getElementById("cadVeiculos");
  const mosaico = document.querySelector(".cadmosaico");

  let veiculoSelecionadoID = null;
  let fotoBase64 = "";

  // ⭐ CAMPOS DE CARGA PERIGOSA
  const grupoCargaPerigosa = document.getElementById("grupoCargaPerigosa");
  const inpCargaPerigosa = document.getElementById("cargaPerigosa");

  // =======================================================
  // 📸 PREVIEW DA FOTO
  // =======================================================
  fotoInput.addEventListener("change", () => {
    const file = fotoInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      fotoBase64 = reader.result;
      preview.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  // =======================================================
  // ⚠️ Habilitar/Ocultar Carga Perigosa
  // =======================================================
  function atualizarCargaPerigosa() {
    const valor = inpVeiculo.value.toLowerCase();

    const ehCaminhao = valor.includes("caminhao") || valor.includes("caminhão");
    const ehCarreta = valor.includes("carreta");

    if (ehCaminhao || ehCarreta) {
      grupoCargaPerigosa.style.display = "block";
      inpCargaPerigosa.disabled = false;
    } else {
      grupoCargaPerigosa.style.display = "none";
      inpCargaPerigosa.checked = false;
      inpCargaPerigosa.disabled = true;
    }
  }

  inpVeiculo.addEventListener("input", atualizarCargaPerigosa);

  // =======================================================
  // 🔄 CARREGAR VEÍCULOS
  // =======================================================
  async function carregarVeiculos() {
    try {
      const lista = await api.listarVeiculos();

      selectVeiculos.innerHTML = `<option value="">Selecione um veículo...</option>`;

      lista.forEach((v) => {
        const opt = document.createElement("option");
        opt.value = v._id;
        opt.textContent = `${v.veiculo} - ${v.marca} (${v.placa || v.patrimonio})`;
        selectVeiculos.appendChild(opt);
      });
    } catch (err) {
      console.error("Erro ao carregar veículos:", err);
    }
  }

  // =======================================================
  // 📝 Preencher formulário ao selecionar
  // =======================================================
  selectVeiculos.addEventListener("change", async () => {
    const id = selectVeiculos.value;
    veiculoSelecionadoID = id;

    if (!id) {
      limparFormulario();
      return;
    }

    try {
      const lista = await api.listarVeiculos();
      const v = lista.find((x) => x._id === id);
      if (!v) return;

      inpVeiculo.value = v.veiculo;
      inpMarca.value = v.marca;
      inpAno.value = v.ano;
      inpCor.value = v.cor;
      inpPlaca.value = v.placa || "";
      inpPatrimonio.value = v.patrimonio || "";

      preview.src = v.imagemveiculo || "/images/placeholder-veiculo.png";
      fotoBase64 = v.imagemveiculo || "";

      inpCargaPerigosa.checked = v.cargaPerigosa || false;

      atualizarCargaPerigosa();

    } catch (err) {
      console.error("Erro ao selecionar veículo:", err);
    }
  });

  // =======================================================
  // ➕ INCLUIR VEÍCULO  (CORRIGIDO)
  // =======================================================
  btIncluir.addEventListener("click", async () => {
    let dados = montarObjetoVeiculo();

    // ✔ Regra: precisa ter placa OU patrimônio
    if (!dados.placa && !dados.patrimonio) {
      alert("⚠️ Digite PLACA OU PATRIMÔNIO para identificar o veículo.");
      return;
    }

    // 🔥 NORMALIZAÇÃO — evita UNIQUE ERROR no MongoDB
    if (!dados.placa) dados.placa = null;
    if (!dados.patrimonio) dados.patrimonio = null;

    try {
      // Verificar duplicidade ANTES de enviar
      const lista = await api.listarVeiculos();

      if (dados.placa && lista.some(v => v.placa === dados.placa)) {
        alert("⚠️ Já existe um veículo cadastrado com esta PLACA!");
        return;
      }

      if (dados.patrimonio && lista.some(v => v.patrimonio === dados.patrimonio)) {
        alert("⚠️ Já existe um veículo cadastrado com este NÚMERO DE PATRIMÔNIO!");
        return;
      }

      // 🔥 Se tudo certo → POST seguro
      const r = await api.criarVeiculo(dados);
      console.log("Criado:", r);

      alert("🚚 Veículo cadastrado com sucesso!");
      await carregarVeiculos();
      limparFormulario();

    } catch (err) {
      console.error("Erro ao incluir:", err);
      alert("❌ Erro ao incluir veículo (ver console).");
    }
  });

  // =======================================================
  // ✏ ALTERAR VEÍCULO
  // =======================================================
  btAlterar.addEventListener("click", async () => {
    if (!veiculoSelecionadoID) return alert("Selecione um veículo!");

    let dados = montarObjetoVeiculo();

    if (!dados.placa && !dados.patrimonio) {
      alert("⚠️ Digite PLACA OU PATRIMÔNIO.");
      return;
    }

    if (!dados.placa) dados.placa = null;
    if (!dados.patrimonio) dados.patrimonio = null;

    try {
      const r = await api.alterarVeiculo(veiculoSelecionadoID, dados);
      console.log("Alterado:", r);

      alert("✏️ Veículo alterado com sucesso!");
      await carregarVeiculos();
      limparFormulario();

    } catch (err) {
      console.error("Erro ao alterar:", err);
    }
  });

  // =======================================================
  // ❌ EXCLUIR VEÍCULO
  // =======================================================
  btExcluir.addEventListener("click", async () => {
    if (!veiculoSelecionadoID) return alert("Selecione um veículo!");
    if (!confirm("Excluir este veículo?")) return;

    try {
      await api.deletarVeiculo(veiculoSelecionadoID);
      alert("🗑️ Veículo excluído!");

      await carregarVeiculos();
      limparFormulario();

    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  });

  // =======================================================
  // 🔙 SAIR
  // =======================================================
  btSair.addEventListener("click", () => {
    secCad.style.display = "none";
    mosaico.style.display = "grid";
  });

  // =======================================================
  // 🧼 LIMPAR FORMULÁRIO
  // =======================================================
  function limparFormulario() {
    veiculoSelecionadoID = null;
    inpVeiculo.value = "";
    inpMarca.value = "";
    inpAno.value = "";
    inpCor.value = "";
    inpPlaca.value = "";
    inpPatrimonio.value = "";
    preview.src = "/images/placeholder-veiculo.png";
    fotoBase64 = "";
    selectVeiculos.value = "";
    fotoInput.value = "";

    inpCargaPerigosa.checked = false;
    grupoCargaPerigosa.style.display = "none";
  }

 function montarObjetoVeiculo() {
  const payload = {
    veiculo: inpVeiculo.value,
    marca: inpMarca.value,
    ano: Number(inpAno.value),
    cor: inpCor.value,
    imagemveiculo: fotoBase64,
    cargaPerigosa: inpCargaPerigosa.checked,
    disponivel: true,
  };

  // 🔥 Se a placa tiver valor → mantém
  if (inpPlaca.value.trim()) {
    payload.placa = inpPlaca.value.trim();
  }

  // 🔥 Se o patrimônio tiver valor → mantém
  if (inpPatrimonio.value.trim()) {
    payload.patrimonio = inpPatrimonio.value.trim();
  }

  // Se não tiver valor → NÃO CRIA o campo
  return payload;
}


  carregarVeiculos();
}
