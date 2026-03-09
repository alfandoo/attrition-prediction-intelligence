import { useState } from "react";

export default function Predictor() {
  const [formData, setFormData] = useState({
    income: 5000,
    age: 32,
    exp: 5,
    tenure: 3,
    dist: 10,
    jobsat: 3,
    wlb: 3,
    ot: 0,
    travel: 1,
    stock: 1,
    marital: 1,
    companies: 2,
    daily_rate: 800,
    manager_tenure: 2,
    role_tenure: 2,
    env_sat: 3,
    rel_sat: 3,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      income: 5000,
      age: 32,
      exp: 5,
      tenure: 3,
      dist: 10,
      jobsat: 3,
      wlb: 3,
      ot: 0,
      travel: 1,
      stock: 1,
      marital: 1,
      companies: 2,
      daily_rate: 800,
      manager_tenure: 2,
      role_tenure: 2,
      env_sat: 3,
      rel_sat: 3,
    });
    setResult(null);
  };

  const applyPreset = (type) => {
    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    let data = {};
    if (type === "low") {
      data = {
        income: rnd(8000, 15000),
        age: rnd(40, 55),
        exp: rnd(15, 25),
        tenure: rnd(10, 15),
        dist: rnd(1, 5),
        jobsat: 4,
        wlb: 4,
        ot: 0,
        travel: 0,
        stock: rnd(1, 3),
        marital: 0,
        companies: rnd(1, 2),
        daily_rate: rnd(1000, 1500),
        manager_tenure: rnd(7, 12),
        role_tenure: rnd(6, 10),
        env_sat: 4,
        rel_sat: 4,
      };
    } else if (type === "mid") {
      data = {
        income: rnd(4000, 5500),
        age: rnd(28, 38),
        exp: rnd(5, 9),
        tenure: rnd(3, 6),
        dist: rnd(10, 15),
        jobsat: rnd(2, 3),
        wlb: rnd(2, 3),
        ot: rnd(0, 1),
        travel: rnd(0, 1),
        stock: rnd(0, 1),
        marital: rnd(0, 1),
        companies: rnd(2, 4),
        daily_rate: rnd(600, 900),
        manager_tenure: rnd(2, 4),
        role_tenure: rnd(2, 4),
        env_sat: rnd(2, 3),
        rel_sat: rnd(2, 3),
      };
    } else if (type === "high") {
      data = {
        income: rnd(1500, 2500),
        age: rnd(19, 25),
        exp: rnd(1, 3),
        tenure: rnd(0, 1),
        dist: rnd(20, 29),
        jobsat: 1,
        wlb: 1,
        ot: 1,
        travel: 2,
        stock: 0,
        marital: 1,
        companies: rnd(3, 5),
        daily_rate: rnd(300, 500),
        manager_tenure: rnd(0, 1),
        role_tenure: rnd(0, 1),
        env_sat: 1,
        rel_sat: 1,
      };
    }
    setFormData(data);
    setResult(null);
  };

  const runPredict = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await resp.json();
      console.log("DEBUG: Received prediction response:", data);

      if (data.error) throw new Error(data.error);

      const prob = data.probability;
      const pct = Math.round(prob * 100);
      setResult({
        score: prob,
        pct,
        factors: data.factors || [],
        mode: data.mode || "risk",
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error(err);
      alert(
        "Failed to connect to ML Backend. Please ensure the FastAPI server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active">
      <div
        className="page-header"
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          padding: "32px",
          borderRadius: "16px",
          color: "white",
          marginBottom: "32px",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div>
          <div
            className="badge"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              marginBottom: "12px",
            }}
          >
            Risk Simulation Engine
          </div>
          <div
            className="page-title"
            style={{ color: "white", fontSize: "28px" }}
          >
            Live Predictor
          </div>
          <div
            className="page-subtitle"
            style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}
          >
            Enter employee parameters to simulate attrition risk in real-time.
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignSelf: "center" }}>
          <button
            onClick={() => applyPreset("low")}
            className="preset-btn low"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "var(--green)",
            }}
          >
            Low Risk
          </button>
          <button
            onClick={() => applyPreset("mid")}
            className="preset-btn mid"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "var(--amber)",
            }}
          >
            Mid Risk
          </button>
          <button
            onClick={() => applyPreset("high")}
            className="preset-btn high"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "var(--red)",
            }}
          >
            High Risk
          </button>
          <button
            onClick={resetForm}
            className="preset-btn reset"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "none",
              color: "white",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Group 1: Employee Basics */}
          <div className="card">
            <div
              className="section-title"
              style={{ fontSize: "12px", color: "var(--blue)" }}
            >
              👤 Employee Profile & Career
            </div>
            <div
              className="form-grid"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            >
              <div className="form-group">
                <label>Monthly Income (USD)</label>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Daily Rate (USD)</label>
                <input
                  type="number"
                  name="daily_rate"
                  value={formData.daily_rate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Total Career Years</label>
                <input
                  type="number"
                  name="exp"
                  value={formData.exp}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Years at Company</label>
                <input
                  type="number"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Marital Status</label>
                <select
                  name="marital"
                  value={formData.marital}
                  onChange={handleChange}
                >
                  <option value={1}>Single</option>
                  <option value={0}>Married / Divorced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Group 2: Work-Life & Intensity */}
          <div className="card">
            <div
              className="section-title"
              style={{ fontSize: "12px", color: "var(--red)" }}
            >
              ⚡ Work-Life Intensity
            </div>
            <div
              className="form-grid"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            >
              <div className="form-group">
                <label>Overtime</label>
                <select name="ot" value={formData.ot} onChange={handleChange}>
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label>Business Travel</label>
                <select
                  name="travel"
                  value={formData.travel}
                  onChange={handleChange}
                >
                  <option value={0}>Non-Travel</option>
                  <option value={1}>Travel Rarely</option>
                  <option value={2}>Travel Frequently</option>
                </select>
              </div>
              <div className="form-group">
                <label>Distance from Home (km)</label>
                <input
                  type="number"
                  name="dist"
                  value={formData.dist}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Stock Option Level (0-3)</label>
                <select
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                >
                  <option value={0}>0 — None</option>
                  <option value={1}>1 — Low</option>
                  <option value={2}>2 — Medium</option>
                  <option value={3}>3 — High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Group 3: Sentiments */}
          <div className="card">
            <div
              className="section-title"
              style={{ fontSize: "12px", color: "var(--purple)" }}
            >
              🧠 Satisfaction Sentiments
            </div>
            <div
              className="form-grid"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            >
              <div className="form-group">
                <label>Job Satisfaction</label>
                <select
                  name="jobsat"
                  value={formData.jobsat}
                  onChange={handleChange}
                >
                  <option value={4}>Very High</option>
                  <option value={3}>High</option>
                  <option value={2}>Medium</option>
                  <option value={1}>Low</option>
                </select>
              </div>
              <div className="form-group">
                <label>Environment Sat.</label>
                <select
                  name="env_sat"
                  value={formData.env_sat}
                  onChange={handleChange}
                >
                  <option value={4}>Very High</option>
                  <option value={3}>High</option>
                  <option value={2}>Medium</option>
                  <option value={1}>Low</option>
                </select>
              </div>
              <div className="form-group">
                <label>Work-Life Balance</label>
                <select name="wlb" value={formData.wlb} onChange={handleChange}>
                  <option value={4}>Best</option>
                  <option value={3}>Better</option>
                  <option value={2}>Good</option>
                  <option value={1}>Bad</option>
                </select>
              </div>
              <div className="form-group">
                <label>Companies Worked</label>
                <input
                  type="number"
                  name="companies"
                  value={formData.companies}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "sticky",
            top: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            className="card"
            style={{
              background: "var(--ink)",
              border: "none",
              color: "white",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "20px",
              }}
            >
              Diagnostics
            </div>
            <button
              className="predict-btn"
              onClick={runPredict}
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: loading ? "rgba(255,255,255,0.1)" : "var(--teal)",
                fontSize: "16px",
              }}
            >
              {loading ? "⏳ Analyzing Data..." : "🎯 Run Prediction"}
            </button>
          </div>

          {result && (
            <div
              className="card"
              style={{
                padding: "0",
                overflow: "hidden",
                border: "none",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <div
                style={{
                  background:
                    result.score >= 0.7
                      ? "var(--red)"
                      : result.score >= 0.4
                        ? "var(--amber)"
                        : "var(--green)",
                  padding: "24px",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    opacity: 0.8,
                    marginBottom: "8px",
                  }}
                >
                  Attrition Probability
                </div>
                <div style={{ fontSize: "48px", fontWeight: 800 }}>
                  {result.pct}%
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    marginTop: "8px",
                    background: "rgba(0,0,0,0.1)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    display: "inline-block",
                  }}
                >
                  {result.score >= 0.7
                    ? "HIGH RISK"
                    : result.score >= 0.4
                      ? "MEDIUM RISK"
                      : "LOW RISK"}
                </div>
              </div>
              <div style={{ padding: "24px" }}>
                <div className="section-title" style={{ fontSize: "11px" }}>
                  Strategic Insight
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--muted)",
                    lineHeight: "1.6",
                  }}
                >
                  {result.score >= 0.7
                    ? "Immediate personal intervention from HR and Management is required."
                    : result.score >= 0.4
                      ? "Regular review of work-life balance and satisfaction is recommended."
                      : "Employee shows stable loyalty patterns based on current profile parameters."}
                </p>

                <div
                  className="section-title"
                  style={{ fontSize: "11px", marginTop: "24px" }}
                >
                  Top Factors
                </div>
                <div className="insight-list" style={{ gap: "8px" }}>
                  {result.factors.slice(0, 3).map((f, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "8px",
                        padding: "10px",
                        background: "var(--surface2)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    >
                      <span
                        style={{
                          color:
                            f.type === "stay" ? "var(--green)" : "var(--red)",
                        }}
                      >
                        {f.type === "stay" ? "▲" : "▼"}
                      </span>
                      <span style={{ fontWeight: 600 }}>{f.f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
