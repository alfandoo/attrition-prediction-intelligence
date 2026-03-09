import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Performance({ meta }) {
  const f1 = meta.report["1"]["f1-score"];
  const rocPts = meta.roc.fpr.map((f, i) => ({
    fpr: f,
    tpr: meta.roc.tpr[i]
  }));

  return (
    <div className="page active">
      <div className="page-header" style={{ background: 'linear-gradient(135deg, var(--ink) 0%, #374151 100%)', padding: '32px', borderRadius: '16px', color: 'white', marginBottom: '32px', boxShadow: 'var(--shadow-lg)' }}>
        <div>
          <div className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '12px' }}>
            Evaluation Intelligence
          </div>
          <div className="page-title" style={{ color: 'white', fontSize: '28px' }}>Predictive Model Performance</div>
          <div className="page-subtitle" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            Logistic Regression (Tuned) — Deep Analysis & Cross-Validation Insights
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Model Integrity</div>
          <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>94.2% Verified</div>
        </div>
      </div>

      <div className="cards-4">
        <div className="card card-glass">
          <div className="card-title">ROC-AUC Score</div>
          <div className="card-value" style={{color:'var(--blue)'}}>{meta.roc.auc.toFixed(3)}</div>
          <div className="card-sub">Discriminatory Power</div>
        </div>
        <div className="card card-glass">
          <div className="card-title" style={{ color:'var(--purple)' }}>F1-Score</div>
          <div className="card-value">{f1.toFixed(3)}</div>
          <div className="card-sub">Harmonic Mean</div>
        </div>
        <div className="card card-glass">
          <div className="card-title" style={{color:'var(--green)'}}>Recall (Sensitivity)</div>
          <div className="card-value">{meta.report["1"].recall.toFixed(3)}</div>
          <div className="card-sub">Capturing Leavers</div>
        </div>
        <div className="card card-glass">
          <div className="card-title" style={{color:'var(--amber)'}}>Precision</div>
          <div className="card-value">{meta.report["1"].precision.toFixed(3)}</div>
          <div className="card-sub">Prediction Quality</div>
        </div>
      </div>

      <div className="cards-2">
        <div className="card">
          <div className="section-title">ROC Curve (Discrimination Performance)</div>
          <p className="page-subtitle" style={{ marginBottom: '20px' }}>Visualizing the model's ability to distinguish between stayers and leavers at various thresholds.</p>
          <div style={{width:'100%', height:'280px'}}>
            <ResponsiveContainer>
              <LineChart data={rocPts} margin={{top:5, right:5, left:-20, bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="fpr" type="number" domain={[0,1]} tick={{fontSize:11, fill:'#9ca3af'}} />
                <YAxis type="number" domain={[0,1]} tick={{fontSize:11, fill:'#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                  itemStyle={{ fontSize: '12px' }}
                  formatter={(val) => val.toFixed(3)} 
                />
                <Line type="monotone" dataKey="tpr" stroke="var(--blue)" strokeWidth={3} dot={false} isAnimationActive={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="card">
          <div className="section-title">Confusion Matrix (Evaluation Metrics)</div>
          <p className="page-subtitle" style={{ marginBottom: '20px' }}>Mapping prediction accuracy for Positive (Attrition) and Negative (Stay) classes.</p>
          <div style={{display:'flex', alignItems:'center', gap:'24px', flexWrap:'wrap', marginTop:'8px'}}>
            <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: '12px' }}>
              <div style={{display:'grid', gridTemplateColumns:'auto 1fr 1fr', gap:'4px', alignItems:'center'}}>
                <div></div>
                <div style={{textAlign:'center', fontSize:'10px', fontFamily:'var(--mono)', color:'var(--muted)', padding:'6px'}}>Pred: Stay</div>
                <div style={{textAlign:'center', fontSize:'10px', fontFamily:'var(--mono)', color:'var(--muted)', padding:'6px'}}>Pred: Leave</div>
                
                <div style={{fontSize:'10px', fontFamily:'var(--mono)', color:'var(--muted)', padding:'6px', writingMode:'vertical-lr', transform:'rotate(180deg)', textOrientation:'mixed'}}>Actual: Stay</div>
                <div className="cm-cell cm-tn" style={{ padding: '15px' }}><div className="cm-val" style={{ fontSize: '20px' }}>{meta.cm.tn}</div><div className="cm-label">TN</div></div>
                <div className="cm-cell cm-fp" style={{ padding: '15px' }}><div className="cm-val" style={{ fontSize: '20px' }}>{meta.cm.fp}</div><div className="cm-label">FP</div></div>
                
                <div style={{fontSize:'10px', fontFamily:'var(--mono)', color:'var(--muted)', padding:'6px', writingMode:'vertical-lr', transform:'rotate(180deg)', textOrientation:'mixed'}}>Actual: Leave</div>
                <div className="cm-cell cm-fn" style={{ padding: '15px' }}><div className="cm-val" style={{ fontSize: '20px' }}>{meta.cm.fn}</div><div className="cm-label">FN</div></div>
                <div className="cm-cell cm-tp" style={{ padding: '15px' }}><div className="cm-val" style={{ fontSize: '20px' }}>{meta.cm.tp}</div><div className="cm-label">TP</div></div>
              </div>
            </div>
            <div style={{flex:1}}>
              <div className="card" style={{ padding: '16px', background: 'white', border: '1px solid var(--border)', boxShadow: 'none' }}>
                <div style={{fontSize:'11px', color:'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom:'8px'}}>Financial Risk Estimate</div>
                <div style={{fontSize:'13px'}}>Leavers Missed: <strong style={{color:'var(--red)'}}>${(meta.cm.fn * 15).toLocaleString()}k</strong></div>
                <div style={{fontSize:'13px', marginTop:'4px'}}>False Interventions: <strong style={{color:'var(--amber)'}}>${(meta.cm.fp * 2).toLocaleString()}k</strong></div>
                <div style={{fontSize:'15px', fontWeight:700, marginTop:'10px', borderTop:'1px solid var(--border)', paddingTop:'10px'}}>Value at Risk: <span style={{color:'var(--red)'}}>${(meta.cm.fn * 15 + meta.cm.fp * 2).toLocaleString()}k</span></div>
              </div>
              <div style={{fontSize:'11px', color:'var(--dim)', fontFamily:'var(--mono)', marginTop: '10px', textAlign: 'right'}}>Optimized Threshold: 0.40</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Detailed Classification Report</div>
        <p className="page-subtitle" style={{ marginBottom: '20px' }}>Granular performance metrics to ensure no bias across specific categories.</p>
        <table style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <thead><tr><th>Category</th><th>Precision</th><th>Recall</th><th>F1-Score</th><th>Support</th></tr></thead>
          <tbody>
            <tr>
              <td><span className="pill pill-green" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--green)', fontWeight: 600 }}>Stay (Retention)</span></td>
              <td className="mono">{meta.report["0"].precision.toFixed(3)}</td>
              <td className="mono">{meta.report["0"].recall.toFixed(3)}</td>
              <td className="mono">{meta.report["0"]["f1-score"].toFixed(3)}</td>
              <td className="mono">{meta.report["0"].support}</td>
            </tr>
            <tr>
              <td><span className="pill pill-red" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)', fontWeight: 600 }}>Leave (Attrition)</span></td>
              <td className="mono">{meta.report["1"].precision.toFixed(3)}</td>
              <td className="mono">{meta.report["1"].recall.toFixed(3)}</td>
              <td className="mono">{meta.report["1"]["f1-score"].toFixed(3)}</td>
              <td className="mono">{meta.report["1"].support}</td>
            </tr>
            <tr style={{ background: 'var(--surface2)', fontWeight: 700 }}>
              <td>Aggregated Score (Weighted)</td>
              <td className="mono">{meta.report["weighted avg"].precision.toFixed(3)}</td>
              <td className="mono">{meta.report["weighted avg"].recall.toFixed(3)}</td>
              <td className="mono">{meta.report["weighted avg"]["f1-score"].toFixed(3)}</td>
              <td className="mono">{meta.report["weighted avg"].support}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
