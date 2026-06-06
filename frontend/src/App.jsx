import { useState, useEffect, useRef, useCallback } from "react";

// ─── EMBEDDED GRAPH DATA (Bengaluru) ─────────────────────────────────────────
const GRAPH_NODES = [
  { id: "KIA",            name: "Kempegowda Intl Airport", lat: 13.1989, lng: 77.7068 },
  { id: "YELAHANKA",      name: "Yelahanka",                lat: 13.1007, lng: 77.5963 },
  { id: "HEBBAL",         name: "Hebbal",                   lat: 13.0350, lng: 77.5970 },
  { id: "MANYATA",        name: "Manyata Tech Park",        lat: 13.0475, lng: 77.6200 },
  { id: "WHITEFIELD",     name: "Whitefield",               lat: 12.9698, lng: 77.7500 },
  { id: "MARATHALLI",     name: "Marathahalli",             lat: 12.9591, lng: 77.6974 },
  { id: "KORAMANGALA",    name: "Koramangala",              lat: 12.9352, lng: 77.6245 },
  { id: "BTM",            name: "BTM Layout",               lat: 12.9165, lng: 77.6101 },
  { id: "JAYANAGAR",      name: "Jayanagar",                lat: 12.9250, lng: 77.5938 },
  { id: "MAJESTIC",       name: "Majestic (KBS)",           lat: 12.9767, lng: 77.5713 },
  { id: "MG_ROAD",        name: "MG Road",                  lat: 12.9753, lng: 77.6083 },
  { id: "INDIRANAGAR",    name: "Indiranagar",              lat: 12.9784, lng: 77.6408 },
  { id: "ELECTRONIC_CITY",name: "Electronic City",          lat: 12.8399, lng: 77.6770 },
  { id: "HSR",            name: "HSR Layout",               lat: 12.9116, lng: 77.6389 },
  { id: "SILK_BOARD",     name: "Silk Board Junction",      lat: 12.9172, lng: 77.6227 },
  { id: "BELLANDUR",      name: "Bellandur",                lat: 12.9344, lng: 77.6784 },
  { id: "SARJAPUR",       name: "Sarjapur Road",            lat: 12.9010, lng: 77.6966 },
  { id: "BANNERGHATTA",   name: "Bannerghatta Road",        lat: 12.8933, lng: 77.5975 },
  { id: "JP_NAGAR",       name: "JP Nagar",                 lat: 12.9074, lng: 77.5854 },
  { id: "RAJAJINAGAR",    name: "Rajajinagar",              lat: 12.9904, lng: 77.5518 },
];

