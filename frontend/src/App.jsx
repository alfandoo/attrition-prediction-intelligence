import { useState, useEffect } from 'react';
import { BarChart2, Search, TrendingUp, Settings, Target, GitMerge, Activity, Lightbulb } from 'lucide-react';
import Overview from './pages/Overview';
import EDA from './pages/EDA';
import Performance from './pages/Performance';
import Features from './pages/Features';
import Predictor from './pages/Predictor';
import Pipeline from './pages/Pipeline';
import Monitoring from './pages/Monitoring';
import Recommendations from './pages/Recommendations';
import './index.css';

function App() {
  const [activePage, setActivePage] = useState('overview');
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setMeta(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard stats", err);
        setLoading(false);
      });
  }, []);

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart2, section: 'Overview' },
    { id: 'eda', label: 'EDA Insights', icon: Search, section: 'Overview' },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb, section: 'Overview' },
    { id: 'performance', label: 'Performance', icon: TrendingUp, section: 'Model' },
    { id: 'features', label: 'Feature Importance', icon: Settings, section: 'Model' },
    { id: 'predictor', label: 'Live Predictor', icon: Target, section: 'Model' },
    { id: 'monitoring', label: 'Model Monitoring', icon: Activity, section: 'Pipeline' },
    { id: 'pipeline', label: 'MLOps Pipeline', icon: GitMerge, section: 'Pipeline' },
  ];

  if (loading || !meta) {
    return <div style={{display:'flex', height:'100vh', justifyContent:'center', alignItems:'center'}}>Loading ML Backend...</div>;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="label">ML Project</div>
          <div className="title">Attrition<br/>Prediction</div>
          <div className="version">IBM HR · v1.0.0</div>
        </div>
        <nav>
          <div className="nav-section">Overview</div>
          {navItems.filter(i => i.section === 'Overview').map(item => (
            <div key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={() => setActivePage(item.id)}>
              <span className="icon"><item.icon size={16} /></span> {item.label}
            </div>
          ))}
          <div className="nav-section">Model</div>
          {navItems.filter(i => i.section === 'Model').map(item => (
            <div key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={() => setActivePage(item.id)}>
              <span className="icon"><item.icon size={16} /></span> {item.label}
            </div>
          ))}
          <div className="nav-section">Pipeline</div>
          {navItems.filter(i => i.section === 'Pipeline').map(item => (
            <div key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={() => setActivePage(item.id)}>
              <span className="icon"><item.icon size={16} /></span> {item.label}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          Logistic Regression (Tuned)<br/>Train: 1,972 · Test: 294
        </div>
      </aside>
      <main className="main">
        {activePage === 'overview' && <Overview meta={meta} />}
        {activePage === 'eda' && <EDA />}
        {activePage === 'recommendations' && <Recommendations />}
        {activePage === 'performance' && <Performance meta={meta} />}
        {activePage === 'features' && <Features meta={meta} />}
        {activePage === 'predictor' && <Predictor />}
        {activePage === 'monitoring' && <Monitoring />}
        {activePage === 'pipeline' && <Pipeline />}
      </main>
    </div>
  );
}

export default App;
