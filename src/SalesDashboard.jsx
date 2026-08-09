import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

// ---- Sample data (exactly what your Postman call returned) ----
const SAMPLE = [
  {
    daily_metrics: [
      { order_date: "2026-05-01", no_of_sales: 23, total_revenue: 19980.5 },
      { order_date: "2026-05-02", no_of_sales: 28, total_revenue: 20654.1 },
      { order_date: "2026-05-03", no_of_sales: 12, total_revenue: 8888.11 },
      { order_date: "2026-05-04", no_of_sales: 29, total_revenue: 21161.8 },
      { order_date: "2026-05-05", no_of_sales: 31, total_revenue: 23525.3 },
      { order_date: "2026-05-06", no_of_sales: 12, total_revenue: 10566.3 },
      { order_date: "2026-05-07", no_of_sales: 13, total_revenue: 14167.3 },
      { order_date: "2026-05-08", no_of_sales: 28, total_revenue: 21654.4 },
      { order_date: "2026-05-09", no_of_sales: 45, total_revenue: 29907.3 },
      { order_date: "2026-05-10", no_of_sales: 33, total_revenue: 24565.5 },
      { order_date: "2026-05-11", no_of_sales: 34, total_revenue: 22671.2 },
      { order_date: "2026-05-12", no_of_sales: 45, total_revenue: 32900 },
      { order_date: "2026-05-13", no_of_sales: 26, total_revenue: 22055.4 },
      { order_date: "2026-05-14", no_of_sales: 31, total_revenue: 26763.1 },
      { order_date: "2026-05-15", no_of_sales: 48, total_revenue: 34810.2 },
      { order_date: "2026-05-16", no_of_sales: 43, total_revenue: 41202.6 },
      { order_date: "2026-05-17", no_of_sales: 28, total_revenue: 22494.6 },
      { order_date: "2026-05-18", no_of_sales: 24, total_revenue: 24895.7 },
      { order_date: "2026-05-19", no_of_sales: 27, total_revenue: 20215 },
      { order_date: "2026-05-20", no_of_sales: 34, total_revenue: 29006.4 },
      { order_date: "2026-05-21", no_of_sales: 41, total_revenue: 30975.2 },
      { order_date: "2026-05-22", no_of_sales: 30, total_revenue: 24670.6 },
      { order_date: "2026-05-23", no_of_sales: 39, total_revenue: 28604.9 },
      { order_date: "2026-05-24", no_of_sales: 31, total_revenue: 25720.5 },
      { order_date: "2026-05-25", no_of_sales: 44, total_revenue: 47642.8 },
    ],
    monthly_metrics: [
      { year: 2026, month: 1, no_of_sales: 322 },
      { year: 2026, month: 2, no_of_sales: 402 },
      { year: 2026, month: 3, no_of_sales: 464 },
      { year: 2026, month: 4, no_of_sales: 673 },
      { year: 2026, month: 5, no_of_sales: 970 },
    ],
    kpi_cards: [
      {
        PM_SALES: 673,
        mtd_sales: 779,
        PMSD_SALES: 540,
        PM_REVENUE: 459264,
        MTD_REVENUE: 629703,
        TODAY_SALES: 44,
        PMSD_REVENUE: 361152,
        TODAY_REVENUE: 47642.8,
      },
    ],
    leaderboard_metrics: [
      { mtd_sales: 231, mtd_revenue: 177317, today_sales: 10, today_revenue: 7925.06, sales_representative: "Faizan" },
      { mtd_sales: 118, mtd_revenue: 97715, today_sales: 5, today_revenue: 4572.02, sales_representative: "Prabhat" },
      { mtd_sales: 115, mtd_revenue: 103473, today_sales: 12, today_revenue: 19498.5, sales_representative: "Talha" },
      { mtd_sales: 110, mtd_revenue: 83573.2, today_sales: 3, today_revenue: 1777.12, sales_representative: "Sanika" },
      { mtd_sales: 84, mtd_revenue: 64813.1, today_sales: 4, today_revenue: 4488.14, sales_representative: "Bhageshri" },
      { mtd_sales: 71, mtd_revenue: 59612.4, today_sales: 8, today_revenue: 7265.06, sales_representative: "Nidhi" },
      { mtd_sales: 49, mtd_revenue: 42263.7, today_sales: 2, today_revenue: 2116.95, sales_representative: "Karishma" },
      { mtd_sales: 1, mtd_revenue: 931.36, today_sales: 0, today_revenue: 0, sales_representative: "Rahul" },
    ],
  },
];