const GRAPH_EDGES = [
  { from:"KIA",         to:"YELAHANKA",      dist:15.2, time:22, road:"NH 44 / Bellary Road" },
  { from:"YELAHANKA",   to:"HEBBAL",         dist:10.5, time:20, road:"Bellary Road" },
  { from:"HEBBAL",      to:"MANYATA",        dist:4.2,  time:8,  road:"Outer Ring Road North" },
  { from:"HEBBAL",      to:"MAJESTIC",       dist:9.8,  time:25, road:"Bellary Road" },
  { from:"HEBBAL",      to:"RAJAJINAGAR",    dist:8.1,  time:18, road:"BEL Road" },
  { from:"MANYATA",     to:"WHITEFIELD",     dist:22.3, time:45, road:"Outer Ring Road" },
  { from:"WHITEFIELD",  to:"MARATHALLI",     dist:7.5,  time:18, road:"Whitefield Main Road" },
  { from:"MARATHALLI",  to:"BELLANDUR",      dist:5.8,  time:14, road:"Outer Ring Road East" },
  { from:"BELLANDUR",   to:"SARJAPUR",       dist:6.2,  time:15, road:"Sarjapur ORR" },
  { from:"SARJAPUR",    to:"ELECTRONIC_CITY",dist:8.3,  time:20, road:"Sarjapur Road" },
  { from:"BELLANDUR",   to:"HSR",            dist:5.1,  time:13, road:"Outer Ring Road" },
  { from:"HSR",         to:"SILK_BOARD",     dist:2.3,  time:7,  road:"HSR Layout Road" },
  { from:"MAJESTIC",    to:"MG_ROAD",        dist:4.5,  time:15, road:"Brigade Road" },
  { from:"MG_ROAD",     to:"INDIRANAGAR",    dist:5.2,  time:14, road:"100 Feet Road" },
  { from:"INDIRANAGAR", to:"MARATHALLI",     dist:9.3,  time:22, road:"Old Airport Road" },
  { from:"MG_ROAD",     to:"KORAMANGALA",    dist:5.8,  time:16, road:"Residency Road" },
  { from:"KORAMANGALA", to:"BTM",            dist:3.1,  time:9,  road:"80 Feet Road" },
  { from:"BTM",         to:"SILK_BOARD",     dist:2.8,  time:8,  road:"Hosur Road" },
  { from:"SILK_BOARD",  to:"ELECTRONIC_CITY",dist:14.2, time:30, road:"Hosur Road" },
  { from:"KORAMANGALA", to:"HSR",            dist:3.5,  time:10, road:"27th Main Road" },
  { from:"BTM",         to:"JAYANAGAR",      dist:3.0,  time:9,  road:"Bannerghatta Road" },
  { from:"JAYANAGAR",   to:"JP_NAGAR",       dist:3.4,  time:8,  road:"JP Nagar Link" },
  { from:"JP_NAGAR",    to:"BANNERGHATTA",   dist:5.2,  time:14, road:"Bannerghatta Road" },
  { from:"BANNERGHATTA",to:"ELECTRONIC_CITY",dist:10.5, time:24, road:"Bannerghatta Road Link" },
  { from:"JP_NAGAR",    to:"BTM",            dist:4.1,  time:10, road:"ORR South" },
  { from:"MAJESTIC",    to:"RAJAJINAGAR",    dist:4.2,  time:14, road:"Chord Road" },
  { from:"RAJAJINAGAR", to:"HEBBAL",         dist:8.1,  time:18, road:"BEL Road" },
  { from:"MANYATA",     to:"INDIRANAGAR",    dist:7.6,  time:18, road:"New BEL Road" },
  { from:"WHITEFIELD",  to:"SARJAPUR",       dist:14.1, time:32, road:"Whitefield Sarjapur Road" },
  { from:"MARATHALLI",  to:"KORAMANGALA",    dist:9.2,  time:22, road:"Intermediate Ring Road" },
  { from:"MAJESTIC",    to:"JAYANAGAR",      dist:7.5,  time:20, road:"Mysore Road Link" },
];

const POPULAR_ROUTES = [
  { label:"✈️ Airport → MG Road",         source:"KIA",         destination:"MG_ROAD" },
  { label:"💻 Whitefield → Electronic City", source:"WHITEFIELD",  destination:"ELECTRONIC_CITY" },
  { label:"🚌 Majestic → Koramangala",      source:"MAJESTIC",    destination:"KORAMANGALA" },
  { label:"🏘️ Hebbal → BTM Layout",         source:"HEBBAL",      destination:"BTM" },
  { label:"🍕 Indiranagar → JP Nagar",      source:"INDIRANAGAR", destination:"JP_NAGAR" },
  { label:"🚗 Marathahalli → Silk Board",   source:"MARATHALLI",  destination:"SILK_BOARD" },
];

// ─── GRAPH ALGORITHMS (JS Implementation) ───────────────────────────────────
class RoutePlanner {
  constructor(nodes, edges) {
    this.nodes = {};
    this.adj = {};
    nodes.forEach(n => {
      this.nodes[n.id] = n;
      this.adj[n.id] = [];
    });
    edges.forEach(e => {
      this.adj[e.from].push({ id: e.to,   dist: e.dist, time: e.time, road: e.road });
      this.adj[e.to].push({   id: e.from, dist: e.dist, time: e.time, road: e.road });
    });
  }

  _reconstructPath(parent, src, dst) {
    const path = [];
    let cur = dst;
    while (cur !== null && cur !== undefined) {
      path.push(cur);
      cur = parent[cur];
    }
    path.reverse();
    return path[0] === src ? path : [];
  }

