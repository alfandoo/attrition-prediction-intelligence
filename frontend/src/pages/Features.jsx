import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip } from 'recharts';

export default function Features({ meta }) {
  const entries = Object.entries(meta.features || {}).sort((a, b) => b[1] - a[1]);
  const maxV = entries.length > 0 ? entries[0][1] : 1;
  const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a78bfa', '#14b8a6'];
  const engineered = ['Satisfaction_Score', 'TotalSatisfaction', 'Income_per_Age', 'Years_per_Promotion', 'Experience_Company_Ratio', 'Overtime_Flag'];

  // HR-friendly English mapping for features
  const featureLabelMap = {
    'MonthlyIncome': 'Monthly Salary',
    'TotalWorkingYears': 'Total Working Experience',
    'Age': 'Employee Age',
    'YearsAtCompany': 'Years at Current Company',
    'Overtime_Flag': 'Overtime Habit',
    'JobLevel': 'Seniority Level',
    'JobInvolvement': 'Job Involvement',
    'Experience_Company_Ratio': 'Loyalty Ratio (Tenure/Exp)',
    'YearsWithCurrManager': 'Years with Current Manager',
    'Satisfaction_Score': 'Average Satisfaction Score',
    'DailyRate': 'Daily Compensation Rate',
    'TotalSatisfaction': 'Cumulative Satisfaction',
    'Income_per_Age': 'Economic Value Unit (Income/Age)',
    'StockOptionLevel': 'Stock Option Ownership',
    'WorkLifeBalance': 'Work-Life Balance Score',
    'DistanceFromHome': 'Commute Distance',
    'YearsInCurrentRole': 'Years in Current Role',
    'MonthlyRate': 'Monthly Billing Rate',
    'YearsSinceLastPromotion': 'Years Since Last Promotion',
    'NumCompaniesWorked': 'Previous Organizations Count',
    'EnvironmentSatisfaction': 'Office Environment Satisfaction',
    'JobSatisfaction': 'Job Role Satisfaction',
    'TrainingTimesLastYear': 'Training Frequency (L-Year)',
    'RelationshipSatisfaction': 'Workplace Relationship Satisfaction',
    'JobRole_Laboratory Technician': 'Role: Laboratory Technician',
    'JobRole_Sales Representative': 'Role: Sales Representative'
  };

  const categories = {
    'Compensation & Financials': ['MonthlyIncome', 'DailyRate', 'MonthlyRate', 'StockOptionLevel', 'Income_per_Age'],
    'Experience & Tenure': ['TotalWorkingYears', 'Age', 'NumCompaniesWorked', 'JobLevel'],
    'Satisfaction & Sentiments': ['Satisfaction_Score', 'TotalSatisfaction', 'EnvironmentSatisfaction', 'JobInvolvement', 'WorkLifeBalance', 'RelationshipSatisfaction', 'JobSatisfaction'],
    'Loyalty & Stability': ['YearsAtCompany', 'YearsWithCurrManager', 'YearsInCurrentRole', 'Experience_Company_Ratio', 'YearsSinceLastPromotion'],
    'Workload & Logistics': ['Overtime_Flag', 'DistanceFromHome', 'TrainingTimesLastYear'],
    'Specific Roles': ['JobRole_Laboratory Technician', 'JobRole_Sales Representative'],
  };

  const catImp = {};
  for (const [cat, feats] of Object.entries(categories)) {
    catImp[cat] = feats.reduce((s, f) => s + (meta.features[f] || 0), 0);
  }
  const sortedCats = Object.entries(catImp).sort((a, b) => b[1] - a[1]).filter(x => x[1] > 0);
  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#14b8a6', '#ef4444'];
  const pieData = sortedCats.map(([name, value]) => ({ name, value }));

  return (
    <div className="page active">
      <div className="page-header" style={{ background: 'linear-gradient(135deg, var(--teal) 0%, #0d9488 100%)', padding: '32px', borderRadius: '16px', color: 'white', marginBottom: '32px', boxShadow: 'var(--shadow-lg)' }}>
        <div>
          <div className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '12px' }}>
            Feature Intelligence
          </div>
          <div className="page-title" style={{ color: 'white', fontSize: '28px' }}>Determinant Factor Analysis</div>
          <div className="page-subtitle" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            Hybrid AI Algorithm (Boruta + Random Forest) — Identifying Core Attrition Drivers
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Top Factors</div>
          <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>Top 15 Focused</div>
        </div>
      </div>

      <div className="cards-2">
        <div className="card">
          <div className="section-title">Top 15 Impactful Factors</div>
          <p className="page-subtitle" style={{ marginBottom: '20px' }}>Ranking of variables most prioritized by the AI model when predicting attrition risk.</p>
          <div id="feat-bars" style={{ marginBottom: '30px' }}>
            {entries.map(([feat, val], i) => {
              const pct = (val / maxV) * 100;
              const isEng = engineered.includes(feat);
              const gradient = isEng
                ? 'linear-gradient(90deg, #14b8a6 0%, #0d9488 100%)'
                : `linear-gradient(90deg, ${colors[i % colors.length]} 0%, ${colors[(i + 1) % colors.length]} 100%)`;

              return (
                <div key={feat} className="progress-row" style={{ marginBottom: '12px' }}>
                  <div className="progress-label" title={feat} style={{ fontSize: '13px', fontWeight: 500 }}>
                    {featureLabelMap[feat] || feat} {isEng && <span style={{ color: 'var(--teal)', fontSize: '10px' }}>⚙️</span>}
                  </div>
                  <div className="progress-bar-wrap" style={{ height: '10px', background: 'var(--surface2)' }}>
                    <div className="progress-bar" style={{ width: `${pct}%`, background: gradient, borderRadius: '5px' }}></div>
                  </div>
                  <div className="progress-val" style={{ fontWeight: 600, color: 'var(--ink)' }}>{(val * 100).toFixed(1)}%</div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <div className="section-title">🔍 AI Selection Logic (Boruta)</div>
            <div className="page-subtitle" style={{ marginBottom: '15px' }}>How does the AI select truly relevant features?</div>
            <div className="insight-item" style={{ borderLeftColor: 'var(--blue)', background: 'rgba(59,130,246,0.03)' }}>
              <div className="insight-text">
                For this project, I utilized the **BorutaPy Algorithm**, an iterative wrapper method built around Random Forest. It compares the importance of original features against "Shadow Features" (randomly shuffled versions) to ensure only variables with confirmed statistical significance are used in the final dashboard.
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Weight Distribution by Category</div>
          <p className="page-subtitle" style={{ marginBottom: '20px' }}>Contribution of specific feature groups to the overall model logic.</p>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', background: 'var(--surface2)', padding: '24px', borderRadius: '16px' }}>
            <div style={{ width: '200px', height: '200px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} innerRadius={60} dataKey="value" stroke="none" isAnimationActive={true}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <PieTooltip
                    contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                    formatter={(val) => (val * 100).toFixed(1) + '%'}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              {pieData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '10px' }}>
                  <span style={{ width: '10px', height: '10px', background: pieColors[i % pieColors.length], borderRadius: '50%', flexShrink: 0 }}></span>
                  <span style={{ fontWeight: '600', color: 'var(--ink)' }}>{d.name}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{(d.value * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <div className="section-title">⭐ Strategic Deep Dive: Top 5 Factors</div>
            <div className="page-subtitle" style={{ marginBottom: '20px' }}>Technical explanation of why these factors are AI-prioritized.</div>

            <div className="insight-list" style={{ gap: '12px' }}>
              {[
                { t: 'Total Experience', d: 'Senior employees often carry institutional knowledge and show higher stability risks if career plateaus occur.', c: 'var(--blue)' },
                { t: 'Overtime Habit', d: 'The most consistent psychological trigger for burnout and voluntary exit in the IBM HR dataset.', c: 'var(--red)' },
                { t: 'Stock Option Level', d: 'Acts as "Golden Handcuffs"—providing employees with long-term financial skin in the game reduces churn.', c: 'var(--amber)' },
                { t: 'Cumulative Satisfaction', d: 'A combined sentiment index (Environment + Role) determines the psychological threshold for stay vs. go.', c: 'var(--purple)' },
                { t: 'Years with Manager', d: 'Validates the corporate axiom: "People leave managers, not companies." Effective leadership is a primary retention pillar.', c: 'var(--teal)' }
              ].map((item, idx) => (
                <div key={idx} className="insight-item" style={{ borderLeftColor: item.c, background: 'white', border: '1px solid var(--border)', borderLeftWidth: '4px' }}>
                  <div className="insight-text">
                    <strong style={{ color: 'var(--ink)' }}>{idx + 1}. {item.t}</strong><br />
                    <span style={{ color: 'var(--muted)', fontSize: '12px' }}>{item.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