const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const BAR_COLORS = ["#E60023", "#F43F5E", "#FB923C", "#F87171", "#78716C", "#A8A29E", "#52525B", "#E4E4E7"];

function fmtINR(n) {
  if (n === undefined || n === null) return "-";
  return "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
function fmtNum(n) {
  if (n === undefined || n === null) return "-";
  return Number(n).toLocaleString("en-IN");
}
function pctChange(curr, prev) {
  if (!prev) return null;
  return ((curr - prev) / prev) * 100;
}
function shortDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function KpiCard({ label, value, sub, deltaPct }) {
  const up = deltaPct !== null && deltaPct !== undefined && deltaPct >= 0;
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub-row">
        {sub && <span className="kpi-sub">{sub}</span>}
        {deltaPct !== null && deltaPct !== undefined && (
          <span className={"kpi-delta " + (up ? "up" : "down")}>
            {up ? "▲" : "▼"} {Math.abs(deltaPct).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, money }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="tooltip-box">
      <div className="tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="tooltip-row" style={{ color: p.color }}>
          {p.name}: {money && p.dataKey === "total_revenue" ? fmtINR(p.value) : fmtNum(p.value)}
        </div>
      ))}
    </div>
  );
}

export default function SalesDashboard() {
  const [raw, setRaw] = useState(SAMPLE);
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usingLive, setUsingLive] = useState(false);

  const data = raw[0];

  const kpi = data.kpi_cards[0];
  const salesDelta = useMemo(() => pctChange(kpi.MTD_REVENUE, kpi.PM_REVENUE), [kpi]);
  const salesCountDelta = useMemo(() => pctChange(kpi.mtd_sales, kpi.PM_SALES), [kpi]);
  const todayVsPmsd = useMemo(() => pctChange(kpi.TODAY_REVENUE, kpi.PMSD_REVENUE), [kpi]);

  const monthlyChartData = useMemo(
    () =>
      data.monthly_metrics.map((m) => ({
        label: MONTH_NAMES[m.month] + " " + m.year,
        no_of_sales: m.no_of_sales,
      })),
    [data]
  );

  const dailyChartData = useMemo(
    () =>
      data.daily_metrics.map((d) => ({
        ...d,
        label: shortDate(d.order_date),
      })),
    [data]
  );

  const leaderboardSorted = useMemo(
    () => [...data.leaderboard_metrics].sort((a, b) => b.mtd_revenue - a.mtd_revenue),
    [data]
  );

  async function fetchLive() {
    setLoading(true);
    setError("");
    try {
      const headers = {
        "Content-Type": "application/json",
        apikey: apiKey,
      };
      if (apiKey.startsWith("eyJ")) {
        headers["Authorization"] = "Bearer " + apiKey;
      }
      const res = await fetch(
        "https://tvhvzgkabuynenzofbpn.supabase.co/rest/v1/rpc/get_sales_dashboard",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({}),
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`);
      }
      const json = await res.json();
      const arr = Array.isArray(json) ? json : [json];
      if (!arr[0] || !arr[0].kpi_cards) throw new Error("Unexpected response shape from endpoint.");
      setRaw(arr);
      setUsingLive(true);
    } catch (e) {
      setError(e.message || "Fetch failed. Check your API key and network/CORS settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dash-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .dash-root {
          --bg: #F0F2F5;
          --panel: #FFFFFF;
          --panel-hover: #FFFFFF;
          --panel-border: rgba(0, 0, 0, 0.04);
          --panel-border-hover: rgba(0, 0, 0, 0.08);
          --text: #111111;
          --text-dim: #767676;
          --accent: #E60023;
          --accent-hover: #AD081B;
          --accent-glow: rgba(230, 0, 35, 0.06);
          --accent2: #111111;
          --up: #258D19;
          --down: #E60023;

          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: var(--bg);
          color: var(--text);
          padding: 40px;
          border-radius: 0;
          min-height: 100vh;
          box-sizing: border-box;
        }
        .dash-root * { box-sizing: border-box; }
        
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .dash-title {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dash-subtitle {
          font-size: 14px;
          color: var(--text-dim);
          margin-top: 6px;
          font-weight: 500;
        }
        .live-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(37, 141, 25, 0.08);
          color: var(--up);
          border: 1px solid rgba(37, 141, 25, 0.15);
        }

        .settings-btn {
          background: #E9E9E9;
          border: none;
          color: var(--text);
          padding: 12px 20px;
          border-radius: 24px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .settings-btn:hover {
          background: #E2E2E2;
          transform: scale(1.02);
        }
        
        .settings-panel {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 32px;
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }
        .settings-panel input {
          flex: 1;
          min-width: 280px;
          background: #FFFFFF;
          border: 2px solid #CDCDCD;
          color: var(--text);
          padding: 12px 18px;
          border-radius: 20px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
          font-weight: 500;
        }
        .settings-panel input:focus {
          border-color: var(--text);
        }
        .fetch-btn {
          background: var(--accent);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 24px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .fetch-btn:hover:not(:disabled) {
          background: var(--accent-hover);
          transform: scale(1.02);
        }
        .fetch-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .error-text {
          color: var(--down);
          font-size: 13px;
          font-weight: 600;
          width: 100%;
          margin-top: 6px;
        }
        .hint-text {
          color: var(--text-dim);
          font-size: 12px;
          width: 100%;
          line-height: 1.6;
          margin-top: 8px;
        }

        .kpi-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }
        .kpi-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03);
          transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.25s ease;
        }
        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }
        .kpi-label {
          font-size: 12px;
          color: var(--text-dim);
          margin-bottom: 8px;
          text-transform: none;
          letter-spacing: normal;
          font-weight: 600;
        }
        .kpi-value {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text);
        }
        .kpi-sub-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          font-size: 13px;
        }
        .kpi-sub {
          font-size: 12px;
          color: var(--text-dim);
          font-weight: 500;
        }
        .kpi-delta {
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 2px 8px;
          border-radius: 12px;
        }
        .kpi-delta.up { color: var(--up); background: rgba(37, 141, 25, 0.08); }
        .kpi-delta.down { color: var(--down); background: rgba(230, 0, 35, 0.08); }

        .panel {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03);
          transition: box-shadow 0.25s ease;
        }
        .panel:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }
        .panel-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
          color: var(--text);
        }
        
        .grid-2 {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 24px;
        }
        @media (max-width: 960px) {
          .grid-2 { grid-template-columns: 1fr; }
        }

        .tooltip-box {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          color: var(--text);
        }
        .tooltip-label {
          color: var(--text-dim);
          margin-bottom: 4px;
          font-weight: 700;
        }
        .tooltip-row {
          font-weight: 700;
          margin-top: 3px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        th {
          text-align: left;
          color: var(--text-dim);
          font-weight: 600;
          padding: 12px 16px;
          border-bottom: 2px solid #F0F2F5;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        td {
          padding: 14px 16px;
          border-bottom: 1px solid #F0F2F5;
          color: var(--text);
          font-weight: 500;
        }
        tr {
          transition: background-color 0.2s ease;
        }
        tr:hover td {
          background: #FAFAFA;
        }
        tr:last-child td {
          border-bottom: none;
        }
        .rank-cell {
          color: var(--text-dim);
          width: 40px;
          font-weight: 700;
        }
        .rep-cell {
          font-weight: 700;
          color: var(--text);
        }
        .num-cell {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <div className="dash-header">
        <div>
          <div className="dash-title">
            Sales Dashboard
            {usingLive && <span className="live-tag">● Live data</span>}
          </div>
          <div className="dash-subtitle">get_sales_dashboard · Supabase RPC</div>
        </div>
        <button className="settings-btn" onClick={() => setShowSettings((s) => !s)}>
          {showSettings ? "Hide" : "Connect live data"}
        </button>
      </div>

      {showSettings && (
        <div className="settings-panel">
          <input
            type="password"
            placeholder="Paste Supabase anon/API key here"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button className="fetch-btn" onClick={fetchLive} disabled={loading || !apiKey}>
            {loading ? "Fetching..." : "Fetch live"}
          </button>
          {error && <div className="error-text">{error}</div>}
          <div className="hint-text">
            This is the same header Postman sends as "apikey" (and "Authorization: Bearer ...").
            Find it in Supabase → Project Settings → API → anon public key. It never leaves your browser.
          </div>
        </div>
      )}

      <div className="kpi-row">
        <KpiCard label="MTD Sales" value={fmtNum(kpi.mtd_sales)} sub={`Prev month: ${fmtNum(kpi.PM_SALES)}`} deltaPct={salesCountDelta} />
        <KpiCard label="MTD Revenue" value={fmtINR(kpi.MTD_REVENUE)} sub={`Prev month: ${fmtINR(kpi.PM_REVENUE)}`} deltaPct={salesDelta} />
        <KpiCard label="Today's Sales" value={fmtNum(kpi.TODAY_SALES)} sub="orders today" />
        <KpiCard label="Today's Revenue" value={fmtINR(kpi.TODAY_REVENUE)} sub={`vs same day last month`} deltaPct={todayVsPmsd} />
        <KpiCard label="Prev Month Same Day" value={fmtNum(kpi.PMSD_SALES)} sub={fmtINR(kpi.PMSD_REVENUE)} />
      </div>

      <div className="panel">
        <div className="panel-title">Daily Sales & Revenue — May 2026</div>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={dailyChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "var(--text-dim)", fontSize: 11 }} interval={2} axisLine={{ stroke: "var(--panel-border)" }} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip money />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-dim)", paddingTop: 10 }} />
            <Bar yAxisId="left" dataKey="no_of_sales" name="Orders" fill="var(--accent)" radius={[4, 4, 0, 0]} barSize={14} />
            <Line yAxisId="right" type="monotone" dataKey="total_revenue" name="Revenue" stroke="var(--accent2)" strokeWidth={2.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-title">Monthly Sales Trend</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "var(--text-dim)", fontSize: 12 }} axisLine={{ stroke: "var(--panel-border)" }} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="no_of_sales" name="Orders" radius={[6, 6, 0, 0]} barSize={38}>
                {monthlyChartData.map((_, i) => (
                  <Cell key={i} fill={i === monthlyChartData.length - 1 ? "var(--accent)" : "rgba(0, 102, 255, 0.12)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <div className="panel-title">Top Reps — MTD Revenue</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart layout="vertical" data={leaderboardSorted} margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "var(--text-dim)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="sales_representative" width={70} tick={{ fill: "var(--text)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip money />} />
              <Bar dataKey="mtd_revenue" name="Revenue" radius={[0, 6, 6, 0]} barSize={16}>
                {leaderboardSorted.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Leaderboard</div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Representative</th>
              <th style={{ textAlign: "right" }}>MTD Sales</th>
              <th style={{ textAlign: "right" }}>MTD Revenue</th>
              <th style={{ textAlign: "right" }}>Today Sales</th>
              <th style={{ textAlign: "right" }}>Today Revenue</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardSorted.map((r, i) => (
              <tr key={r.sales_representative}>
                <td className="rank-cell">{i + 1}</td>
                <td className="rep-cell">{r.sales_representative.trim()}</td>
                <td className="num-cell">{fmtNum(r.mtd_sales)}</td>
                <td className="num-cell">{fmtINR(r.mtd_revenue)}</td>
                <td className="num-cell">{fmtNum(r.today_sales)}</td>
                <td className="num-cell">{fmtINR(r.today_revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
