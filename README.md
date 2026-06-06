# 🗺️ Intelligent Route Planner — Graph Algorithms DSA Project

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![DSA](https://img.shields.io/badge/DSA-Graphs%20%7C%20Dijkstra%20%7C%20BFS%20%7C%20DFS-orange?style=for-the-badge)

> A full-stack route optimization system built on graph algorithms — Dijkstra's, BFS, and DFS — with a real-time interactive canvas visualization of the Bengaluru city road network.

---

## 📌 Problem Statement

Every navigation system (Google Maps, Uber, Swiggy, Zomato, Amazon Logistics) solves one core problem:

> *Given a source location and destination, find the most optimal route considering distance or time.*

This project simulates that exact problem using fundamental DSA concepts — **weighted graphs**, **priority queues**, **BFS/DFS traversal** — in a production-style full-stack application.

---

## 🧠 DSA Concepts Used

| Concept | Usage |
|---|---|
| **Graph** | City map as weighted undirected graph |
| **Adjacency List** | Efficient graph storage — O(V + E) space |
| **Dijkstra's Algorithm** | Shortest weighted path — O((V+E) log V) |
| **BFS** | Minimum-hop path — O(V + E) |
| **DFS** | Exploratory traversal — O(V + E) |
| **Min Heap / Priority Queue** | Dijkstra's edge relaxation |
| **Parent Array** | Path reconstruction via backtracking |
| **Hash Map** | O(1) node/distance lookup |

---

## 🏗️ Architecture

```
Input (Source, Destination, Algorithm)
        ↓
Graph Builder (20 nodes, 31 edges — Bengaluru)
        ↓
Adjacency List Storage
        ↓
Algorithm Selection
   ├── Dijkstra (Min Heap) → Optimal weighted path
   ├── BFS (Queue)         → Minimum hop path
   └── DFS (Stack)         → Exploratory path
        ↓
Path Reconstruction (Parent Backtrack)
        ↓
Route Summary (Distance, Time, Turn-by-Turn)
        ↓
Canvas Visualization (React + HTML5 Canvas)
```

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.10+, FastAPI, Uvicorn |
| **Frontend** | React 18, HTML5 Canvas |
| **Algorithms** | Dijkstra, BFS, DFS (pure Python) |
| **Data** | Custom Bengaluru city graph (20 locations, 31 roads) |
| **API** | RESTful JSON API with CORS |

---

## 📁 Folder Structure

```
Intelligent-Route-Planner-Graph-Algorithms/
│
├── backend/
│   ├── main.py              # FastAPI app — all API endpoints
│   ├── requirements.txt     # Python dependencies
│   ├── src/
│   │   └── graph.py         # Core Graph class: Dijkstra, BFS, DFS
│   └── data/
│       └── city_data.py     # Bengaluru graph dataset
│
├── frontend/
│   ├── package.json
│   ├── public/index.html
│   └── src/
│       ├── App.jsx          # Main React app (all components)
│       └── utils/api.js     # API utility functions
│
├── outputs/                 # Save terminal screenshots here
├── images/                  # Save UI screenshots here
├── docs/
│   └── INTERVIEW_PREP.md    # 10 interview Q&A
├── README.md
└── .gitignore
```

---

## ⚙️ Installation & Running

### Backend (FastAPI)

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the server
uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`  
API Docs (Swagger): `http://localhost:8000/docs`

---

### Frontend (React)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API info |
| GET | `/locations` | All 20 locations |
| GET | `/graph` | Full graph (nodes + edges) |
| GET | `/popular-routes` | Preset route suggestions |
| POST | `/route` | Find route (algorithm + weight) |
| POST | `/compare` | Run all 4 algorithms and compare |
| GET | `/adjacency/{node_id}` | Adjacency list for a node |
| GET | `/health` | Server health check |

### Sample POST `/route` Request

```json
{
  "source": "KIA",
  "destination": "ELECTRONIC_CITY",
  "algorithm": "dijkstra",
  "weight": "distance"
}
```

### Sample Response

```json
{
  "algorithm": "Dijkstra (distance)",
  "path": ["KIA", "YELAHANKA", "HEBBAL", "MAJESTIC", "MG_ROAD", "KORAMANGALA", "SILK_BOARD", "ELECTRONIC_CITY"],
  "path_names": ["Kempegowda Intl Airport", "Yelahanka", "Hebbal", ...],
  "total_distance_km": 58.3,
  "total_time_min": 127.0,
  "directions": [
    { "step": 1, "from": "Kempegowda Intl Airport", "to": "Yelahanka", "road": "NH 44 / Bellary Road", "distance_km": 15.2, "time_min": 22 },
    ...
  ]
}
```

---

## 🗺️ City Graph — Bengaluru (20 Locations)

```
KIA (Airport) ──── Yelahanka ──── Hebbal ──── Manyata Tech Park
                                    │                 │
                               Rajajinagar        Whitefield
                                    │                 │
                                Majestic ──── MG Road ── Indiranagar
                                    │             │            │
                                Jayanagar   Koramangala   Marathahalli
                                    │             │            │
                                JP Nagar ──── BTM ──── Silk Board ── Bellandur
                                    │             │            │          │
                              Bannerghatta    HSR Layout  Elec City   Sarjapur
```

---

## 🖥️ Features

- ✅ **Route Planner** — Find shortest path with Dijkstra, BFS, or DFS
- ✅ **Optimize by Distance or Time** — Dual-weight Dijkstra
- ✅ **Algorithm Comparison** — Side-by-side results for all 4 variants
- ✅ **Turn-by-Turn Directions** — Step-wise navigation with road names
- ✅ **Graph Visualization** — Interactive canvas with path highlighting
- ✅ **Adjacency List Viewer** — Inspect every node's neighbors
- ✅ **Popular Routes** — One-click preset routes
- ✅ **Traversal Order Display** — See exactly which nodes each algorithm visits

---

## 📊 Algorithm Complexity

| Algorithm | Time | Space | Optimal? |
|---|---|---|---|
| Dijkstra | O((V+E) log V) | O(V) | ✅ Yes (weighted) |
| BFS | O(V + E) | O(V) | ✅ Yes (unweighted) |
| DFS | O(V + E) | O(V) | ❌ No |

---

## 📸 Screenshots

> Add screenshots to `/images/` folder after running:
- `images/01_home_ui.png` — Main UI
- `images/02_route_result.png` — Route found with directions
- `images/03_graph_highlighted.png` — Path on graph canvas
- `images/04_compare_panel.png` — Algorithm comparison
- `images/05_adjacency_list.png` — Adjacency viewer
- `images/06_api_swagger.png` — FastAPI /docs

---

## 🎓 Learning Outcomes

After building this project, you will understand:

1. How to represent real-world maps as weighted graphs
2. Why Dijkstra's algorithm uses a min-heap (priority queue)
3. The difference between BFS, DFS, and Dijkstra in path-finding
4. How Google Maps-style turn-by-turn directions are generated
5. How to build a production REST API with FastAPI
6. How to visualize graphs on HTML5 Canvas
7. How to connect a React frontend to a Python backend

---

## 👤 Author

**Rakshitha A S**  
B.E. Cybersecurity, ACS College of Engineering, Bengaluru  


GitHub: [github.com/Rakshitha262004](https://github.com/Rakshitha262004)

---

## 🏷️ Tags

`graph-algorithms` `dijkstra` `bfs` `dfs` `route-optimization` `dsa-project` `python` `fastapi` `react` `data-structures` `shortest-path` `adjacency-list` `priority-queue` `min-heap` `navigation`
