export default function Pipeline() {
  const steps = [
    { phase: '01', title: 'Data Loading & Validation', status: 'Complete', icon: '📂', color: 'var(--teal)', desc: 'Extracted 1,470 rows of IBM HR data with automated schema validation to ensure dataset integrity.', tools: ['Pandas', 'Python'] },
    { phase: '02', title: 'Exploratory Data Analysis', status: 'Complete', icon: '🔍', color: 'var(--blue)', desc: 'Bivariate and correlation analysis to identify primary attrition drivers (OverTime, Income, Age).', tools: ['Matplotlib', 'Seaborn'] },
    { phase: '03', title: 'Feature Engineering', status: 'Complete', icon: '⚙️', color: 'var(--purple)', desc: 'Engineered 15+ new features such as TenureRatio and SatisfactionScore to enhance predictive signals.', tools: ['Custom Logic', 'Python'] },
    { phase: '04', title: 'Hybrid Feature Selection', status: 'Complete', icon: '🔧', color: 'var(--amber)', desc: 'Multi-layered feature filtering using VIF (Collinearity) and Boruta Algorithm for statistical validity.', tools: ['BorutaPy', 'VIF'] },
    { phase: '05', title: 'Modeling & Tuning', status: 'Complete', icon: '🧠', color: 'var(--indigo)', desc: 'Logistic Regression model training with SMOTE and hyperparameter optimization for maximum recall.', tools: ['Scikit-Learn', 'SMOTE'] },
    { phase: '06', title: 'Monitoring & XAI', status: 'Ready', icon: '🚀', color: 'var(--green)', desc: 'Dashboard deployment with real-time SHAP explanations and hardware & drift monitoring systems.', tools: ['React', 'FastAPI', 'SHAP'] }
  ];

  return (
    <div className="page active">
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)', padding: '32px', borderRadius: '16px', color: 'white', marginBottom: '32px', boxShadow: 'var(--shadow-lg)' }}>
        <div>
          <div className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '12px' }}>
            System Architecture
          </div>
          <div className="page-title" style={{ color: 'white', fontSize: '28px' }}>MLOps Pipeline Journey</div>
          <div className="page-subtitle" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            End-to-end workflow from raw data ingestion to real-time predictive monitoring.
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>System Status</div>
          <div className="pill pill-green" style={{ background: 'rgba(16,185,129,0.2)', color: 'white', border: '1px solid rgba(16,185,129,0.3)', marginTop: '4px', padding: '4px 12px' }}>Operational</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>
        <div>
          <div className="section-title">Execution Roadmap</div>
          <div style={{ position: 'relative', paddingLeft: '32px', borderLeft: '2px dashed var(--border)', marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', left: '-41px', top: '0', width: '16px', height: '16px', 
                  borderRadius: '50%', background: s.status === 'Complete' || s.status === 'Ready' ? 'var(--green)' : 'var(--blue)', 
                  border: '4px solid white', boxShadow: '0 0 0 2px var(--border)' 
                }}></div>
                <div className="card" style={{ padding: '20px', transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: 'var(--mono)' }}>{s.phase}</span>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>{s.title}</div>
                    </div>
                    <span className={`pill ${s.status === 'Complete' || s.status === 'Ready' ? 'pill-green' : 'pill-blue'}`} style={{ fontSize: '10px' }}>{s.status}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px', lineHeight: '1.5' }}>{s.desc}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {s.tools.map(t => (
                      <span key={t} style={{ fontSize: '10px', background: 'var(--surface2)', color: 'var(--ink)', padding: '3px 8px', borderRadius: '4px', fontFamily: 'var(--mono)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '24px' }}>
          <div className="card">
            <div className="section-title" style={{ fontSize: '12px' }}>System Stack</div>
            <p className="page-subtitle" style={{ marginBottom: '16px' }}>Core technologies in this ecosystem.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { l: 'Interface', v: 'React.js + Recharts' },
                { l: 'Analytics', v: 'Python (Pandas)' },
                { l: 'Model', v: 'Logistic Regression' },
                { l: 'Interpreter', v: 'SHAP (Explainable AI)' },
                { l: 'Backend', v: 'FastAPI (Uvicorn)' },
                { l: 'Metrics', v: 'Psutil + Drift Analysis' }
              ].map(x => (
                <div key={x.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--muted)' }}>{x.l}</span>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{x.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-title" style={{ fontSize: '12px' }}>Build Artifacts</div>
            <p className="page-subtitle" style={{ marginBottom: '16px' }}>Pipelines outputs and assets.</p>
            <div className="insight-list" style={{ gap: '8px' }}>
              {[
                { n: 'model_pipeline.joblib', s: '52 KB' },
                { n: 'scaler_params.joblib', s: '14 KB' },
                { n: 'monitoring_logs.csv', s: 'Real-time' },
                { n: 'feature_meta.json', s: '8 KB' }
              ].map(a => (
                <div key={a.n} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--surface2)', borderRadius: '8px', fontSize: '11px' }}>
                  <code style={{ color: 'var(--indigo)', fontWeight: 600 }}>{a.n}</code>
                  <span style={{ color: 'var(--dim)', fontFamily: 'var(--mono)' }}>{a.s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: 'var(--bg)', border: '1px dashed var(--border)', textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛡️</div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>Security & Integrity</div>
            <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>All variables are processed through isolated scaling and encoding pipelines.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
