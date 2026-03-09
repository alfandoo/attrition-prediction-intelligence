import { Lightbulb, Target, TrendingDown, Users, Rocket } from 'lucide-react';

export default function Recommendations() {
  const recommendations = [
    {
      title: 'Workload & Overtime Management',
      icon: <TrendingDown className="icon-red" />,
      risk_factor: 'Overtime Habit (3x Risk)',
      strategy: 'Implement "Overtime Threshold Alerts" for managers. Employees working >15% overtime for 2 consecutive months should trigger a mandatory 1-on-1 workload review.',
      impact: 'High Retention ROI',
      color: 'var(--red)'
    },
    {
      title: 'Compensation Alignment',
      icon: <Target className="icon-blue" />,
      risk_factor: '$2,046 Income Gap',
      strategy: 'Conduct "Market-to-Role" salary audits every 6 months. Prioritize retention bonuses for high-performing employees in the "Laboratory Technician" and "Sales Representative" roles.',
      impact: 'Financial Stability',
      color: 'var(--blue)'
    },
    {
      title: 'Early Tenure "Danger Zone" Support',
      icon: <Users className="icon-amber" />,
      risk_factor: '0-3 Year Churn Peak',
      strategy: 'Enhance the "New Hire Mentorship" program to last 12 months (up from 3). Standardize career pathing workshops within the first 18 months of employment.',
      impact: 'Cultural Integration',
      color: 'var(--amber)'
    },
    {
      title: 'Management & Leadership Training',
      icon: <Lightbulb className="icon-purple" />,
      risk_factor: 'Manager-Employee Synergy',
      strategy: 'Train managers on "Predictive Empathy" and early burnout detection. Tie manager KPIs to team stability scores, not just output.',
      impact: 'Structural Loyalty',
      color: 'var(--purple)'
    }
  ];

  return (
    <div className="page active">
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '32px', borderRadius: '16px', color: 'white', marginBottom: '32px', boxShadow: 'var(--shadow-lg)' }}>
        <div>
          <div className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '12px' }}>
            Executive Summary
          </div>
          <div className="page-title" style={{ color: 'white', fontSize: '28px' }}>Strategic Roadmap & Conclusion</div>
          <div className="page-subtitle" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            Data-driven recommendations to stabilize the workforce and optimize retention.
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px', background: 'var(--surface2)', border: '1px solid var(--border)' }}>
        <div className="section-title">Final Project Conclusion</div>
        <p style={{ color: 'var(--muted)', lineHeight: '1.6', fontSize: '15px' }}>
          This project successfully developed an end-to-end predictive system for employee attrition using the IBM HR dataset. 
          By combining <strong>Logistic Regression</strong> with <strong>SMOTE balancing</strong> and <strong>Hybrid Feature Selection</strong>, 
          the model achieves a <strong>70% Recall rate</strong>, effectively identifying the majority of high-risk employees before they exit.
        </p>
      </div>

      <div className="section-title">🛡️ Strategic Business Interventions</div>
      <div className="insight-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {recommendations.map((rec, i) => (
          <div key={i} className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '24px', right: '24px', opacity: 0.15 }}>{rec.icon}</div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: rec.color, fontWeight: '700', marginBottom: '8px' }}>
               Targeting: {rec.risk_factor}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)', marginBottom: '12px' }}>{rec.title}</div>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5', marginBottom: '16px' }}>{rec.strategy}</p>
            <div style={{ fontSize: '11px', background: 'var(--surface2)', display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontWeight: '600', color: 'var(--ink)' }}>
              💎 KPI Impact: {rec.impact}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, var(--teal) 0%, #0d9488 100%)', color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px' }}>
            <Rocket size={32} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '18px' }}>Future Roadmap (Phase 12+)</div>
            <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>
              Moving forward, the system can be integrated directly with internal HRIS platforms (SAP/SuccessFactors) for automated risk scoring and real-time intervention workflow management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
