import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell, Legend } from 'recharts';
import { Activity, Zap, ShieldCheck, Clock } from 'lucide-react';

export default function Monitoring() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/monitoring')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch monitoring data", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return <div style={{display:'flex', height:'100%', justifyContent:'center', alignItems:'center'}}>Initializing System Monitor...</div>;
  }

  const sysData = data.system.cpu.map((cpu, i) => ({
    time: data.system.labels[i],
    cpu: cpu,
    memory: data.system.memory[i]
  }));

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">System Health & Model Monitoring</div>
          <div className="page-subtitle">Real-time stability, drift detection, and infrastructure telemetry</div>
        </div>
        <div className="badge pulse">Live Monitoring</div>
      </div>

      {/* Health Indicator Cards */}
      <div className="cards-4">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--green)', padding: '12px', borderRadius: '12px' }}>
            <Activity size={24} />
          </div>
          <div>
            <div className="card-title" style={{ marginBottom: '2px' }}>Model Status</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--green)' }}>{data.status}</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--blue)', padding: '12px', borderRadius: '12px' }}>
            <Zap size={24} />
          </div>
          <div>
            <div className="card-title" style={{ marginBottom: '2px' }}>Avg Latency</div>
            <div style={{ fontSize: '18px', fontWeight: '700' }}>{data.latency}</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--purple)', padding: '12px', borderRadius: '12px' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="card-title" style={{ marginBottom: '2px' }}>Predictions (24h)</div>
            <div style={{ fontSize: '18px', fontWeight: '700' }}>{data.requests_24h.toLocaleString()}</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber)', padding: '12px', borderRadius: '12px' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="card-title" style={{ marginBottom: '2px' }}>Uptime</div>
            <div style={{ fontSize: '18px', fontWeight: '700' }}>{data.uptime}</div>
          </div>
        </div>
      </div>

      <div className="cards-2">
        {/* Prediction Drift */}
        <div className="card">
          <div className="section-title" style={{ fontSize: '16px', marginBottom: '15px' }}>Prediction Distribution Drift</div>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.drift.prediction_drift} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="training" name="Training (Baseline %)" fill="var(--muted)" opacity={0.3} radius={[4, 4, 0, 0]} />
                <Bar dataKey="serving" name="Serving (Real-time %)" fill="var(--blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card-sub mono" style={{ marginTop: '10px' }}>Baseline: IBM HR Training Set · Serving: Last 1,000 requests</div>
        </div>

        {/* System Telemetry */}
        <div className="card">
          <div className="section-title" style={{ fontSize: '16px', marginBottom: '15px' }}>Infrastructure Telemetry</div>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sysData}>
                 <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--red)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--red)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--teal)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="cpu" name="CPU Usage (%)" stroke="var(--red)" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                <Area type="monotone" dataKey="memory" name="Memory (%)" stroke="var(--teal)" fillOpacity={1} fill="url(#colorMem)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card-sub mono" style={{ marginTop: '10px' }}>Real-time node resource utilization</div>
        </div>
      </div>

      <div className="section-title">🛡️ Feature Mean Stability & Quality</div>
      <div className="card" style={{ marginBottom: '24px' }}>
         <div className="table-wrap">
          <table style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
            <thead>
              <tr style={{ background: '#fcfdfe' }}>
                <th style={{ padding: '16px 20px' }}>Monitored Feature</th>
                <th>PSI / Drift Score</th>
                <th>Integrity</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {data.drift.feature_drift.map((f, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '16px 20px' }}><strong>{f.feature}</strong></td>
                  <td className="mono">{f.drift_score.toFixed(3)}</td>
                  <td>100% Valid</td>
                  <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                    <span className={`pill pill-${f.status === 'Stable' ? 'green' : 'amber'}`} style={{ fontWeight: '600' }}>{f.status.toUpperCase()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-title">📈 Model Performance History (Versioning)</div>
      <div className="card">
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.performance_history} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="version" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
              <YAxis domain={[0.7, 0.9]} axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
              <Line type="monotone" dataKey="accuracy" name="Accuracy Index" stroke="var(--blue)" strokeWidth={3} dot={{ r: 6, fill: 'var(--blue)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="recall" name="Recall Index" stroke="var(--ink)" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card-sub mono" style={{ marginTop: '10px' }}>Comparative benchmarks across model lifecycle versions</div>
      </div>
    </div>
  );
}
