"""
city_data.py — Bengaluru City Graph Dataset
Real-world inspired locations, roads, distances, and travel times.
"""

from src.graph import Graph


def build_bengaluru_graph() -> Graph:
    """
    Builds a weighted graph of Bengaluru city.
    Nodes = Major locations/landmarks
    Edges = Roads with distance (km) and time (min)
    """
    g = Graph()

    # ─────────────────────────────────────────────
    # NODES — Major Bengaluru Locations
    # ─────────────────────────────────────────────
    locations = [
        ("KIA",      "Kempegowda International Airport", 13.1989, 77.7068),
        ("YELAHANKA","Yelahanka",                         13.1007, 77.5963),
        ("HEBBAL",   "Hebbal",                            13.0350, 77.5970),
        ("MANYATA",  "Manyata Tech Park",                 13.0475, 77.6200),
        ("WHITEFIELD","Whitefield",                       12.9698, 77.7500),
        ("MARATHALLI","Marathahalli",                     12.9591, 77.6974),
        ("KORAMANGALA","Koramangala",                     12.9352, 77.6245),
        ("BTM",      "BTM Layout",                        12.9165, 77.6101),
        ("JAYANAGAR","Jayanagar",                         12.9250, 77.5938),
        ("MAJESTIC", "Kempegowda Bus Stand (Majestic)",   12.9767, 77.5713),
        ("MG_ROAD",  "MG Road",                           12.9753, 77.6083),
        ("INDIRANAGAR","Indiranagar",                     12.9784, 77.6408),
        ("ELECTRONIC_CITY","Electronic City",             12.8399, 77.6770),
        ("HSR",      "HSR Layout",                        12.9116, 77.6389),
        ("SILK_BOARD","Silk Board Junction",              12.9172, 77.6227),
        ("BELLANDUR", "Bellandur",                        12.9344, 77.6784),
        ("SARJAPUR",  "Sarjapur Road",                    12.9010, 77.6966),
        ("BANNERGHATTA","Bannerghatta Road",              12.8933, 77.5975),
        ("JP_NAGAR", "JP Nagar",                          12.9074, 77.5854),
        ("RAJAJINAGAR","Rajajinagar",                     12.9904, 77.5518),
    ]

    for node_id, name, lat, lng in locations:
        g.add_node(node_id, name, lat, lng)

    # ─────────────────────────────────────────────
    # EDGES — Roads (distance_km, time_min, road_name)
    # ─────────────────────────────────────────────
    roads = [
        # Airport Corridor
        ("KIA",        "YELAHANKA",    15.2, 22, "NH 44 / Bellary Road"),
        ("YELAHANKA",  "HEBBAL",       10.5, 20, "Bellary Road"),
        ("HEBBAL",     "MANYATA",       4.2,  8, "Outer Ring Road North"),
        ("HEBBAL",     "MAJESTIC",      9.8, 25, "Bellary Road"),
        ("HEBBAL",     "RAJAJINAGAR",   8.1, 18, "Bellary Road - Rajaji Nagar Link"),

        # ORR (Outer Ring Road) Corridor
        ("MANYATA",    "WHITEFIELD",   22.3, 45, "Outer Ring Road"),
        ("WHITEFIELD", "MARATHALLI",    7.5, 18, "Whitefield Main Road"),
        ("MARATHALLI", "BELLANDUR",     5.8, 14, "Outer Ring Road East"),
        ("BELLANDUR",  "SARJAPUR",      6.2, 15, "Sarjapur Outer Ring Road"),
        ("SARJAPUR",   "ELECTRONIC_CITY", 8.3, 20, "Sarjapur Road"),
        ("BELLANDUR",  "HSR",           5.1, 13, "Outer Ring Road"),
        ("HSR",        "SILK_BOARD",    2.3,  7, "HSR Layout Road"),

        # Central Bengaluru
        ("MAJESTIC",   "MG_ROAD",       4.5, 15, "Brigade Road / Cubbon Park"),
        ("MG_ROAD",    "INDIRANAGAR",   5.2, 14, "100 Feet Road"),
        ("INDIRANAGAR","MARATHALLI",    9.3, 22, "Old Airport Road"),
        ("MG_ROAD",    "KORAMANGALA",   5.8, 16, "Residency Road"),
        ("KORAMANGALA","BTM",           3.1,  9, "80 Feet Road"),
        ("BTM",        "SILK_BOARD",    2.8,  8, "Hosur Road"),
        ("SILK_BOARD", "ELECTRONIC_CITY", 14.2, 30, "Hosur Road / NICE Road"),
        ("KORAMANGALA","HSR",           3.5, 10, "27th Main Road"),

        # South Bengaluru
        ("BTM",        "JAYANAGAR",     3.0,  9, "Bannerghatta Road"),
        ("JAYANAGAR",  "JP_NAGAR",      3.4,  8, "JP Nagar - Jayanagar Link"),
        ("JP_NAGAR",   "BANNERGHATTA",  5.2, 14, "Bannerghatta Road"),
        ("BANNERGHATTA","ELECTRONIC_CITY", 10.5, 24, "Bannerghatta Road Link"),
        ("JP_NAGAR",   "BTM",           4.1, 10, "Outer Ring Road South"),

        # West Bengaluru
        ("MAJESTIC",   "RAJAJINAGAR",   4.2, 14, "Chord Road"),
        ("RAJAJINAGAR","HEBBAL",        8.1, 18, "BEL Road"),

        # Cross connections
        ("MANYATA",    "INDIRANAGAR",   7.6, 18, "New BEL Road - Indiranagar"),
        ("WHITEFIELD", "SARJAPUR",     14.1, 32, "Whitefield Sarjapur Road"),
        ("MARATHALLI", "KORAMANGALA",   9.2, 22, "Intermediate Ring Road"),
        ("MAJESTIC",   "JAYANAGAR",     7.5, 20, "Mysore Road Link"),
    ]

    for u, v, dist, time, road in roads:
        g.add_edge(u, v, dist, time, road)

    return g


def get_all_locations(g: Graph):
    """Return sorted list of all locations."""
    return sorted(g.get_all_nodes(), key=lambda x: x["name"])


# Popular route presets for the UI
POPULAR_ROUTES = [
    {"label": "Airport → MG Road",        "source": "KIA",         "destination": "MG_ROAD"},
    {"label": "Whitefield → Electronic City", "source": "WHITEFIELD", "destination": "ELECTRONIC_CITY"},
    {"label": "Majestic → Koramangala",    "source": "MAJESTIC",    "destination": "KORAMANGALA"},
    {"label": "Hebbal → BTM Layout",       "source": "HEBBAL",      "destination": "BTM"},
    {"label": "Indiranagar → JP Nagar",    "source": "INDIRANAGAR", "destination": "JP_NAGAR"},
    {"label": "Marathahalli → Silk Board", "source": "MARATHALLI",  "destination": "SILK_BOARD"},
]
