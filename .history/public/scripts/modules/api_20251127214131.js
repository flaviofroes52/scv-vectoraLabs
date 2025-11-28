// =======================================================
// 🌐 api.js — Comunicação com o backend SCV (NOVA ROUPAGEM)
// =======================================================

const API_BASE = "https://scv-api-vectoralabs.onrender.com/api";

// =======================================================
// 🚀 Objeto principal da API
// =======================================================
const api = {

  // =====================================================
  // 🔐 AUTENTICAÇÃO — (MANTIDA INTACTA)
  // =====================================================

  async registrarUsuario(login, senha) {
    const resp = await fetch(`${API_BASE}/validacao/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, senha }),
    });

    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || "Erro ao registrar usuário.");
    return json;
  },

  async autenticarUsuario(login, senha) {
    const resp = await fetch(`${API_BASE}/validacao/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, senha }),
    });

    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || "Erro ao autenticar usuário.");
    return json;
  },

  async listarUsuarios() {
    try {
      const resp = await fetch(`${API_BASE}/validacao/usuarios`);
      if (!resp.ok) throw new Error("Erro ao listar usuários.");
      return await resp.json();
    } catch {
      return [];
    }
  },

  async excluirUsuario(id) {
    const resp = await fetch(`${API_BASE}/validacao/${id}`, { method: "DELETE" });
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || "Erro ao excluir usuário.");
    return json;
  },

  // =====================================================
  // 🚘 MOTORISTAS — (MANTIDO)
  // =====================================================

  async listarMotoristas() {
    try {
      const resp = await fetch(`${API_BASE}/motoristas`);
      if (!resp.ok) throw new Error("Erro ao listar motoristas.");
      return await resp.json();
    } catch {
      return [];
    }
  },

  async criarMotorista(dados) {
    const resp = await fetch(`${API_BASE}/motoristas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || "Erro ao criar motorista.");
    return json;
  },

  async atualizarMotorista(id, dados) {
    const resp = await fetch(`${API_BASE}/motoristas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || "Erro ao atualizar motorista.");
    return json;
  },

  async deletarMotorista(id) {
    const resp = await fetch(`${API_BASE}/motoristas/${id}`, { method: "DELETE" });
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || "Erro ao excluir motorista.");
    return json;
  },

  // =====================================================
  // 🚚 VEÍCULOS — (MANTIDO)
  // =====================================================

  async listarVeiculos() {
    try {
      const resp = await fetch(`${API_BASE}/veiculos`);
      if (!resp.ok) throw new Error("Erro ao listar veículos.");
      return await resp.json();
    } catch {
      return [];
    }
  },

  async criarVeiculo(dados) {
    const resp = await fetch(`${API_BASE}/veiculos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || "Erro ao criar veículo.");
    return json;
  },

  async alterarVeiculo(id, dados) {
    const resp = await fetch(`${API_BASE}/veiculos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || "Erro ao alterar veículo.");
    return json;
  },

  async deletarVeiculo(id) {
    const resp = await fetch(`${API_BASE}/veiculos/${id}`, { method: "DELETE" });
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || "Erro ao excluir veículo.");
    return json;
  },

  async alterarDisponibilidade(id) {
    const resp = await fetch(`${API_BASE}/veiculos/${id}/disponibilidade`, {
      method: "PATCH",
    });

    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || "Erro ao alterar disponibilidade.");
    return json;
  },

  // =====================================================
  // 🆕 DASHBOARD — NOVA ROUPAGEM (CASCA PRONTA)
  // =====================================================

  async listarFrotaDashboard() {
    const resp = await fetch(`${API_BASE}/dashboard/frota`);
    return await resp.json();
  },

  async listarVeiculosLivres() {
    const resp = await fetch(`${API_BASE}/dashboard/livres`);
    return await resp.json();
  },

  async listarVeiculosEmUso() {
    const resp = await fetch(`${API_BASE}/dashboard/emuso`);
    return await resp.json();
  },

  async listarGrafico() {
    const resp = await fetch(`${API_BASE}/dashboard/grafico`);
    return await resp.json();
  },

  // =====================================================
  // 🆕 OPERAÇÕES — (REORGANIZADO, PADRONIZADO, 100% COMPATÍVEL)
  // =====================================================

  async iniciarOperacao(dados) {
    try {
      const resp = await fetch(`${API_BASE}/operacoes/iniciar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resp.ok) throw new Error("Erro ao iniciar operação.");
      return await resp.json();

    } catch (e) {
      console.error("❌ Erro iniciarOperacao:", e);
      return null;
    }
  },

  async finalizarOperacao(id) {
    try {
      const resp = await fetch(`${API_BASE}/operacoes/finalizar/${id}`, {
        method: "PUT",
      });

      if (!resp.ok) throw new Error("Erro ao finalizar operação.");
      return await resp.json();

    } catch (e) {
      console.error("❌ Erro finalizarOperacao:", e);
      return null;
    }
  },

  async listarOperacoesEmUso() {
    try {
      const resp = await fetch(`${API_BASE}/operacoes/emuso`);
      if (!resp.ok) throw new Error("Erro ao listar operações em uso.");
      return await resp.json();
    } catch {
      return [];
    }
  },

  async listarHistorico() {
    try {
      const resp = await fetch(`${API_BASE}/operacoes/historico`);
      if (!resp.ok) throw new Error("Erro ao listar histórico.");
      return await resp.json();
    } catch {
      return [];
    }
  },

};

// =======================================================
// ✅ Exporta o módulo
// =======================================================
export default api;
