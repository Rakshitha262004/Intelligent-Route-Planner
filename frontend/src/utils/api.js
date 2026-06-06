// src/utils/api.js — All backend API calls

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "API error");
  return data;
}

export const fetchLocations    = ()       => request("/locations");
export const fetchGraph        = ()       => request("/graph");
export const fetchPopularRoutes= ()       => request("/popular-routes");

export const fetchRoute = ({ source, destination, algorithm, weight }) =>
  request("/route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, destination, algorithm, weight }),
  });

export const fetchCompare = ({ source, destination }) =>
  request("/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, destination }),
  });

export const fetchAdjacency = (nodeId) => request(`/adjacency/${nodeId}`);
