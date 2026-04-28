import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fff', color: '#0c0e1a' }}>

      {/* ── NAV ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px', borderBottom: '1.5px solid #e2e7f2',
        background: '#fff', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: '#1a56db', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
              <circle cx="7.5" cy="14.5" r="1.5"/>
              <circle cx="16.5" cy="14.5" r="1.5"/>
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0c0e1a', letterSpacing: '-.5px' }}>AutoGest</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: '#6b7280', padding: '7px 12px', borderRadius: 9, textDecoration: 'none' }}>
            Entrar
          </Link>
          <Link href="/cadastro" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '9px 20px', fontSize: 13, fontWeight: 700,
            background: '#1a56db', color: '#fff', borderRadius: 10,
            border: '1.5px solid #1a56db', textDecoration: 'none',
          }}>
            Começar grátis →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: '72px 40px 64px', textAlign: 'center', borderBottom: '1.5px solid #e2e7f2' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontWeight: 700, background: '#0c0e1a', color: '#fff',
          padding: '5px 14px', borderRadius: 20, marginBottom: 24, letterSpacing: '.03em',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#c4b5fd">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Inteligência Artificial integrada · Novo
        </div>

        <h1 style={{ fontSize: 52, fontWeight: 800, color: '#0c0e1a', letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
          Seu carro merece<br />
          <span style={{ color: '#1a56db' }}>gestão inteligente</span>
        </h1>

        <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 36px' }}>
          Controle manutenções, rastreie gastos e receba alertas automáticos.
          Com IA que analisa seus dados e te diz exatamente onde economizar.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
          <Link href="/cadastro" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '15px 36px', fontSize: 16, fontWeight: 800,
            background: '#1a56db', color: '#fff', borderRadius: 14,
            border: '1.5px solid #1a56db', textDecoration: 'none',
          }}>
            Criar conta grátis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </Link>
          <Link href="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '13px 28px', fontSize: 15, fontWeight: 700,
            background: 'transparent', color: '#374151', borderRadius: 12,
            border: '1.5px solid #ccd3e5', textDecoration: 'none',
          }}>
            Já tenho conta
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <div style={{ display: 'flex' }}>
            {[
              { initials: 'PF', bg: '#eff6ff', color: '#1035a0' },
              { initials: 'MR', bg: '#ecfdf5', color: '#065f46' },
              { initials: 'JS', bg: '#f5f3ff', color: '#4c1d95' },
              { initials: 'LC', bg: '#fffbeb', color: '#92400e' },
              { initials: '+',  bg: '#fff1f2', color: '#9f1239' },
            ].map((av, i) => (
              <div key={i} style={{
                width: 30, height: 30, borderRadius: '50%',
                border: '2px solid #fff', fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginLeft: i === 0 ? 0 : -8, background: av.bg, color: av.color,
              }}>
                {av.initials}
              </div>
            ))}
          </div>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>
            <strong style={{ color: '#374151', fontWeight: 600 }}>+2.400 motoristas</strong> já controlam seus veículos
          </span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: '1.5px solid #e2e7f2' }}>
        {[
          { val: 'R$ 847',  label: 'Economizados por usuário ao ano' },
          { val: '94%',     label: 'Evitam manutenções atrasadas' },
          { val: '2 min',   label: 'Para configurar e ter o primeiro insight' },
        ].map((s, i) => (
          <div key={i} style={{
            padding: '28px 40px', textAlign: 'center',
            borderRight: i < 2 ? '1.5px solid #e2e7f2' : 'none',
          }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#0c0e1a', letterSpacing: '-1.5px', marginBottom: 4 }}>
              {s.val}
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '72px 40px', borderBottom: '1.5px solid #e2e7f2' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 11, fontWeight: 700, color: '#1035a0',
          background: '#eff6ff', padding: '4px 12px', borderRadius: 20,
          border: '1.5px solid #bdd3ff', marginBottom: 12,
        }}>
          Funcionalidades
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0c0e1a', letterSpacing: '-.8px', marginBottom: 8 }}>
          Tudo que você precisa,<br />sem complicação
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 36 }}>
          Projetado para motoristas que querem controle total sem precisar ser especialista.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
          {[
            {
              icon: <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>,
              iconBg: '#eff6ff', iconColor: '#1a56db',
              title: 'Cadastro de veículos',
              desc: 'Gerencie múltiplos carros com histórico completo de manutenções e despesas por veículo.',
              tag: 'Plano Free', tagBg: '#eff6ff', tagColor: '#1035a0', tagBd: '#bdd3ff',
              featured: false,
            },
            {
              icon: <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>,
              iconBg: '#fffbeb', iconColor: '#d97706',
              title: 'Alertas automáticos',
              desc: 'Nunca mais esqueça uma revisão. Alertas por e-mail antes do vencimento de qualquer serviço.',
              tag: 'Plano Free', tagBg: '#eff6ff', tagColor: '#1035a0', tagBd: '#bdd3ff',
              featured: false,
            },
            {
              icon: <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>,
              iconBg: '#ecfdf5', iconColor: '#059669',
              title: 'OCR de notas fiscais',
              desc: 'Tire foto da nota do posto ou oficina. A IA lê e registra o valor automaticamente, sem digitar nada.',
              tag: 'Pro + IA', tagBg: '#f5f3ff', tagColor: '#4c1d95', tagBd: '#c4b5fd',
              featured: false,
            },
            {
              icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>,
              iconBg: '#eff6ff', iconColor: '#1a56db',
              title: 'Assistente de Inteligência Artificial',
              desc: 'Análise inteligente de gastos, custo por km, benchmarking e recomendações personalizadas para o seu veículo.',
              tag: 'Pro + IA', tagBg: '#f5f3ff', tagColor: '#4c1d95', tagBd: '#c4b5fd',
              featured: true,
            },
          ].map((f, i) => (
            <div key={i} style={{
              background: f.featured ? '#eff6ff' : '#fff',
              border: f.featured ? '1.5px solid #bdd3ff' : '1.5px solid #e2e7f2',
              borderRadius: 14, padding: 22,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: f.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={f.iconColor}>{f.icon}</svg>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0c0e1a', marginBottom: 6, letterSpacing: '-.3px' }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 12 }}>{f.desc}</div>
              <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: f.tagBg, color: f.tagColor, border: `1px solid ${f.tagBd}` }}>
                {f.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '72px 40px', background: '#f1f4fb', borderBottom: '1.5px solid #e2e7f2' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#1035a0', background: '#eff6ff', padding: '4px 12px', borderRadius: 20, border: '1.5px solid #bdd3ff', marginBottom: 12 }}>
          Depoimentos
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0c0e1a', letterSpacing: '-.8px', marginBottom: 28 }}>Quem usa, não larga</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {[
            { text: '"A IA mostrou que eu gastava 40% acima da média com combustível. Ajustei os hábitos e economizei R$ 180 no primeiro mês."', name: 'Carlos Roberto', role: 'Motorista de app · SP', av: 'CR', bg: '#eff6ff', color: '#1035a0' },
            { text: '"Tenho 3 carros na família. O alerta de manutenção salvou meu carro de um problema grave na suspensão que eu nem sabia que estava vindo."', name: 'Ana Martins', role: 'Empresária · RJ', av: 'AM', bg: '#ecfdf5', color: '#065f46' },
            { text: '"Em 5 minutos já tinha meu Hilux cadastrado e os alertas configurados. O OCR de notas é incrível — foto e pronto, sem digitar nada."', name: 'Felipe Santos', role: 'Engenheiro · BH', av: 'FS', bg: '#fffbeb', color: '#92400e' },
          ].map((t, i) => (
            <div key={i} style={{ background: '#fff', border: '1.5px solid #e2e7f2', borderRadius: 14, padding: 20 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, marginBottom: 16 }}>{t.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: t.bg, color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{t.av}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0c0e1a' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: '72px 40px', borderBottom: '1.5px solid #e2e7f2' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#1035a0', background: '#eff6ff', padding: '4px 12px', borderRadius: 20, border: '1.5px solid #bdd3ff', marginBottom: 12 }}>
          Planos
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0c0e1a', letterSpacing: '-.8px', marginBottom: 8 }}>Simples e transparente</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 36 }}>Comece grátis. Evolua quando precisar. Cancele quando quiser.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {/* FREE */}
          <div style={{ background: '#fff', border: '1.5px solid #e2e7f2', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' as const }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0c0e1a', letterSpacing: '-.4px', marginBottom: 3 }}>Gratuito</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 18 }}>Para começar a organizar</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#0c0e1a', letterSpacing: '-1.5px', marginBottom: 4 }}>R$ 0</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 20 }}>para sempre</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 9, flex: 1, marginBottom: 20 }}>
              {['1 veículo cadastrado', 'Manutenções e alertas', 'Controle de despesas'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#374151' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#059669"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  {item}
                </div>
              ))}
              {['Assistente de IA', 'OCR de notas fiscais'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#9ca3af' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#9ca3af"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  {item}
                </div>
              ))}
            </div>
            <Link href="/cadastro" style={{ display: 'block', padding: 11, textAlign: 'center', fontSize: 13, fontWeight: 700, background: '#fff', color: '#374151', border: '1.5px solid #ccd3e5', borderRadius: 10, textDecoration: 'none' }}>
              Começar grátis
            </Link>
          </div>

          {/* ESSENCIAL */}
          <div style={{ background: '#fff', border: '2px solid #1a56db', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' as const }}>
            <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#1a56db', color: '#fff', marginBottom: 14, width: 'fit-content' }}>Mais popular</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0c0e1a', letterSpacing: '-.4px', marginBottom: 3 }}>Essencial</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 18 }}>Para quem quer controle total</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: '#0c0e1a', letterSpacing: '-1.5px' }}>R$ 19,90</span>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>/mês</span>
            </div>
            <div style={{ fontSize: 11, color: '#065f46', fontWeight: 600, marginBottom: 20 }}>ou R$ 15,92/mês no anual</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 9, flex: 1, marginBottom: 20 }}>
              {['Veículos ilimitados', 'Relatórios avançados', 'Exportação PDF e CSV', 'Notificações por e-mail', 'Suporte por e-mail'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#374151' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#059669"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  {item}
                </div>
              ))}
              {['Assistente de IA'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#9ca3af' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#9ca3af"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  {item}
                </div>
              ))}
            </div>
            <Link href="/cadastro" style={{ display: 'block', padding: 11, textAlign: 'center', fontSize: 13, fontWeight: 700, background: '#1a56db', color: '#fff', border: '1.5px solid #1a56db', borderRadius: 10, textDecoration: 'none' }}>
              Assinar Essencial
            </Link>
          </div>

          {/* PRO IA */}
          <div style={{ background: '#f5f3ff', border: '2px solid #7c3aed', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' as const }}>
            <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#7c3aed', color: '#fff', marginBottom: 14, width: 'fit-content' }}>Inclui IA</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0c0e1a', letterSpacing: '-.4px', marginBottom: 3 }}>Pro + IA</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 18 }}>Com inteligência artificial</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: '#0c0e1a', letterSpacing: '-1.5px' }}>R$ 29,90</span>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>/mês</span>
            </div>
            <div style={{ fontSize: 11, color: '#4c1d95', fontWeight: 600, marginBottom: 20 }}>ou R$ 23,92/mês no anual</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 9, flex: 1, marginBottom: 20 }}>
              {['Tudo do Essencial'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#374151' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#059669"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  {item}
                </div>
              ))}
              {['Assistente de Inteligência Artificial', 'OCR de notas fiscais', 'Score de saúde do veículo', 'Suporte prioritário'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#0c0e1a', fontWeight: 600 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#7c3aed"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  {item}
                </div>
              ))}
            </div>
            <Link href="/cadastro" style={{ display: 'block', padding: 11, textAlign: 'center', fontSize: 13, fontWeight: 700, background: '#7c3aed', color: '#fff', border: '1.5px solid #7c3aed', borderRadius: 10, textDecoration: 'none' }}>
              Assinar Pro + IA
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: '72px 40px', background: '#0c0e1a', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,.1)', color: '#fff', padding: '5px 14px', borderRadius: 20, marginBottom: 20, letterSpacing: '.03em' }}>
          Sem cartão de crédito para começar
        </div>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-.8px', marginBottom: 10 }}>
          Pronto para ter controle<br />total do seu veículo?
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', marginBottom: 32 }}>
          Junte-se a mais de 2.400 motoristas que já economizam com o AutoGest.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 18 }}>
          <Link href="/cadastro" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 36px', fontSize: 16, fontWeight: 800, background: '#fff', color: '#0c0e1a', borderRadius: 14, border: '1.5px solid #fff', textDecoration: 'none' }}>
            Criar conta grátis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#0c0e1a">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </Link>
          <Link href="/cadastro" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 28px', fontSize: 15, fontWeight: 700, background: 'transparent', color: 'rgba(255,255,255,.7)', borderRadius: 12, border: '1.5px solid rgba(255,255,255,.2)', textDecoration: 'none' }}>
            Ver planos
          </Link>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>
          Grátis para sempre · Sem cartão · Cancele quando quiser
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1.5px solid #e2e7f2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, background: '#1a56db', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#0c0e1a' }}>AutoGest</span>
          <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 4 }}>· Gestão automotiva inteligente</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacidade', 'Termos', 'Contato'].map(link => (
            <a key={link} href="#" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}>{link}</a>
          ))}
        </div>
      </footer>

    </div>
  )
}
