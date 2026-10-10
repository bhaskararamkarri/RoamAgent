from datetime import datetime, date, timedelta
from typing import List, Dict
from app.models import Leg

SIMULATED_TIMESTAMP = "2026-10-10T12:00:00Z"

VIZAG_NODES = [
    "Vizag Railway Station",
    "MVP Colony",
    "Gajuwaka",
    "Vizag RTC Complex (Dwaraka)",
]

HYD_DROP_NODES = [
    "MGBS",
    "Miyapur",
    "LB Nagar",
    "Kukatpally",
]

FINAL_DESTINATIONS = [
    "Hitech City",
    "Secunderabad",
    "Gachibowli",
    "Ameerpet",
]


def parse_travel_date(travel_date_str: str) -> date:
    """Parse YYYY-MM-DD travel date."""
    try:
        return datetime.strptime(travel_date_str, "%Y-%m-%d").date()
    except Exception:
        return date.today() + timedelta(days=1)


def generate_base_legs(travel_date_str: str) -> List[Leg]:
    """
    Generate deterministic mock legs relative to the travel date.
    All data is labeled source="SIMULATED".
    Travel date D is the morning of arrival in Hyderabad.
    Buses depart D - 1 evening and arrive on D morning.
    """
    t_date = parse_travel_date(travel_date_str)
    prev_date = t_date - timedelta(days=1)
    d_str = t_date.strftime("%Y-%m-%d")
    prev_str = prev_date.strftime("%Y-%m-%d")

    legs: List[Leg] = []

    # ---------------------------------------------------------
    # 1. FIRST-MILE LEGS (Vizag origins -> Vizag RTC Complex)
    # Departures on prev_date between 17:00 and 22:30
    # ---------------------------------------------------------
    origins = [
        ("Vizag Railway Station", 20, 150, 250),
        ("MVP Colony", 25, 180, 300),
        ("Gajuwaka", 40, 320, 480),
    ]

    departure_times_first_mile = [
        "17:15", "17:45", "18:00", "18:30", "19:00", "19:15", "19:30", 
        "19:45", "20:00", "20:15", "20:30", "21:00", "21:30", "22:00"
    ]

    for orig, auto_dur, auto_fare, cab_fare in origins:
        for t in departure_times_first_mile:
            hh, mm = map(int, t.split(":"))
            dep_dt = datetime(prev_date.year, prev_date.month, prev_date.day, hh, mm)
            # Auto
            arr_auto_dt = dep_dt + timedelta(minutes=auto_dur)
            auto_id = f"first-auto-{orig[:4].lower().replace(' ', '')}-{t.replace(':', '')}"
            legs.append(Leg(
                id=auto_id,
                mode="auto",
                from_node=orig,
                to_node="Vizag RTC Complex (Dwaraka)",
                dep=dep_dt.strftime("%Y-%m-%dT%H:%M:%S"),
                arr=arr_auto_dt.strftime("%Y-%m-%dT%H:%M:%S"),
                fare=float(auto_fare),
                per_vehicle=True,
                seat_type="na",
                seats_left=3,
                operator="Local Auto Union (Simulated)",
                accessible=False,
                delay_prob=0.10,
                typical_delay_min=10,
                updated_at=SIMULATED_TIMESTAMP,
                source="SIMULATED",
                status="ok"
            ))

            # Cab
            cab_dur = max(15, auto_dur - 5)
            arr_cab_dt = dep_dt + timedelta(minutes=cab_dur)
            cab_id = f"first-cab-{orig[:4].lower().replace(' ', '')}-{t.replace(':', '')}"
            legs.append(Leg(
                id=cab_id,
                mode="cab",
                from_node=orig,
                to_node="Vizag RTC Complex (Dwaraka)",
                dep=dep_dt.strftime("%Y-%m-%dT%H:%M:%S"),
                arr=arr_cab_dt.strftime("%Y-%m-%dT%H:%M:%S"),
                fare=float(cab_fare),
                per_vehicle=True,
                seat_type="na",
                seats_left=4,
                operator="City Cabs (Simulated)",
                accessible=True if orig == "Vizag Railway Station" else False,
                delay_prob=0.08,
                typical_delay_min=10,
                updated_at=SIMULATED_TIMESTAMP,
                source="SIMULATED",
                status="ok"
            ))

    # ---------------------------------------------------------
    # 2. INTERCITY BUSES (Vizag RTC Complex -> Hyderabad Drop Points)
    # Depart prev_date evening, arrive t_date morning
    # ---------------------------------------------------------
    bus_configs = [
        # (id, operator, to_node, dep_prev, arr_today, fare, seat_type, seats_left, accessible, delay_prob, typical_delay_min)
        (
            "bus-apsrtc-garuda-101",
            "APSRTC Garuda Plus",
            "Miyapur",
            "19:30", "06:00",
            850.0, "seater", 28, True, 0.08, 20
        ),
        (
            "bus-apsrtc-amaravati-102",
            "APSRTC Amaravati Multi-Axle",
            "MGBS",
            "20:00", "06:30",
            1150.0, "sleeper", 18, True, 0.10, 25
        ),
        (
            "bus-kaveri-sleeper-103",
            "Kaveri Travels AC Sleeper",
            "Miyapur",
            "20:30", "06:45",
            1350.0, "sleeper", 14, False, 0.12, 30
        ),
        (
            "bus-orange-volvo-104",
            "Orange Travels Volvo B11R",
            "Kukatpally",
            "21:15", "07:15",
            1450.0, "sleeper", 16, False, 0.15, 30
        ),
        (
            "bus-morningstar-105",
            "Morning Star Travels Multi-Axle",
            "LB Nagar",
            "21:45", "07:45",
            920.0, "seater", 1, False, 0.20, 35  # Exactly 1 seat left for Fixture G
        ),
        (
            "bus-dwaraka-exp-106",
            "Dwaraka Express Sleeper",
            "MGBS",
            "18:45", "05:45",
            1250.0, "sleeper", 12, False, 0.10, 20
        ),
        (
            "bus-vrl-cruiser-107",
            "VRL Royal Cruiser",
            "Miyapur",
            "22:00", "07:45",
            1600.0, "sleeper", 14, True, 0.18, 30
        ),
        (
            "bus-srikrishna-seater-108",
            "Sri Krishna Travels Non-AC Seater",
            "MGBS",
            "19:00", "06:30",
            720.0, "seater", 30, False, 0.25, 45
        ),
        (
            "bus-falcon-sleeper-109",
            "Falcon Bus Sleeper",
            "Miyapur",
            "22:15", "08:00",
            1550.0, "sleeper", 10, False, 0.15, 25
        ),
        # TRAP FIXTURE B: Super cheap bus arriving at 09:40 at Miyapur (will exceed 09:00 deadline)
        (
            "bus-supersaver-trap-110",
            "SuperSaver Budget Express (Trap)",
            "Miyapur",
            "22:45", "09:40",
            650.0, "seater", 32, False, 0.35, 60
        ),
    ]

    for (b_id, op, to_node, dep_t, arr_t, fare, s_type, s_left, acc, d_prob, typ_delay) in bus_configs:
        d_hh, d_mm = map(int, dep_t.split(":"))
        a_hh, a_mm = map(int, arr_t.split(":"))
        dep_dt = datetime(prev_date.year, prev_date.month, prev_date.day, d_hh, d_mm)
        arr_dt = datetime(t_date.year, t_date.month, t_date.day, a_hh, a_mm)
        legs.append(Leg(
            id=b_id,
            mode="bus",
            from_node="Vizag RTC Complex (Dwaraka)",
            to_node=to_node,
            dep=dep_dt.strftime("%Y-%m-%dT%H:%M:%S"),
            arr=arr_dt.strftime("%Y-%m-%dT%H:%M:%S"),
            fare=fare,
            per_vehicle=False,
            seat_type=s_type,
            seats_left=s_left,
            operator=op,
            accessible=acc,
            delay_prob=d_prob,
            typical_delay_min=typ_delay,
            updated_at=SIMULATED_TIMESTAMP,
            source="SIMULATED",
            status="ok"
        ))

    # ---------------------------------------------------------
    # 3. LAST-MILE LEGS (Hyderabad Drop Points -> Final Destinations)
    # Morning of t_date (06:00 to 12:00)
    # Metro: 06:00 - 22:00, every 10 min
    # Cabs / Autos: Available at regular intervals
    # ---------------------------------------------------------
    # Metro connections
    metro_routes = [
        ("Miyapur", "Hitech City", 30, 50.0),
        ("Miyapur", "Ameerpet", 25, 40.0),
        ("MGBS", "Hitech City", 45, 60.0),
        ("MGBS", "Secunderabad", 25, 40.0),
        ("MGBS", "Ameerpet", 20, 35.0),
        ("Kukatpally", "Hitech City", 20, 40.0),
        ("LB Nagar", "Secunderabad", 40, 55.0),
        ("LB Nagar", "Hitech City", 55, 65.0),
        ("Ameerpet", "Hitech City", 20, 35.0),
        ("Ameerpet", "Gachibowli", 30, 45.0),
        ("Ameerpet", "Secunderabad", 18, 30.0),
    ]

    # Generate metro departures every 10 minutes from 06:00 to 11:30
    metro_slots = []
    for h in range(6, 12):
        for m in (0, 10, 20, 30, 40, 50):
            metro_slots.append(f"{h:02d}:{m:02d}")

    for from_n, to_n, dur, m_fare in metro_routes:
        for slot in metro_slots:
            sh, sm = map(int, slot.split(":"))
            dep_dt = datetime(t_date.year, t_date.month, t_date.day, sh, sm)
            arr_dt = dep_dt + timedelta(minutes=dur)
            m_id = f"metro-{from_n[:4].lower()}-{to_n[:4].lower()}-{slot.replace(':', '')}"
            legs.append(Leg(
                id=m_id,
                mode="metro",
                from_node=from_n,
                to_node=to_n,
                dep=dep_dt.strftime("%Y-%m-%dT%H:%M:%S"),
                arr=arr_dt.strftime("%Y-%m-%dT%H:%M:%S"),
                fare=m_fare,
                per_vehicle=False,
                seat_type="na",
                seats_left=120,
                operator="Hyderabad Metro Rail (Simulated)",
                accessible=True,
                delay_prob=0.03,
                typical_delay_min=5,
                updated_at=SIMULATED_TIMESTAMP,
                source="SIMULATED",
                status="ok"
            ))

    # Cabs and Autos for all drop nodes to final destinations
    road_routes = [
        ("Miyapur", "Hitech City", 25, 180.0, 320.0),
        ("Miyapur", "Gachibowli", 30, 220.0, 380.0),
        ("Miyapur", "Secunderabad", 45, 300.0, 500.0),
        ("Miyapur", "Ameerpet", 30, 200.0, 350.0),
        ("MGBS", "Hitech City", 45, 320.0, 550.0),
        ("MGBS", "Secunderabad", 25, 180.0, 300.0),
        ("MGBS", "Gachibowli", 50, 350.0, 580.0),
        ("MGBS", "Ameerpet", 25, 180.0, 320.0),
        ("Kukatpally", "Hitech City", 20, 150.0, 280.0),
        ("Kukatpally", "Gachibowli", 28, 200.0, 360.0),
        ("LB Nagar", "Hitech City", 55, 380.0, 650.0),
        ("LB Nagar", "Secunderabad", 35, 240.0, 420.0),
        ("LB Nagar", "Gachibowli", 60, 400.0, 700.0),
    ]

    road_slots = [
        "05:45", "06:00", "06:15", "06:30", "06:45", "07:00", "07:15", 
        "07:30", "07:45", "08:00", "08:15", "08:30", "08:45", "09:00", 
        "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "11:00"
    ]

    for from_n, to_n, dur, a_fare, c_fare in road_routes:
        for slot in road_slots:
            sh, sm = map(int, slot.split(":"))
            dep_dt = datetime(t_date.year, t_date.month, t_date.day, sh, sm)
            arr_dt = dep_dt + timedelta(minutes=dur)
            slot_key = slot.replace(":", "")

            # Auto
            legs.append(Leg(
                id=f"auto-{from_n[:4].lower()}-{to_n[:4].lower()}-{slot_key}",
                mode="auto",
                from_node=from_n,
                to_node=to_n,
                dep=dep_dt.strftime("%Y-%m-%dT%H:%M:%S"),
                arr=arr_dt.strftime("%Y-%m-%dT%H:%M:%S"),
                fare=a_fare,
                per_vehicle=True,
                seat_type="na",
                seats_left=3,
                operator="Hyd Auto Union (Simulated)",
                accessible=False,
                delay_prob=0.12,
                typical_delay_min=15,
                updated_at=SIMULATED_TIMESTAMP,
                source="SIMULATED",
                status="ok"
            ))

            # Cab (every alternating slot is accessible cab)
            cab_dur = max(15, dur - 5)
            arr_cab_dt = dep_dt + timedelta(minutes=cab_dur)
            is_acc_cab = (sm % 30 == 0)
            legs.append(Leg(
                id=f"cab-{from_n[:4].lower()}-{to_n[:4].lower()}-{slot_key}",
                mode="cab",
                from_node=from_n,
                to_node=to_n,
                dep=dep_dt.strftime("%Y-%m-%dT%H:%M:%S"),
                arr=arr_cab_dt.strftime("%Y-%m-%dT%H:%M:%S"),
                fare=c_fare,
                per_vehicle=True,
                seat_type="na",
                seats_left=4,
                operator="Hyd City Cabs (Simulated)",
                accessible=is_acc_cab,
                delay_prob=0.10,
                typical_delay_min=15,
                updated_at=SIMULATED_TIMESTAMP,
                source="SIMULATED",
                status="ok"
            ))

    # ---------------------------------------------------------
    # 4. NATIONAL CORRIDORS & POPULAR ROUTES
    # Connecting major Indian cities directly and via multi-modal legs
    # ---------------------------------------------------------
    national_corridors = [
        # (id_prefix, mode, from_n, to_n, dep_d, dep_t, arr_d, arr_t, fare, per_veh, seat, s_left, op, acc, d_prob, delay)
        # New Delhi <-> Mumbai
        ("nat-del-bom-train-1", "train", "New Delhi", "Mumbai", prev_date, "16:55", t_date, "08:35", 2150.0, False, "sleeper", 24, "Mumbai Rajdhani Express (Simulated)", True, 0.05, 15),
        ("nat-del-bom-bus-1", "bus", "New Delhi", "Mumbai", prev_date, "16:00", t_date, "08:30", 1200.0, False, "sleeper", 14, "Zingbus AC Multi-Axle Sleeper", True, 0.12, 30),
        ("nat-del-bom-air-1", "flight", "New Delhi", "Mumbai", t_date, "06:30", t_date, "08:45", 4200.0, False, "seater", 30, "Air India Express (Simulated Flight)", True, 0.04, 10),
        ("nat-bom-del-train-1", "train", "Mumbai", "New Delhi", prev_date, "17:00", t_date, "08:40", 2150.0, False, "sleeper", 20, "August Kranti Rajdhani", True, 0.05, 15),

        # Bengaluru <-> Chennai
        ("nat-blr-maa-train-1", "train", "Bengaluru", "Chennai", t_date, "05:45", t_date, "09:15", 850.0, False, "seater", 42, "Chennai Vande Bharat Express", True, 0.04, 10),
        ("nat-blr-maa-bus-1", "bus", "Bengaluru", "Chennai", prev_date, "23:45", t_date, "05:45", 450.0, False, "sleeper", 22, "KSRTC Airavat Club Class", True, 0.08, 15),
        ("nat-maa-blr-train-1", "train", "Chennai", "Bengaluru", t_date, "05:30", t_date, "09:00", 850.0, False, "seater", 38, "Bengaluru Vande Bharat", True, 0.04, 10),

        # Kolkata <-> Bhubaneswar
        ("nat-ccu-bbs-train-1", "train", "Kolkata", "Bhubaneswar", t_date, "06:00", t_date, "12:30", 350.0, False, "seater", 36, "Dhauli Express (Simulated)", True, 0.06, 15),
        ("nat-ccu-bbs-bus-1", "bus", "Kolkata", "Bhubaneswar", prev_date, "22:30", t_date, "06:00", 520.0, False, "sleeper", 16, "OSRTC Volvo AC Sleeper", True, 0.10, 20),
        ("nat-bbs-ccu-train-1", "train", "Bhubaneswar", "Kolkata", t_date, "06:30", t_date, "13:00", 350.0, False, "seater", 30, "Jan Shatabdi Express", True, 0.06, 15),

        # Jaipur <-> New Delhi
        ("nat-jp-del-train-1", "train", "Jaipur", "New Delhi", t_date, "06:00", t_date, "09:40", 680.0, False, "seater", 40, "Ajmer Shatabdi Express", True, 0.05, 10),
        ("nat-jp-del-bus-1", "bus", "Jaipur", "New Delhi", t_date, "05:00", t_date, "09:30", 380.0, False, "seater", 28, "RSRTC Volvo Scania AC", True, 0.08, 15),
        ("nat-del-jp-train-1", "train", "New Delhi", "Jaipur", t_date, "06:10", t_date, "09:50", 680.0, False, "seater", 35, "Delhi-Jaipur Double Decker", True, 0.05, 10),

        # Pune <-> Bengaluru
        ("nat-pnq-blr-train-1", "train", "Pune", "Bengaluru", prev_date, "16:00", t_date, "08:30", 1100.0, False, "sleeper", 18, "Udyan Express (Simulated)", True, 0.08, 20),
        ("nat-pnq-blr-bus-1", "bus", "Pune", "Bengaluru", prev_date, "20:00", t_date, "08:00", 950.0, False, "sleeper", 15, "VRL Multi-Axle I-Shift Sleeper", True, 0.10, 25),
        ("nat-blr-pnq-train-1", "train", "Bengaluru", "Pune", prev_date, "17:00", t_date, "08:45", 1100.0, False, "sleeper", 20, "Karnataka Express", True, 0.08, 20),

        # Ahmedabad <-> Mumbai
        ("nat-amd-bom-train-1", "train", "Ahmedabad", "Mumbai", t_date, "06:10", t_date, "11:25", 1350.0, False, "seater", 45, "Mumbai Central Vande Bharat", True, 0.04, 10),
        ("nat-amd-bom-bus-1", "bus", "Ahmedabad", "Mumbai", prev_date, "23:00", t_date, "06:30", 550.0, False, "sleeper", 20, "Gujarat Travels AC Sleeper", True, 0.09, 20),
        ("nat-bom-amd-train-1", "train", "Mumbai", "Ahmedabad", t_date, "06:00", t_date, "11:15", 1350.0, False, "seater", 40, "Tejas Express (Simulated)", True, 0.04, 10),

        # Chandigarh <-> Shimla
        ("nat-cdg-sml-train-1", "train", "Chandigarh", "Shimla", t_date, "05:30", t_date, "09:30", 260.0, False, "seater", 28, "Himalayan Queen Heritage Rail", True, 0.05, 15),
        ("nat-cdg-sml-bus-1", "bus", "Chandigarh", "Shimla", t_date, "06:00", t_date, "09:45", 340.0, False, "seater", 30, "HRTC Himsuta AC Volvo", True, 0.08, 20),
        ("nat-cdg-sml-cab-1", "cab", "Chandigarh", "Shimla", t_date, "06:30", t_date, "09:30", 1800.0, True, "na", 4, "Himalayan Ridge Tourist Cab", True, 0.06, 15),
        ("nat-sml-cdg-bus-1", "bus", "Shimla", "Chandigarh", t_date, "06:00", t_date, "09:45", 340.0, False, "seater", 26, "HRTC Himsuta AC Volvo", True, 0.08, 20),
    ]

    for (pfx, mode, fn, tn, dep_d, dep_t, arr_d, arr_t, fare, p_veh, s_type, s_left, op, acc, d_prob, delay) in national_corridors:
        d_hh, d_mm = map(int, dep_t.split(":"))
        a_hh, a_mm = map(int, arr_t.split(":"))
        dep_dt = datetime(dep_d.year, dep_d.month, dep_d.day, d_hh, d_mm)
        arr_dt = datetime(arr_d.year, arr_d.month, arr_d.day, a_hh, a_mm)
        legs.append(Leg(
            id=f"{pfx}-{dep_t.replace(':', '')}",
            mode=mode,
            from_node=fn,
            to_node=tn,
            dep=dep_dt.strftime("%Y-%m-%dT%H:%M:%S"),
            arr=arr_dt.strftime("%Y-%m-%dT%H:%M:%S"),
            fare=float(fare),
            per_vehicle=p_veh,
            seat_type=s_type,
            seats_left=s_left,
            operator=op,
            accessible=acc,
            delay_prob=d_prob,
            typical_delay_min=delay,
            updated_at=SIMULATED_TIMESTAMP,
            source="SIMULATED",
            status="ok"
        ))

    return legs
