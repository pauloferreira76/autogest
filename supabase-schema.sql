-- =============================================
-- AutoGest — Schema do Banco de Dados
-- Execute este script no Supabase SQL Editor
-- =============================================

-- Tabela de veículos
CREATE TABLE IF NOT EXISTS veiculos (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  apelido       TEXT NOT NULL,
  marca         TEXT NOT NULL,
  modelo        TEXT NOT NULL,
  ano           INTEGER NOT NULL,
  placa         TEXT,
  quilometragem INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de manutenções
CREATE TABLE IF NOT EXISTS manutencoes (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  veiculo_id     UUID REFERENCES veiculos(id) ON DELETE CASCADE NOT NULL,
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tipo           TEXT NOT NULL,
  descricao      TEXT,
  data_prevista  DATE,
  data_realizada DATE,
  km_previsto    INTEGER,
  custo          NUMERIC(10,2),
  status         TEXT DEFAULT 'pendente'
    CHECK (status IN ('pendente','realizada','atrasada')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de despesas
CREATE TABLE IF NOT EXISTS despesas (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  veiculo_id     UUID REFERENCES veiculos(id) ON DELETE CASCADE NOT NULL,
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  categoria      TEXT NOT NULL
    CHECK (categoria IN ('combustivel','manutencao','seguro','multa','ipva','outros')),
  descricao      TEXT,
  valor          NUMERIC(10,2) NOT NULL,
  data           DATE NOT NULL DEFAULT CURRENT_DATE,
  nota_fiscal_url TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Habilita Row Level Security (RLS)
-- Cada usuário só vê e edita seus próprios dados
-- =============================================
ALTER TABLE veiculos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE manutencoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas    ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "usuarios_veiculos"    ON veiculos    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "usuarios_manutencoes" ON manutencoes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "usuarios_despesas"    ON despesas    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- Índices para melhorar performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_veiculos_user_id        ON veiculos(user_id);
CREATE INDEX IF NOT EXISTS idx_manutencoes_user_id     ON manutencoes(user_id);
CREATE INDEX IF NOT EXISTS idx_manutencoes_veiculo_id  ON manutencoes(veiculo_id);
CREATE INDEX IF NOT EXISTS idx_manutencoes_status      ON manutencoes(status);
CREATE INDEX IF NOT EXISTS idx_despesas_user_id        ON despesas(user_id);
CREATE INDEX IF NOT EXISTS idx_despesas_veiculo_id     ON despesas(veiculo_id);
CREATE INDEX IF NOT EXISTS idx_despesas_data           ON despesas(data);
