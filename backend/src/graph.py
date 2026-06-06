"""
graph.py — Core Graph Data Structure using Adjacency List
Implements: Graph, BFS, DFS, Dijkstra's Algorithm
"""

import heapq
from collections import defaultdict, deque
from typing import Dict, List, Tuple, Optional


class Graph:
    """
    Weighted Undirected Graph using Adjacency List.
    Nodes = City Locations
    Edges = Roads with distance (km) and time (min) weights
    """

    def __init__(self):
        # adjacency_list[node] = [(neighbor, distance_km, time_min, road_name)]
        self.adjacency_list: Dict[str, List[Tuple]] = defaultdict(list)
        self.nodes: Dict[str, Dict] = {}   # node metadata (name, lat, lng)
        self.edges: List[Dict] = []        # all edges for frontend graph display

    # ─────────────────────────────────────────────
    # GRAPH CONSTRUCTION
    # ─────────────────────────────────────────────

    def add_node(self, node_id: str, name: str, lat: float, lng: float):
        """Add a location/node to the graph."""
        self.nodes[node_id] = {"id": node_id, "name": name, "lat": lat, "lng": lng}

    def add_edge(
        self,
        u: str,
        v: str,
        distance_km: float,
        time_min: float,
        road_name: str = "",
    ):
        """
        Add a bidirectional road between two locations.
        Both directions stored (undirected graph).
        """
        self.adjacency_list[u].append((v, distance_km, time_min, road_name))
        self.adjacency_list[v].append((u, distance_km, time_min, road_name))
        self.edges.append(
            {
                "from": u,
                "to": v,
                "distance_km": distance_km,
                "time_min": time_min,
                "road_name": road_name,
            }
        )

    def get_neighbors(self, node: str) -> List[Tuple]:
        """Return all neighbors of a node."""
        return self.adjacency_list.get(node, [])

    def get_all_nodes(self) -> List[Dict]:
        """Return all node metadata."""
        return list(self.nodes.values())

    def get_all_edges(self) -> List[Dict]:
        """Return all edges."""
        return self.edges

    # ─────────────────────────────────────────────
    # BFS — Breadth-First Search (unweighted shortest hops)
    # ─────────────────────────────────────────────

    def bfs(self, source: str, destination: str) -> Dict:
        """
        BFS traversal to find path with minimum number of hops.
        Uses a queue (FIFO). Explores level by level.
        Time Complexity: O(V + E)
        """
        if source not in self.nodes or destination not in self.nodes:
            return {"error": "Invalid source or destination"}

        visited = set()
        queue = deque()
        parent = {}
        traversal_order = []

        queue.append(source)
        visited.add(source)
        parent[source] = None

        while queue:
            current = queue.popleft()
            traversal_order.append(current)

            if current == destination:
                break

            for neighbor, dist, time, road in self.adjacency_list[current]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    parent[neighbor] = current
                    queue.append(neighbor)

        # Reconstruct path
        path = self._reconstruct_path(parent, source, destination)
        total_dist, total_time = self._calculate_route_stats(path)

        return {
            "algorithm": "BFS",
            "source": source,
            "destination": destination,
            "path": path,
            "path_names": [self.nodes[n]["name"] for n in path if n in self.nodes],
            "total_distance_km": total_dist,
            "total_time_min": total_time,
            "traversal_order": traversal_order,
            "nodes_visited": len(visited),
        }

    # ─────────────────────────────────────────────
    # DFS — Depth-First Search (exploratory traversal)
    # ─────────────────────────────────────────────

    def dfs(self, source: str, destination: str) -> Dict:
        """
        DFS traversal — explores as deep as possible first.
        Uses a stack (LIFO). NOT optimal for shortest path.
        Time Complexity: O(V + E)
        """
        if source not in self.nodes or destination not in self.nodes:
            return {"error": "Invalid source or destination"}

        visited = set()
        stack = [source]
        parent = {source: None}
        traversal_order = []

        while stack:
            current = stack.pop()
            if current in visited:
                continue
            visited.add(current)
            traversal_order.append(current)

            if current == destination:
                break

            for neighbor, dist, time, road in self.adjacency_list[current]:
                if neighbor not in visited:
                    parent[neighbor] = current
                    stack.append(neighbor)

        path = self._reconstruct_path(parent, source, destination)
        total_dist, total_time = self._calculate_route_stats(path)

        return {
            "algorithm": "DFS",
            "source": source,
            "destination": destination,
            "path": path,
            "path_names": [self.nodes[n]["name"] for n in path if n in self.nodes],
            "total_distance_km": total_dist,
            "total_time_min": total_time,
            "traversal_order": traversal_order,
            "nodes_visited": len(visited),
        }

    # ─────────────────────────────────────────────
    # DIJKSTRA — Optimal Shortest Path (weighted)
    # ─────────────────────────────────────────────

    def dijkstra(self, source: str, destination: str, weight: str = "distance") -> Dict:
        """
        Dijkstra's Algorithm — finds the shortest weighted path.
        Uses a Min Heap (Priority Queue) for efficient edge relaxation.
        Time Complexity: O((V + E) log V)

        weight: 'distance' optimizes for km, 'time' optimizes for minutes
        """
        if source not in self.nodes or destination not in self.nodes:
            return {"error": "Invalid source or destination"}

        # dist[node] = shortest known distance from source
        INF = float("inf")
        dist = {node: INF for node in self.nodes}
        dist[source] = 0
        parent = {source: None}
        visited = set()
        traversal_order = []

        # Min heap: (cost, node)
        min_heap = [(0, source)]

        while min_heap:
            current_cost, current = heapq.heappop(min_heap)

            if current in visited:
                continue
            visited.add(current)
            traversal_order.append(current)

            if current == destination:
                break

            for neighbor, distance_km, time_min, road in self.adjacency_list[current]:
                edge_cost = distance_km if weight == "distance" else time_min
                new_cost = current_cost + edge_cost

                if new_cost < dist[neighbor]:
                    dist[neighbor] = new_cost
                    parent[neighbor] = current
                    heapq.heappush(min_heap, (new_cost, neighbor))

        path = self._reconstruct_path(parent, source, destination)
        total_dist, total_time = self._calculate_route_stats(path)

        # Build step-by-step directions
        steps = self._build_directions(path)

        return {
            "algorithm": f"Dijkstra ({weight})",
            "source": source,
            "destination": destination,
            "path": path,
            "path_names": [self.nodes[n]["name"] for n in path if n in self.nodes],
            "total_distance_km": round(total_dist, 2),
            "total_time_min": round(total_time, 1),
            "optimized_cost": round(dist.get(destination, INF), 2),
            "traversal_order": traversal_order,
            "nodes_visited": len(visited),
            "directions": steps,
        }

    # ─────────────────────────────────────────────
    # HELPERS
    # ─────────────────────────────────────────────

    def _reconstruct_path(self, parent: Dict, source: str, destination: str) -> List[str]:
        """Backtrack from destination to source using parent map."""
        path = []
        current = destination
        while current is not None:
            path.append(current)
            current = parent.get(current)
        path.reverse()
        if path and path[0] == source:
            return path
        return []  # no path found

    def _calculate_route_stats(self, path: List[str]) -> Tuple[float, float]:
        """Calculate total distance and time for a given path."""
        total_dist = 0.0
        total_time = 0.0
        for i in range(len(path) - 1):
            u, v = path[i], path[i + 1]
            for neighbor, dist, time, road in self.adjacency_list[u]:
                if neighbor == v:
                    total_dist += dist
                    total_time += time
                    break
        return round(total_dist, 2), round(total_time, 1)

    def _build_directions(self, path: List[str]) -> List[Dict]:
        """Build step-by-step navigation directions."""
        steps = []
        for i in range(len(path) - 1):
            u, v = path[i], path[i + 1]
            for neighbor, dist, time, road in self.adjacency_list[u]:
                if neighbor == v:
                    steps.append(
                        {
                            "step": i + 1,
                            "from": self.nodes[u]["name"],
                            "to": self.nodes[v]["name"],
                            "road": road or f"{self.nodes[u]['name']} → {self.nodes[v]['name']}",
                            "distance_km": dist,
                            "time_min": time,
                        }
                    )
                    break
        return steps

    def compare_algorithms(self, source: str, destination: str) -> Dict:
        """Run all 3 algorithms and compare results."""
        dijkstra_dist = self.dijkstra(source, destination, weight="distance")
        dijkstra_time = self.dijkstra(source, destination, weight="time")
        bfs_result = self.bfs(source, destination)
        dfs_result = self.dfs(source, destination)

        return {
            "dijkstra_distance": dijkstra_dist,
            "dijkstra_time": dijkstra_time,
            "bfs": bfs_result,
            "dfs": dfs_result,
            "comparison_summary": {
                "fastest_km": dijkstra_dist.get("total_distance_km"),
                "fastest_min": dijkstra_time.get("total_time_min"),
                "bfs_hops": len(bfs_result.get("path", [])) - 1,
                "dfs_hops": len(dfs_result.get("path", [])) - 1,
            },
        }