  _routeStats(path) {
    let dist = 0, time = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const edge = this.adj[path[i]].find(e => e.id === path[i+1]);
      if (edge) { dist += edge.dist; time += edge.time; }
    }
    return { dist: Math.round(dist * 10) / 10, time: Math.round(time * 10) / 10 };
  }

  _buildDirections(path) {
    return path.slice(0,-1).map((u, i) => {
      const v = path[i+1];
      const edge = this.adj[u].find(e => e.id === v);
      return { step: i+1, from: this.nodes[u].name, to: this.nodes[v].name,
               road: edge?.road || "", dist: edge?.dist || 0, time: edge?.time || 0 };
    });
  }

  dijkstra(src, dst, weight = "dist") {
    const INF = Infinity;
    const d = {};
    const parent = { [src]: null };
    const visited = new Set();
    const traversal = [];
    Object.keys(this.nodes).forEach(n => d[n] = INF);
    d[src] = 0;

    // Simple priority queue using sorted array
    const heap = [{ cost: 0, node: src }];
    while (heap.length) {
      heap.sort((a, b) => a.cost - b.cost);
      const { cost, node } = heap.shift();
      if (visited.has(node)) continue;
      visited.add(node);
      traversal.push(node);
      if (node === dst) break;
      for (const nb of (this.adj[node] || [])) {
        const w = weight === "dist" ? nb.dist : nb.time;
        if (cost + w < d[nb.id]) {
          d[nb.id] = cost + w;
          parent[nb.id] = node;
          heap.push({ cost: d[nb.id], node: nb.id });
        }
      }
    }
    const path = this._reconstructPath(parent, src, dst);
    const stats = this._routeStats(path);
    return { algorithm: `Dijkstra (${weight === "dist" ? "Shortest Distance" : "Fastest Time"})`,
             path, pathNames: path.map(n => this.nodes[n]?.name), ...stats,
             directions: this._buildDirections(path), traversal, visited: visited.size };
  }

  bfs(src, dst) {
    const visited = new Set([src]);
    const queue = [src];
    const parent = { [src]: null };
    const traversal = [];
    while (queue.length) {
      const cur = queue.shift();
      traversal.push(cur);
      if (cur === dst) break;
      for (const nb of (this.adj[cur] || [])) {
        if (!visited.has(nb.id)) {
          visited.add(nb.id);
          parent[nb.id] = cur;
          queue.push(nb.id);
        }
      }
    }
    const path = this._reconstructPath(parent, src, dst);
    const stats = this._routeStats(path);
    return { algorithm: "BFS (Minimum Hops)", path,
             pathNames: path.map(n => this.nodes[n]?.name), ...stats,
             directions: this._buildDirections(path), traversal, visited: visited.size };
  }

  dfs(src, dst) {
    const visited = new Set();
    const stack = [src];
    const parent = { [src]: null };
    const traversal = [];
    while (stack.length) {
      const cur = stack.pop();
      if (visited.has(cur)) continue;
      visited.add(cur);
      traversal.push(cur);
      if (cur === dst) break;
      for (const nb of (this.adj[cur] || [])) {
        if (!visited.has(nb.id)) {
          if (!(nb.id in parent)) parent[nb.id] = cur;
          stack.push(nb.id);
        }
      }
    }
    const path = this._reconstructPath(parent, src, dst);
    const stats = this._routeStats(path);
    return { algorithm: "DFS (Exploratory)", path,
             pathNames: path.map(n => this.nodes[n]?.name), ...stats,
             directions: this._buildDirections(path), traversal, visited: visited.size };
  }

  compare(src, dst) {
    return {
      dijkstraDist: this.dijkstra(src, dst, "dist"),
      dijkstraTime: this.dijkstra(src, dst, "time"),
      bfs:          this.bfs(src, dst),
      dfs:          this.dfs(src, dst),
    };
  }

  getAdjacency(nodeId) {
    return (this.adj[nodeId] || []).map(nb => ({
      ...nb, name: this.nodes[nb.id]?.name
    }));
  }
}

const planner = new RoutePlanner(GRAPH_NODES, GRAPH_EDGES);

