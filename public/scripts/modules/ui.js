// =======================================================
// 🧠 ui.js — Dashboard SCV (Somente UI / Renderização)
// =======================================================
import api from "./api.js";

const ui = {

  // -------------------------------------------------------
  // ⏱️ Timers e controle de confirm
  // -------------------------------------------------------
  _operacoesAvisadas: {},   
  _timers: {},              

  // -------------------------------------------------------
  // 📘 INFO DA FROTA – EFEITO AEROPORTO
  // -------------------------------------------------------
  _frotaCompleta: [],
  _indexFrota: 0,
  _TAMANHO_GRUPO: 3,
  _TEMPO_GIRO: 7000,
  _giroFrotaLoop: null,

  // 🔥 RESTAURADO — GIRO DO AEROPORTO
  iniciarGiroAeroporto() {
    if (!this._frotaCompleta.length) return;

    if (this._giroFrotaLoop) clearInterval(this._giroFrotaLoop);

    this._giroFrotaLoop = setInterval(() => {
      this._indexFrota += this._TAMANHO_GRUPO;
      if (this._indexFrota >= this._frotaCompleta.length) {
        this._indexFrota = 0;
      }
      this.renderizarInfoFrota();
    }, this._TEMPO_GIRO);
  },

  renderizarInfoFrota() {
    const elVeiculo  = document.getElementById("listaVeiculo");
    const elAnoFab   = document.getElementById("listaAnoFab");
    const elCor      = document.getElementById("listaCor");
    const elCurso    = document.getElementById("listaCurso");
    const elSituacao = document.getElementById("listaSituacao");

    if (!elVeiculo) return;

    elVeiculo.innerHTML =
      elAnoFab.innerHTML =
      elCor.innerHTML =
      elCurso.innerHTML =
      elSituacao.innerHTML = "";

    const inicio = this._indexFrota;
    const fim    = inicio + this._TAMANHO_GRUPO;
    const grupo  = this._frotaCompleta.slice(inicio, fim);

    grupo.forEach(v => {
      elVeiculo .appendChild(this._criarLiFlip(v.veiculo || "—"));
      elAnoFab  .appendChild(this._criarLiFlip(`${v.ano || "—"} / ${v.marca || "—"}`));
      elCor     .appendChild(this._criarLiFlip(v.cor || "—"));
      elCurso   .appendChild(this._criarLiFlip(v.cargaPerigosa ? "🔥 Sim" : "❌ Não"));
      elSituacao.appendChild(this._criarLiFlip(
        v.disponivel ? "🟢 Disponível" :
        v.manutencao ? "🛠️ Manutenção" :
                       "⭐ Em Uso"
      ));
    });
  },

  // =======================================================
  // 🚀 Inicialização
  // =======================================================
  async init() {
    console.log("🟦 UI SCV iniciada...");

    if (document.getElementById("containerDash")) {
      await this.atualizarDashboard();
      await this.atualizarPainelUso();

      // 🔥 GIRO ATIVO
      this.iniciarGiroAeroporto();

      setInterval(() => this._atualizarGraficoIsolado(), 15000);
    }

    if (document.getElementById("btnRegistrar")) {
      console.log("🟦 Área de operações detectada");
      await this.initOperacoes();
    }
  },

  // =======================================================
  // 🔁 Atualização do Dashboard
  // =======================================================
  async atualizarDashboard() {
    try {
      const veiculos = await api.listarVeiculos();
      this._frotaCompleta = veiculos;

      this.renderPainelLivres(veiculos);
      this.renderGrafico(veiculos);
      this.renderResumo(veiculos);

      console.log("✅ Dashboard atualizado");
    } catch (erro) {
      console.error("❌ Erro no dashboard:", erro);
    }
  },

  // =======================================================
  // 🔁 Atualização isolada — Veículos em uso
  // =======================================================
  async atualizarPainelUso() {
    try {
      const operacoesEmUso = await api.listarOperacoesEmUso();
      this.renderPainelUso(operacoesEmUso);
    } catch (erro) {
      console.error("❌ Erro ao atualizar painel de uso:", erro);
    }
  },

  // =======================================================
  // 🚗 Painel — Veículos Livres
  // =======================================================
  renderPainelLivres(veiculos) {
    const modelos = document.getElementById("informacoesV");
    const placas  = document.getElementById("informacoesP");
    if (!modelos || !placas) return;

    modelos.innerHTML = "";
    placas.innerHTML  = "";

    const livres = veiculos.filter(v => v.disponivel);

    if (!livres.length) {
      modelos.innerHTML = "<li>Nenhum veículo livre 🚗</li>";
      return;
    }

    livres.forEach(v => {
      modelos.innerHTML += `<li>${v.veiculo}</li>`;
      placas.innerHTML  += `<li>${v.placa || v.patrimonio || "-"}</li>`;
    });
  },

  // =======================================================
  // 🚚 Painel — Veículos em Uso (CARDS)
  // =======================================================
  renderPainelUso(opsLista) {
    const container = document.getElementById("painelVeicUsoCards");
    if (!container) return;

    container.innerHTML = "";

    Object.values(this._timers).forEach(clearInterval);
    this._timers = {};

    if (!opsLista.length) {
      const p = document.createElement("p");
      p.textContent = "Nenhum veículo em uso 🛻";
      p.classList.add("msg-sem-uso");
      container.appendChild(p);
      return;
    }

    opsLista.forEach(op => this._criarCardOperacao(op, container));
  },

  // =======================================================
  // 🟥 CARD — criação
  // =======================================================
  _criarCardOperacao(op, container) {

    const motorista = op.motoristaId || {};
    const veiculo   = op.veiculoId   || {};

    const card = document.createElement("div");
    card.classList.add("card-veic-uso");

    const topo = document.createElement("div");
    topo.classList.add("card-uso-topo");

    const foto = document.createElement("img");
    foto.classList.add("card-uso-foto");
    foto.src = motorista.imagemMotorista || "/public/assets/images/placeholder-user.png";

    const nome = document.createElement("div");
    nome.classList.add("card-uso-motorista");
    nome.textContent = motorista.nome || "Motorista não informado";

    topo.appendChild(foto);
    topo.appendChild(nome);

    const base = document.createElement("div");
    base.classList.add("card-uso-base");

    const nomeV = document.createElement("div");
    nomeV.classList.add("card-uso-veiculo");
    nomeV.textContent =
      veiculo.veiculo ||
      veiculo.placa ||
      veiculo.patrimonio ||
      "Veículo não informado";

    const atv = document.createElement("div");
    atv.classList.add("card-uso-atividade");
    atv.style.fontSize = "17px";
    atv.textContent = `Atividade: ${op.atividade ? op.atividade : "—"}`;

    const tempoEl = document.createElement("div");
    tempoEl.classList.add("card-uso-tempo");

    if (op.inicioAtividade && op.fimAtividade) {
      tempoEl.innerHTML =
        `Início: ${op.inicioAtividade} | Término: ${op.fimAtividade}`;
    } else {
      tempoEl.textContent = "Horário não definido";
    }

    const barraWrap = document.createElement("div");
    barraWrap.classList.add("card-uso-progresso");

    const barra = document.createElement("div");
    barra.classList.add("card-uso-progresso-barra");
    barraWrap.appendChild(barra);

    const btn = document.createElement("button");
    btn.classList.add("btn-finalizar-op");
    btn.textContent = "Finalizar";

    // =======================================================
    // 🟥 FINALIZAÇÃO MANUAL — (CORREÇÃO ANTI-DUPLICAÇÃO)
    // =======================================================
    btn.addEventListener("click", async () => {
      if (!confirm("Confirmar finalização desta operação?")) return;

      // ⭐ CORREÇÃO: impedir finalização dupla
      if (this._timers[op._id]) {
        clearInterval(this._timers[op._id]);
        delete this._timers[op._id];
      }

      try {
        await api.finalizarOperacao(op._id);

        await this.atualizarDashboard();

        alert("✔ Operação finalizada!");

        await this._atualizarTudoAposFinalizar();

        if (document.getElementById("opMotorista")) {
          await this.popularMotoristas();
          await this.popularVeiculos();
        }
      } catch (erro) {
        console.error("❌ Erro ao finalizar:", erro);
      }
    });

    base.appendChild(nomeV);
    base.appendChild(atv);
    base.appendChild(tempoEl);
    base.appendChild(barraWrap);
    base.appendChild(btn);

    card.appendChild(topo);
    card.appendChild(base);
    container.appendChild(card);

    this._iniciarTimerOperacao(op, barra, tempoEl, card);
  },

  // =======================================================
  // 🔥 Finalização Completa
  // =======================================================
  async _atualizarTudoAposFinalizar() {
    await this.atualizarPainelUso();
    await this.atualizarDashboard();
  },

  // =======================================================
  // ⏱️ Timer — intocado
  // =======================================================
  _iniciarTimerOperacao(op, barra, tempoEl, card) {
    if (!op.inicioAtividade || !op.fimAtividade) return;

    const inicio = this._converterHoraParaDate(op.inicioAtividade);
    let fim      = this._converterHoraParaDate(op.fimAtividade);

    const id = op._id;
    let fimProrrogado = null;

    const atualizarLinhaTempo = () => {
      let texto = `Início: ${op.inicioAtividade} | Término: ${op.fimAtividade}`;
      if (fimProrrogado) {
        texto += ` | <span class="texto-prorrogado">Prorrogado até: ${fimProrrogado}</span>`;
      }
      tempoEl.innerHTML = texto;
    };
    atualizarLinhaTempo();

    if (this._operacoesAvisadas[id] === undefined) {
      this._operacoesAvisadas[id] = false;
    }

    const totalOriginalMs = fim - inicio;
    if (totalOriginalMs <= 0) {
      tempoEl.textContent = "Horário inválido";
      barra.style.width = "0%";
      return;
    }

    const DEZ_MIN_MS   = 10 * 60 * 1000;
    const CINCO_MIN_MS = 5  * 60 * 1000;
    const QUARENTA5_MS = 45 * 60 * 1000;

    const modoTeste = totalOriginalMs <= DEZ_MIN_MS;

    let limiteConfirmMs;
    if (modoTeste) {
      if (totalOriginalMs <= CINCO_MIN_MS) {
        limiteConfirmMs = totalOriginalMs / 2;
      } else {
        limiteConfirmMs = CINCO_MIN_MS;
      }
    } else {
      limiteConfirmMs = QUARENTA5_MS;
    }

    const minExtraMin = modoTeste ? 2.5 : 30;
    const maxExtraMin = modoTeste ? 5   : 60;

    let metadeProrrogacaoMs = null;
    let alertaAtivo = false;

    this._timers[id] = setInterval(async () => {

      const agora       = new Date();
      const totalMs     = fim - inicio;
      const passouMs    = agora - inicio;
      const restanteMs  = fim - agora;

      let pct = (passouMs / totalMs) * 100;
      pct = Math.min(Math.max(pct, 0), 100);
      barra.style.width = `${pct}%`;

      if (
        metadeProrrogacaoMs !== null &&
        restanteMs <= metadeProrrogacaoMs &&
        restanteMs > 0
      ) {
        alertaAtivo = true;
      }

      if (alertaAtivo && restanteMs > 0) {
        card.classList.add("card-alerta");
      }

      if (
        !this._operacoesAvisadas[id] &&
        restanteMs > 0 &&
        restanteMs <= limiteConfirmMs
      ) {
        this._operacoesAvisadas[id] = true;

        const faixaMsg = modoTeste
          ? `entre ${minExtraMin} e ${maxExtraMin} minutos (modo teste)`
          : `entre ${minExtraMin} e ${maxExtraMin} minutos`;

        const quer = confirm(
          "⏳ Está se aproximando o fim da atividade.\nDeseja prorrogar?"
        );

        if (quer) {
          let texto = prompt(`Prorrogar por quantos minutos? (${faixaMsg})`);
          if (texto === null) {
            alertaAtivo = true;
          } else {
            texto = texto.replace(",", ".");
            const extraMin = parseFloat(texto);

            if (
              !isNaN(extraMin) &&
              extraMin >= minExtraMin &&
              extraMin <= maxExtraMin
            ) {
              const extraMs = extraMin * 60 * 1000;
              fim = new Date(fim.getTime() + extraMs);

              metadeProrrogacaoMs = extraMs / 2;
              alertaAtivo = false;
              card.classList.remove("card-alerta");

              const h = fim.getHours().toString().padStart(2, "0");
              const m = fim.getMinutes().toString().padStart(2, "0");
              fimProrrogado = `${h}:${m}`;

              atualizarLinhaTempo();
              alert(`⏱ Horário prorrogado até ${fimProrrogado}!`);
            } else {
              alert("⚠️ Valor inválido. Mantido o horário original.");
              alertaAtivo = true;
            }
          }
        } else {
          alertaAtivo = true;
        }
      }

      // =======================================================
      // 🔥 FINALIZAÇÃO AUTOMÁTICA
      // =======================================================
      if (restanteMs <= 0) {
        clearInterval(this._timers[id]);

        try {
          await api.finalizarOperacao(op._id);

          await this.atualizarDashboard();

          await this._atualizarTudoAposFinalizar();

          if (document.getElementById("opMotorista")) {
            await this.popularMotoristas();
            await this.popularVeiculos();
          }
        } catch (erro) {
          console.error("❌ Erro ao encerrar automaticamente:", erro);
        }
      }

    }, 1000);
  },

  // =======================================================
  // Conversor
  // =======================================================
  _converterHoraParaDate(h) {
    const [hr, min] = (h || "00:00").split(":").map(Number);
    const d = new Date();
    d.setHours(hr, min, 0, 0);
    return d;
  },

  // =======================================================
  // Painel Aeroporto
  // =======================================================
  renderResumo(veiculos) {
    this._frotaCompleta = veiculos;
    this.renderizarInfoFrota();
  },

  _criarLiFlip(texto) {
    const li = document.createElement("li");
    li.classList.add("linha-flip");
    li.textContent = texto;
    return li;
  },

  // =======================================================
  // Gráfico
  // =======================================================
  renderGrafico(veiculos) {
    const canvas = document.getElementById("graficoVeiculos");
    if (!canvas) return;

    const total  = veiculos.length;
    const livres = veiculos.filter(v => v.disponivel).length;
    const emUso  = total - livres;

    const pL = total ? Math.round((livres / total) * 100) : 0;
    const pU = total ? Math.round((emUso  / total) * 100) : 0;

    const dados = {
      labels: [
        `Disponíveis (${pL}%)`,
        `Em Uso (${pU}%)`
      ],
      datasets: [{
        data: [livres, emUso],
        backgroundColor: ["#00cc44", "#ff9500"],
      }],
    };

    if (window.chartFrota) window.chartFrota.destroy();

    window.chartFrota = new Chart(canvas, {
      type: "doughnut",
      data: dados,
    });
  },

  async _atualizarGraficoIsolado() {
    try {
      const veiculos = await api.listarVeiculos();
      this.renderGrafico(veiculos);
    } catch (erro) {
      console.error("❌ Erro ao atualizar gráfico isolado:", erro);
    }
  },

  // =======================================================
  // FORMULÁRIO — Operações
  // =======================================================
  async initOperacoes() {
    await this.popularMotoristas();
    await this.popularVeiculos();
    this._ligarAutoNomeVeiculo();

    const btn = document.getElementById("btnRegistrar");
    if (btn) {
      btn.addEventListener("click", () => this.registrarOperacao());
    }
  },

  async popularMotoristas() {
    try {
      const motoristas = await api.listarMotoristas();
      const opsEmUso   = await api.listarOperacoesEmUso();

      const idsEmUso = opsEmUso
        .map(op =>
          typeof op.motoristaId === "string"
            ? op.motoristaId
            : op.motoristaId?._id
        )
        .filter(Boolean);

      const disponiveis = motoristas.filter(m => !idsEmUso.includes(m._id));

      const sel = document.getElementById("opMotorista");
      if (!sel) return;

      sel.innerHTML = `<option value="">Selecione um motorista</option>`;

      disponiveis.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m._id;
        opt.textContent = m.nome;
        sel.appendChild(opt);
      });
    } catch (erro) {
      console.error("❌ popularMotoristas:", erro);
    }
  },

  async popularVeiculos() {
    try {
      const todos = await api.listarVeiculos();
      const livres = todos.filter(v => v.disponivel === true);

      const sel = document.getElementById("opVeiculo");
      if (!sel) return;

      sel.innerHTML = `<option value="">Selecione um veículo</option>`;

      livres.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v._id;
        opt.textContent = v.placa || v.patrimonio || v.veiculo;
        sel.appendChild(opt);
      });

      this._veiculosCache = livres;
    } catch (erro) {
      console.error("❌ popularVeiculos:", erro);
    }
  },

  _ligarAutoNomeVeiculo() {
    const sel   = document.getElementById("opVeiculo");
    const campo = document.getElementById("opNomeVeiculo");
    if (!sel || !campo) return;

    sel.addEventListener("change", () => {
      const v = this._veiculosCache?.find(x => x._id === sel.value);
      campo.value = v ? v.veiculo : "";
    });
  },

  async registrarOperacao() {
    const motoristaId     =
      document.getElementById("opMotorista")?.value || "";
    const veiculoId       =
      document.getElementById("opVeiculo")?.value || "";
    const inicioAtividade =
      document.getElementById("opInicio")?.value || "";
    const fimAtividade    =
      document.getElementById("opFim")?.value || "";
    const dataSaida       =
      document.getElementById("opData")?.value || "";
    const atividade       =
      document.getElementById("opAtividade")?.value || "";
    const status          =
      document.getElementById("opStatus")?.value || "Em viagem";

    const payload = {
      motoristaId,
      veiculoId,
      inicioAtividade,
      fimAtividade,
      dataSaida,
      atividade,
      status,
      emUso: true,
    };

    try {
      await api.iniciarOperacao(payload);
      alert("✔ Operação registrada!");

      await this.atualizarDashboard();
      await this.atualizarPainelUso();
      await this.popularMotoristas();
      await this.popularVeiculos();

      const limpar = id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      };

      limpar("opMotorista");
      limpar("opVeiculo");
      limpar("opNomeVeiculo");
      limpar("opInicio");
      limpar("opFim");
      limpar("opData");
      limpar("opAtividade");

      const st = document.getElementById("opStatus");
      if (st) st.value = "Em viagem";

    } catch (erro) {
      console.error("❌ registrarOperacao:", erro);
      alert("Erro ao registrar operação.");
    }
  }

};

export default ui;
