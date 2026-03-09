import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function CustomBarChart({ dataObj, positiveColor, isCorr = false }) {
  const data = Object.entries(dataObj)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({ name: key, value }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} style={{ fontSize: '11px', fontFamily: 'IBM Plex Sans' }} />
          <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} formatter={(value) => isCorr ? value.toFixed(3) : (value * 100).toFixed(1) + '%'} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={isCorr && entry.value < 0 ? '#10b981' : positiveColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function MiniImpactVisual({ label1, val1, label2, val2, color, unit = '%' }) {
  const maxVal = Math.max(val1, val2);
  const p1 = (val1 / maxVal) * 100;
  const p2 = (val2 / maxVal) * 100;
  
  return (
    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '80px', fontSize: '11px', color: 'var(--muted)', fontFamily: 'IBM Plex Mono' }}>{label1}</div>
        <div style={{ flex: 1, height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: color, borderRadius: '3px', width: `${p1}%` }} />
        </div>
        <div style={{ width: '50px', fontSize: '12px', fontWeight: '600', textAlign: 'right' }}>{val1}{unit}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '80px', fontSize: '11px', color: 'var(--muted)', fontFamily: 'IBM Plex Mono' }}>{label2}</div>
        <div style={{ flex: 1, height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--muted)', opacity: 0.3, borderRadius: '3px', width: `${p2}%` }} />
        </div>
        <div style={{ width: '50px', fontSize: '12px', fontWeight: '600', textAlign: 'right', color: 'var(--muted)' }}>{val2}{unit}</div>
      </div>
    </div>
  );
}