// ─── CANVAS GRAPH VISUALIZATION ─────────────────────────────────────────────
function GraphCanvas({ highlightPath = [], highlightNodes = [] }) {
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const nodePositions = useRef({});

  const project = useCallback((lat, lng, W, H) => {
    const lats = GRAPH_NODES.map(n => n.lat);
    const lngs = GRAPH_NODES.map(n => n.lng);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const pad = 60;
    const x = pad + ((lng - minLng) / (maxLng - minLng)) * (W - 2 * pad);
    const y = H - pad - ((lat - minLat) / (maxLat - minLat)) * (H - 2 * pad);
    return { x, y };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    // background
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, W, H);

    // grid
    ctx.strokeStyle = "rgba(48,54,61,0.4)";
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
    }
    for (let j = 0; j < H; j += 40) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke();
    }

    // Compute positions
    const pos = {};
    GRAPH_NODES.forEach(n => {
      pos[n.id] = project(n.lat, n.lng, W, H);
    });
    nodePositions.current = pos;

    // Draw edges
    GRAPH_EDGES.forEach(e => {
      const a = pos[e.from], b = pos[e.to];
      if (!a || !b) return;
      const isHighlighted = highlightPath.includes(e.from) && highlightPath.includes(e.to) &&
        Math.abs(highlightPath.indexOf(e.from) - highlightPath.indexOf(e.to)) === 1;

      if (isHighlighted) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#00d4aa";
        ctx.strokeStyle = "#00d4aa";
        ctx.lineWidth = 3.5;
      } else {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(99,110,123,0.55)";
        ctx.lineWidth = 1.5;
      }
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // edge weight label for highlighted
      if (isHighlighted) {
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        ctx.fillStyle = "#00d4aa";
        ctx.font = "bold 10px 'Courier New'";
        ctx.fillText(`${e.dist}km`, mx + 4, my - 4);
      }
    });

    // Animated path arrows
    if (highlightPath.length > 1) {
      for (let i = 0; i < highlightPath.length - 1; i++) {
        const a = pos[highlightPath[i]], b = pos[highlightPath[i+1]];
        if (!a || !b) continue;
        const angle = Math.atan2(b.y - a.y, b.x - a.x);
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const arrLen = 9;
        ctx.fillStyle = "#00d4aa";
        ctx.beginPath();
        ctx.moveTo(mx + Math.cos(angle) * arrLen, my + Math.sin(angle) * arrLen);
        ctx.lineTo(mx + Math.cos(angle - 2.4) * arrLen * 0.6, my + Math.sin(angle - 2.4) * arrLen * 0.6);
        ctx.lineTo(mx + Math.cos(angle + 2.4) * arrLen * 0.6, my + Math.sin(angle + 2.4) * arrLen * 0.6);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw nodes
    GRAPH_NODES.forEach(n => {
      const { x, y } = pos[n.id];
      const isPath = highlightPath.includes(n.id);
      const isHighNode = highlightNodes.includes(n.id);
      const isStart = highlightPath[0] === n.id;
      const isEnd = highlightPath[highlightPath.length - 1] === n.id;
      const isHovered = hoveredNode === n.id;

      const r = isStart || isEnd ? 11 : isPath ? 9 : isHovered ? 8 : 6;

      // glow
      if (isPath || isHovered) {
        ctx.shadowBlur = isStart || isEnd ? 22 : 14;
        ctx.shadowColor = isStart ? "#4ade80" : isEnd ? "#f87171" : "#00d4aa";
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);

      if (isStart) ctx.fillStyle = "#4ade80";
      else if (isEnd) ctx.fillStyle = "#f87171";
      else if (isPath) ctx.fillStyle = "#00d4aa";
      else if (isHovered) ctx.fillStyle = "#a78bfa";
      else ctx.fillStyle = "#30363d";

      ctx.fill();
      ctx.shadowBlur = 0;

      // node border
      ctx.strokeStyle = isPath ? "#fff" : "#58a6ff";
      ctx.lineWidth = isPath ? 2 : 1;
      ctx.stroke();

      // label
      ctx.fillStyle = isPath ? "#e6edf3" : "#8b949e";
      ctx.font = isPath ? "bold 10px 'Courier New'" : "10px 'Courier New'";
      ctx.textAlign = "center";
      const label = n.name.split("(")[0].trim();
      ctx.fillText(label.length > 14 ? label.slice(0,13)+"…" : label, x, y + r + 13);
    });

  }, [highlightPath, highlightNodes, hoveredNode, project]);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const pos = nodePositions.current;
    let found = null;
    for (const n of GRAPH_NODES) {
      const p = pos[n.id];
      if (p && Math.hypot(p.x - mx, p.y - my) < 12) {
        found = n.id;
        setTooltip({ x: e.clientX, y: e.clientY, node: n });
        break;
      }
    }
    setHoveredNode(found);
    if (!found) setTooltip(null);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        width={820}
        height={540}
        style={{ width: "100%", borderRadius: "12px", border: "1px solid #30363d", cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setHoveredNode(null); setTooltip(null); }}
      />
      {tooltip && (
        <div style={{
          position: "fixed", left: tooltip.x + 14, top: tooltip.y - 10,
          background: "#161b22", border: "1px solid #30363d", borderRadius: 8,
          padding: "8px 12px", fontSize: 12, color: "#e6edf3", zIndex: 999,
          pointerEvents: "none", maxWidth: 200,
        }}>
          <strong style={{ color: "#58a6ff" }}>{tooltip.node.name}</strong><br />
          <span style={{ color: "#8b949e" }}>ID: {tooltip.node.id}</span><br />
          <span style={{ color: "#8b949e" }}>Neighbors: {planner.getAdjacency(tooltip.node.id).length}</span>
        </div>
      )}
    </div>
  );
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Badge({ children, color = "#00d4aa" }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      fontFamily: "'Courier New', monospace", letterSpacing: 1,
    }}>{children}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#161b22", border: "1px solid #30363d",
      borderRadius: 12, padding: 20, ...style
    }}>{children}</div>
  );
}

