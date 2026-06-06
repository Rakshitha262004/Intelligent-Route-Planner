"""
main.py — FastAPI Backend for Intelligent Route Planner
Endpoints for graph data, shortest path, BFS, DFS, Dijkstra, comparisons
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from data.city_data import build_bengaluru_graph, get_all_locations, POPULAR_ROUTES

# ─────────────────────────────────────────────
# App Setup
# ─────────────────────────────────────────────

app = FastAPI(
    title="Intelligent Route Planner API",
    description="Graph-based route optimization using BFS, DFS, and Dijkstra's Algorithm",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Build graph once at startup
graph = build_bengaluru_graph()

# ─────────────────────────────────────────────
# Request Models
# ─────────────────────────────────────────────

class RouteRequest(BaseModel):
    source: str
    destination: str
    algorithm: Optional[str] = "dijkstra"   # dijkstra | bfs | dfs
    weight: Optional[str] = "distance"       # distance | time


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "message": "🗺️ Intelligent Route Planner API",
        "version": "1.0.0",
        "endpoints": ["/locations", "/graph", "/route", "/compare", "/popular-routes"],
    }


@app.get("/locations")
def get_locations():
    """Return all nodes/locations in the graph."""
    return {
        "count": len(graph.nodes),
        "locations": get_all_locations(graph),
    }


@app.get("/graph")
def get_graph():
    """Return full graph structure for frontend visualization."""
    return {
        "nodes": graph.get_all_nodes(),
        "edges": graph.get_all_edges(),
        "node_count": len(graph.nodes),
        "edge_count": len(graph.edges),
    }


@app.get("/popular-routes")
def popular_routes():
    """Return popular preset routes for quick selection."""
    return {"routes": POPULAR_ROUTES}


@app.post("/route")
def find_route(req: RouteRequest):
    """
    Find a route between source and destination.
    Algorithm: dijkstra (default), bfs, dfs
    Weight (for dijkstra): distance (default), time
    """
    src = req.source.upper()
    dst = req.destination.upper()

    if src not in graph.nodes:
        raise HTTPException(status_code=404, detail=f"Source '{src}' not found.")
    if dst not in graph.nodes:
        raise HTTPException(status_code=404, detail=f"Destination '{dst}' not found.")
    if src == dst:
        raise HTTPException(status_code=400, detail="Source and destination cannot be the same.")

    algo = req.algorithm.lower()

    if algo == "dijkstra":
        result = graph.dijkstra(src, dst, weight=req.weight)
    elif algo == "bfs":
        result = graph.bfs(src, dst)
    elif algo == "dfs":
        result = graph.dfs(src, dst)
    else:
        raise HTTPException(status_code=400, detail=f"Unknown algorithm '{algo}'. Use: dijkstra, bfs, dfs")

    if not result.get("path"):
        raise HTTPException(status_code=404, detail="No path found between the given locations.")

    return result


@app.post("/compare")
def compare_routes(req: RouteRequest):
    """
    Run all algorithms (Dijkstra-distance, Dijkstra-time, BFS, DFS)
    and return a side-by-side comparison.
    """
    src = req.source.upper()
    dst = req.destination.upper()

    if src not in graph.nodes:
        raise HTTPException(status_code=404, detail=f"Source '{src}' not found.")
    if dst not in graph.nodes:
        raise HTTPException(status_code=404, detail=f"Destination '{dst}' not found.")

    return graph.compare_algorithms(src, dst)


@app.get("/adjacency/{node_id}")
def get_adjacency(node_id: str):
    """Return adjacency list for a specific node."""
    node_id = node_id.upper()
    if node_id not in graph.nodes:
        raise HTTPException(status_code=404, detail=f"Node '{node_id}' not found.")
    neighbors = graph.get_neighbors(node_id)
    return {
        "node": graph.nodes[node_id],
        "neighbors": [
            {
                "id": n,
                "name": graph.nodes[n]["name"],
                "distance_km": d,
                "time_min": t,
                "road": r,
            }
            for n, d, t, r in neighbors
        ],
    }


@app.get("/health")
def health():
    return {"status": "ok", "graph_nodes": len(graph.nodes), "graph_edges": len(graph.edges)}