export default function EDAPage() {
  const [edaData, setEdaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/eda')
      .then(res => res.json())
      .then(data => {
        setEdaData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch EDA data", err);
        setLoading(false);
      });
  }, []);

  if (loading || !edaData) {
    return <div style={{display:'flex', height:'100%', justifyContent:'center', alignItems:'center'}}>Loading Live EDA from Dataset...</div>;
  }

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">Exploratory Data Analysis (EDA)</div>
          <div className="page-subtitle">Patterns, drivers, and visual insights from the IBM HR dataset</div>
        </div>
        <div className="badge live">Live Dataset Analysis</div>
      </div>

      {/* Summary Metrics Row */}
      <div className="cards-4">
        <div className="card">
          <div className="card-title">Total Employees</div>
          <div className="card-value">{edaData.summary.total}</div>
          <div className="card-sub mono">Global Workforce</div>
        </div>
        <div className="card">
          <div className="card-title">Attrition Rate</div>
          <div className="card-value" style={{color: 'var(--red)'}}>{(edaData.summary.rate * 100).toFixed(1)}%</div>
          <div className="card-sub mono">{edaData.summary.attrition} Total Leavers</div>
        </div>
        <div className="card">
          <div className="card-title">Top Risk Factor</div>
          <div className="card-value" style={{color: 'var(--amber)', fontSize: '24px', paddingTop: '8px'}}>Overtime</div>
          <div className="card-sub mono">30.5% Impact</div>
        </div>
        <div className="card">
          <div className="card-title">Imbalance Status</div>
          <div className="card-value" style={{color: 'var(--teal)', fontSize: '24px', paddingTop: '8px'}}>Minority (16%)</div>
          <div className="card-sub mono">Requires SMOTE</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--surface) 0%, #f9fafb 100%)' }}>
        <div className="section-title">🔍 Key Takeaways & Strategic Insights</div>
        <div className="page-subtitle" style={{ marginBottom: '20px' }}>Comprehensive analysis findings from the 01_eda.ipynb research phase.</div>
        
        <div className="insight-list" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '16px' 
        }}>
          <div className="insight-item" style={{ borderColor: 'var(--red)', background: 'rgba(239, 68, 68, 0.03)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display:'block' }}>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px'}}>
               <span className="insight-icon">⚠️</span>
               <strong>Overtime Dependency (r=0.246)</strong>
            </div>
            <div className="insight-text">
              Strongest predictor. <strong>3x higher</strong> risk when working Overtime.
            </div>
            <MiniImpactVisual label1="With OT" val1={30.5} label2="No OT" val2={10.4} color="var(--red)" />
          </div>

          <div className="insight-item" style={{ borderColor: 'var(--blue)', background: 'rgba(59, 130, 246, 0.03)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display:'block' }}>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px'}}>
               <span className="insight-icon">💰</span>
               <strong>Compensation Disparity</strong>
            </div>
            <div className="insight-text">
              Mean monthly income gap of <strong>~$2,046</strong> between groups.
            </div>
            <MiniImpactVisual label1="Stayers" val1={6833} label2="Attritors" val2={4787} color="var(--blue)" unit="" />
          </div>

          <div className="insight-item" style={{ borderColor: 'var(--amber)', background: 'rgba(245, 158, 11, 0.03)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display:'block' }}>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px'}}>
               <span className="insight-icon">⏳</span>
               <strong>Tenure Danger Zone</strong>
            </div>
            <div className="insight-text">
              Leavers median tenure: <strong>3 years</strong> vs 6 for stayers.
            </div>
            <div style={{ marginTop: '12px', background: 'linear-gradient(90deg, var(--red) 0%, var(--red) 50%, var(--muted) 50%, var(--muted) 100%)', height:'10px', borderRadius:'5px', opacity:0.8 }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', marginTop:'4px', color:'var(--muted)', fontFamily:'IBM Plex Mono' }}>
              <span>0 Year</span>
              <span style={{color:'var(--red)', fontWeight:'700'}}>Danger (0-3Y)</span>
              <span>Safe (3Y+)</span>
            </div>
          </div>

          <div className="insight-item" style={{ borderColor: 'var(--purple)', background: 'rgba(139, 92, 246, 0.03)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display:'block' }}>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px'}}>
               <span className="insight-icon">👶</span>
               <strong>Demographic Risk</strong>
            </div>
            <div className="insight-text">
              Age 18-25 has the <strong>highest attrition rate</strong> (35.8%).
            </div>
            <MiniImpactVisual label1="18-25" val1={35.8} label2="36-45" val2={9.2} color="var(--purple)" />
          </div>

          <div className="insight-item" style={{ borderColor: 'var(--teal)', background: 'rgba(20, 184, 166, 0.03)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display:'block' }}>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px'}}>
               <span className="insight-icon">😊</span>
               <strong>Sentiment Impact</strong>
            </div>
            <div className="insight-text">
              Low satisfaction (Level 1) <strong>doubles</strong> risk vs high (Level 4).
            </div>
            <MiniImpactVisual label1="Level 1" val1={22.8} label2="Level 4" val2={11.3} color="var(--teal)" />
          </div>

          <div className="insight-item" style={{ borderColor: 'var(--green)', background: 'rgba(16, 185, 129, 0.03)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display:'block' }}>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px'}}>
               <span className="insight-icon">🛡️</span>
               <strong>Class Imbalance</strong>
            </div>
            <div className="insight-text">
              Target class is only <strong>16.1%</strong> of total data.
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '2px' }}>
              <div style={{ flex: 0.16, height: '10px', background: 'var(--red)', borderRadius: '5px 0 0 5px' }} />
              <div style={{ flex: 0.84, height: '10px', background: 'var(--green)', borderRadius: '0 5px 5px 0' }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', marginTop:'4px', color:'var(--muted)', fontFamily:'IBM Plex Mono' }}>
              <span style={{color:'var(--red)'}}>16% Leave</span>
              <span>84% Stay</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-title">🧬 Behavioral & Work-Life Factors</div>
      <div className="cards-2">
        <div className="card">
          <div className="card-title">Attrition by Overtime</div>
          <CustomBarChart dataObj={edaData.overtime} positiveColor="var(--red)" />
          <div className="card-sub mono">Strongest Positive Correlation</div>
        </div>
        <div className="card">
          <div className="card-title">Attrition by Business Travel</div>
          <CustomBarChart dataObj={edaData.travel} positiveColor="var(--amber)" />
          <div className="card-sub mono">Frequency of movement impact</div>
        </div>
      </div>

      <div className="section-title">🏢 Career Path & Departmental Trends</div>
      <div className="cards-2">
        <div className="card">
          <div className="card-title">Attrition by Department</div>
          <CustomBarChart dataObj={edaData.dept} positiveColor="var(--blue)" />
          <div className="card-sub mono">Sales Dept shows highest turnover</div>
        </div>
        <div className="card">
          <div className="card-title">Attrition by Marital Status</div>
          <CustomBarChart dataObj={edaData.marital} positiveColor="var(--purple)" />
          <div className="card-sub mono">Single employees show higher risk</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="section-title">Attrition by Job Role</div>
        <CustomBarChart dataObj={edaData.jobrole} positiveColor="var(--teal)" />
        <div className="card-sub mono">Sales Representatives are the most volatile role category</div>
      </div>

      <div className="card">
        <div className="section-title">Numeric Correlation Heat-map Rank</div>
        <div className="page-subtitle" style={{ marginBottom: '15px' }}>Feature relationship with Attrition (Red = Positive, Green = Negative)</div>
        <CustomBarChart dataObj={edaData.corr} positiveColor="var(--red)" isCorr={true} />
        <div className="card-sub mono">Experience and Income are strongly inversely correlated with Attrition</div>
      </div>
    </div>
  );
}