function Select({ value, onChange, options, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
      <label style={{ color: "#8b949e", fontSize: 11, fontFamily: "Courier New", letterSpacing: 1 }}>
        {label}
      </label>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{
          background: "#0d1117", border: "1px solid #30363d", borderRadius: 8,
          color: "#e6edf3", padding: "10px 12px", fontSize: 13,
          fontFamily: "'Courier New', monospace", outline: "none", cursor: "pointer",
          appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b949e' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function RouteForm({ onSubmit, mode = "route" }) {
  const [src, setSrc] = useState("KIA");
  const [dst, setDst] = useState("MG_ROAD");
  const [algo, setAlgo] = useState("dijkstra");
  const [weight, setWeight] = useState("dist");

  const locationOptions = GRAPH_NODES.map(n => ({ value: n.id, label: n.name }));

  const handlePreset = (preset) => {
    setSrc(preset.source);
    setDst(preset.destination);
  };

  return (
    <Card style={{ marginBottom: 20 }}>
      <h3 style={{ color: "#58a6ff", marginBottom: 16, fontFamily: "Courier New", fontSize: 14, letterSpacing: 2 }}>
        {mode === "route" ? "▶ FIND ROUTE" : "⚡ COMPARE ALGORITHMS"}
      </h3>

      {/* Popular presets */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: "#8b949e", fontSize: 11, fontFamily: "Courier New", marginBottom: 8, letterSpacing: 1 }}>QUICK ROUTES</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {POPULAR_ROUTES.map(r => (
            <button
              key={r.label}
              onClick={() => handlePreset(r)}
              style={{
                background: src === r.source && dst === r.destination ? "#1f6feb33" : "#161b22",
                border: `1px solid ${src === r.source && dst === r.destination ? "#58a6ff" : "#30363d"}`,
                color: src === r.source && dst === r.destination ? "#58a6ff" : "#8b949e",
                padding: "5px 10px", borderRadius: 20, fontSize: 11, cursor: "pointer",
                fontFamily: "Courier New", transition: "all 0.2s",
              }}
            >{r.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <Select label="SOURCE" value={src} onChange={setSrc} options={locationOptions} />
        <Select label="DESTINATION" value={dst} onChange={setDst} options={locationOptions} />
        {mode === "route" && (
          <>
            <Select label="ALGORITHM" value={algo} onChange={setAlgo} options={[
              { value: "dijkstra", label: "Dijkstra (Optimal)" },
              { value: "bfs",      label: "BFS (Min Hops)" },
              { value: "dfs",      label: "DFS (Exploratory)" },
            ]} />
            {algo === "dijkstra" && (
              <Select label="OPTIMIZE FOR" value={weight} onChange={setWeight} options={[
                { value: "dist", label: "Shortest Distance" },
                { value: "time", label: "Fastest Time" },
              ]} />
            )}
          </>
        )}
      </div>

      <button
        onClick={() => onSubmit({ src, dst, algo, weight })}
        disabled={src === dst}
        style={{
          background: "linear-gradient(135deg, #1f6feb, #00d4aa22)",
          border: "1px solid #1f6feb",
          color: "#e6edf3", padding: "11px 28px",
          borderRadius: 8, fontSize: 13, cursor: src === dst ? "not-allowed" : "pointer",
          fontFamily: "'Courier New', monospace", fontWeight: 700, letterSpacing: 2,
          opacity: src === dst ? 0.5 : 1, transition: "all 0.2s",
        }}
      >
        {mode === "route" ? "FIND ROUTE →" : "RUN ALL ALGORITHMS →"}
      </button>
      {src === dst && <span style={{ color: "#f87171", fontSize: 12, marginLeft: 12 }}>Source ≠ Destination</span>}
    </Card>
  );
}

function RouteResult({ result }) {
  if (!result) return null;
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "ALGORITHM",    value: result.algorithm,     color: "#a78bfa" },
          { label: "DISTANCE",     value: `${result.dist} km`,  color: "#00d4aa" },
          { label: "TIME",         value: `${result.time} min`, color: "#f59e0b" },
        ].map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: 16 }}>
            <div style={{ color: "#8b949e", fontSize: 10, fontFamily: "Courier New", letterSpacing: 1, marginBottom: 6 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: s.label === "ALGORITHM" ? 13 : 22, fontWeight: 700, fontFamily: "Courier New" }}>{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Path sequence */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ color: "#8b949e", fontSize: 11, fontFamily: "Courier New", letterSpacing: 1, marginBottom: 12 }}>ROUTE PATH</div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
          {result.pathNames.map((name, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                background: i === 0 ? "#4ade8022" : i === result.pathNames.length-1 ? "#f8717122" : "#00d4aa11",
                border: `1px solid ${i === 0 ? "#4ade80" : i === result.pathNames.length-1 ? "#f87171" : "#00d4aa44"}`,
                color: i === 0 ? "#4ade80" : i === result.pathNames.length-1 ? "#f87171" : "#e6edf3",
                padding: "4px 10px", borderRadius: 20, fontSize: 12, fontFamily: "Courier New",
              }}>{name}</span>
              {i < result.pathNames.length - 1 && (
                <span style={{ color: "#30363d", fontSize: 16 }}>→</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Turn-by-turn directions */}
      {result.directions && result.directions.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ color: "#8b949e", fontSize: 11, fontFamily: "Courier New", letterSpacing: 1, marginBottom: 12 }}>TURN-BY-TURN DIRECTIONS</div>
          {result.directions.map((d, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
              borderBottom: i < result.directions.length-1 ? "1px solid #21262d" : "none",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "#1f6feb22", border: "1px solid #1f6feb",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#58a6ff", fontSize: 11, fontWeight: 700, fontFamily: "Courier New", flexShrink: 0,
              }}>{d.step}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#e6edf3", fontSize: 13, fontFamily: "Courier New" }}>
                  {d.from} <span style={{ color: "#58a6ff" }}>→</span> {d.to}
                </div>
                <div style={{ color: "#8b949e", fontSize: 11, marginTop: 2 }}>{d.road}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ color: "#00d4aa", fontSize: 12, fontFamily: "Courier New" }}>{d.dist} km</div>
                <div style={{ color: "#f59e0b", fontSize: 11, fontFamily: "Courier New" }}>{d.time} min</div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Traversal order */}
      <Card>
        <div style={{ color: "#8b949e", fontSize: 11, fontFamily: "Courier New", letterSpacing: 1, marginBottom: 8 }}>
          TRAVERSAL ORDER ({result.visited} nodes visited)
        </div>
        <div style={{ color: "#6e7681", fontSize: 11, fontFamily: "Courier New", lineHeight: 1.8 }}>
          {result.traversal.map((n, i) => (
            <span key={i}>
              <span style={{ color: result.path.includes(n) ? "#00d4aa" : "#6e7681" }}>
                {GRAPH_NODES.find(node => node.id === n)?.name.split(" ")[0]}
              </span>
              {i < result.traversal.length-1 && <span style={{ color: "#30363d" }}> → </span>}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ComparePanel({ data }) {
  if (!data) return null;
  const results = [
    { key: "dijkstraDist", label: "🟢 Dijkstra (Distance)", color: "#4ade80" },
    { key: "dijkstraTime", label: "🔵 Dijkstra (Time)",     color: "#58a6ff" },
    { key: "bfs",          label: "🟡 BFS",                 color: "#f59e0b" },
    { key: "dfs",          label: "🟣 DFS",                 color: "#a78bfa" },
  ];

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {results.map(r => {
          const res = data[r.key];
          if (!res) return null;
          return (
            <Card key={r.key}>
              <div style={{ color: r.color, fontFamily: "Courier New", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
                {r.label}
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1, background: "#0d1117", borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
                  <div style={{ color: "#8b949e", fontSize: 10, fontFamily: "Courier New" }}>DISTANCE</div>
                  <div style={{ color: "#00d4aa", fontSize: 18, fontWeight: 700, fontFamily: "Courier New" }}>{res.dist} km</div>
                </div>
                <div style={{ flex: 1, background: "#0d1117", borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
                  <div style={{ color: "#8b949e", fontSize: 10, fontFamily: "Courier New" }}>TIME</div>
                  <div style={{ color: "#f59e0b", fontSize: 18, fontWeight: 700, fontFamily: "Courier New" }}>{res.time} min</div>
                </div>
                <div style={{ flex: 1, background: "#0d1117", borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
                  <div style={{ color: "#8b949e", fontSize: 10, fontFamily: "Courier New" }}>HOPS</div>
                  <div style={{ color: "#a78bfa", fontSize: 18, fontWeight: 700, fontFamily: "Courier New" }}>{res.path.length - 1}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {res.pathNames.map((name, i) => (
                  <span key={i} style={{ color: r.color, fontSize: 10, fontFamily: "Courier New" }}>
                    {name.split(" ")[0]}{i < res.pathNames.length-1 ? " →" : ""}
                  </span>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bar chart comparison */}
      <Card style={{ marginTop: 12 }}>
        <div style={{ color: "#8b949e", fontSize: 11, fontFamily: "Courier New", letterSpacing: 1, marginBottom: 16 }}>
          ALGORITHM COMPARISON CHART
        </div>
        {results.map(r => {
          const res = data[r.key];
          if (!res) return null;
          const maxDist = Math.max(...results.map(x => data[x.key]?.dist || 0));
          const pct = Math.round((res.dist / maxDist) * 100);
          return (
            <div key={r.key} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: r.color, fontSize: 12, fontFamily: "Courier New" }}>{r.label}</span>
                <span style={{ color: "#e6edf3", fontSize: 12, fontFamily: "Courier New" }}>
                  {res.dist}km / {res.time}min
                </span>
              </div>
              <div style={{ background: "#0d1117", borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div style={{
                  background: r.color, height: "100%", width: `${pct}%`,
                  borderRadius: 4, transition: "width 0.8s ease",
                }} />
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function AdjacencyPanel() {
  const [selectedNode, setSelectedNode] = useState("MAJESTIC");
  const neighbors = planner.getAdjacency(selectedNode);

  return (
    <Card>
      <div style={{ color: "#8b949e", fontSize: 11, fontFamily: "Courier New", letterSpacing: 1, marginBottom: 12 }}>
        ADJACENCY LIST VIEWER
      </div>
      <Select
        label="SELECT NODE"
        value={selectedNode}
        onChange={setSelectedNode}
        options={GRAPH_NODES.map(n => ({ value: n.id, label: n.name }))}
      />
      <div style={{ marginTop: 16 }}>
        <div style={{ color: "#58a6ff", fontFamily: "Courier New", fontSize: 13, marginBottom: 8 }}>
          {GRAPH_NODES.find(n => n.id === selectedNode)?.name} → [{neighbors.length} neighbors]
        </div>
        {neighbors.map((nb, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 0", borderBottom: "1px solid #21262d",
          }}>
            <div>
              <span style={{ color: "#00d4aa", fontFamily: "Courier New", fontSize: 12 }}>{nb.name}</span>
              <div style={{ color: "#6e7681", fontSize: 11, marginTop: 2 }}>{nb.road}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ color: "#f59e0b", fontFamily: "Courier New", fontSize: 12 }}>{nb.dist} km</span>
              <span style={{ color: "#8b949e", fontFamily: "Courier New", fontSize: 11, marginLeft: 8 }}>{nb.time} min</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("planner");
  const [routeResult, setRouteResult] = useState(null);
  const [compareResult, setCompareResult] = useState(null);
  const [highlightPath, setHighlightPath] = useState([]);

  const handleRoute = ({ src, dst, algo, weight }) => {
    let result;
    if (algo === "dijkstra") result = planner.dijkstra(src, dst, weight);
    else if (algo === "bfs") result = planner.bfs(src, dst);
    else result = planner.dfs(src, dst);
    setRouteResult(result);
    setHighlightPath(result.path);
  };

  const handleCompare = ({ src, dst }) => {
    const result = planner.compare(src, dst);
    setCompareResult(result);
    setHighlightPath(result.dijkstraDist.path);
  };

  const tabs = [
    { id: "planner", label: "🗺️ Route Planner" },
    { id: "compare", label: "⚡ Compare" },
    { id: "graph",   label: "🕸️ Graph View" },
    { id: "adjacency", label: "📋 Adjacency" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#0d1117", color: "#e6edf3",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        * { box-sizing: border-box; }
        select option { background: #161b22; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "#161b22", borderBottom: "1px solid #30363d",
        padding: "0 32px", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "linear-gradient(135deg, #1f6feb, #00d4aa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>🗺️</div>
          <div>
            <div style={{ color: "#e6edf3", fontWeight: 700, fontSize: 15, letterSpacing: 0.5 }}>
              Intelligent Route Planner
            </div>
            <div style={{ color: "#8b949e", fontSize: 11, fontFamily: "Courier New" }}>
              Graph Algorithms · DSA Project · Bengaluru City
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Badge color="#4ade80">{GRAPH_NODES.length} NODES</Badge>
          <Badge color="#58a6ff">{GRAPH_EDGES.length} EDGES</Badge>
          <Badge color="#a78bfa">DIJKSTRA · BFS · DFS</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: "#161b22", borderBottom: "1px solid #21262d",
        padding: "0 32px", display: "flex", gap: 0,
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: "none", border: "none",
              borderBottom: `2px solid ${tab === t.id ? "#58a6ff" : "transparent"}`,
              color: tab === t.id ? "#58a6ff" : "#8b949e",
              padding: "14px 20px", cursor: "pointer", fontSize: 13,
              fontFamily: "Courier New", fontWeight: tab === t.id ? 700 : 400,
              transition: "all 0.2s", letterSpacing: 0.5,
            }}
          >{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto" }}>
        {tab === "planner" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
            <div>
              <RouteForm onSubmit={handleRoute} mode="route" />
              <RouteResult result={routeResult} />
            </div>
            <div>
              <Card style={{ marginBottom: 12 }}>
                <div style={{ color: "#8b949e", fontSize: 11, fontFamily: "Courier New", letterSpacing: 1, marginBottom: 12 }}>
                  GRAPH VISUALIZATION {routeResult ? "— PATH HIGHLIGHTED" : "— HOVER TO INSPECT"}
                </div>
                <GraphCanvas highlightPath={highlightPath} />
                <div style={{ marginTop: 10, display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {[
                    { color: "#4ade80", label: "Start" },
                    { color: "#f87171", label: "End" },
                    { color: "#00d4aa", label: "Path" },
                    { color: "#30363d", label: "Unvisited" },
                  ].map(l => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} />
                      <span style={{ color: "#8b949e", fontSize: 11, fontFamily: "Courier New" }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {tab === "compare" && (
          <div>
            <RouteForm onSubmit={handleCompare} mode="compare" />
            <ComparePanel data={compareResult} />
          </div>
        )}

        {tab === "graph" && (
          <div>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ color: "#8b949e", fontSize: 11, fontFamily: "Courier New", letterSpacing: 1, marginBottom: 4 }}>
                BENGALURU CITY GRAPH — FULL NETWORK VIEW
              </div>
              <div style={{ color: "#6e7681", fontSize: 11, marginBottom: 16 }}>
                {GRAPH_NODES.length} locations · {GRAPH_EDGES.length} roads · Weighted bidirectional graph · Hover nodes to inspect
              </div>
              <GraphCanvas highlightPath={[]} />
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {[
                { label: "Data Structure", value: "Adjacency List",    color: "#00d4aa", desc: "O(V+E) space efficient" },
                { label: "Shortest Path",  value: "Dijkstra's",        color: "#58a6ff", desc: "O((V+E) log V) time" },
                { label: "Traversals",     value: "BFS + DFS",         color: "#a78bfa", desc: "O(V+E) time" },
                { label: "Edge Weights",   value: "Distance + Time",   color: "#f59e0b", desc: "Dual-weighted graph" },
                { label: "Priority Queue", value: "Min Heap",          color: "#4ade80", desc: "Dijkstra's backbone" },
                { label: "Path Recon",     value: "Parent Backtrack",  color: "#f87171", desc: "O(V) reconstruction" },
              ].map(s => (
                <Card key={s.label} style={{ padding: 16 }}>
                  <div style={{ color: "#8b949e", fontSize: 10, fontFamily: "Courier New", letterSpacing: 1 }}>{s.label}</div>
                  <div style={{ color: s.color, fontSize: 15, fontWeight: 700, fontFamily: "Courier New", margin: "6px 0 4px" }}>{s.value}</div>
                  <div style={{ color: "#6e7681", fontSize: 11 }}>{s.desc}</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {tab === "adjacency" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <AdjacencyPanel />
            <Card>
              <div style={{ color: "#8b949e", fontSize: 11, fontFamily: "Courier New", letterSpacing: 1, marginBottom: 12 }}>
                FULL ADJACENCY LIST
              </div>
              <div style={{ maxHeight: 480, overflowY: "auto" }}>
                {GRAPH_NODES.map(n => (
                  <div key={n.id} style={{ marginBottom: 12, padding: 10, background: "#0d1117", borderRadius: 8 }}>
                    <div style={{ color: "#58a6ff", fontFamily: "Courier New", fontSize: 12, marginBottom: 4 }}>
                      [{n.id}] {n.name}
                    </div>
                    <div style={{ color: "#6e7681", fontFamily: "Courier New", fontSize: 11, lineHeight: 1.8 }}>
                      {planner.getAdjacency(n.id).map((nb, i) => (
                        <span key={i} style={{ marginRight: 8 }}>
                          → <span style={{ color: "#00d4aa" }}>{nb.id}</span>
                          <span style={{ color: "#f59e0b" }}>({nb.dist}km)</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
