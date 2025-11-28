
# TextAnything – Technical Assignment  
This repository contains solutions for both **Test 1 (Geofence Event Processing)** and **Test 2 (Leaderboard Points Ranking)** as required in the TextAnything engineering assessment.

---

## 📁 Repository Structure

```

textanything-assignment/
│
├── test1-geofence-service/          # Node.js (ESM) Geofence API
│   ├── src/
│   ├── postman/
│   ├── package.json
│   └── README.md
│
├── test2-leaderboard-ranking/       # Python leaderboard ranking logic
│   ├── rank_leaderboard.py
│   ├── leaderboard_ranked.xlsx
│   └── README.md
│
└── README.md                        # (this file)

```

---

## 🧪 **Test 1 – Geofence Event Processing Service**
📍 Location: `test1-geofence-service/`

### ✔ Overview  
A Node.js + Express backend that:
- Receives live vehicle location events (`/events/location`)
- Identifies which geofence zones the vehicle is currently inside
- Detects **zone entry** and **zone exit** transitions
- Stores state in memory (Map)
- Provides vehicle status API (`/vehicles/:id/status`)
- Includes Postman collection for testing

### ✔ Technologies
- Node.js (ES Modules)
- Express.js
- Haversine distance formula for geofence calculation
- Framer structure (routes, services, models)
- Postman (testing)

### ✔ How to Run
```

cd test1-geofence-service
npm install
npm run dev

```

### ✔ Documentation  
See `test1-geofence-service/README.md` for:
- API endpoints  
- Sample requests & responses  
- Project design  
- Future improvements  

---

## 🧠 **Test 2 – Leaderboard Points Ranking**
📍 Location: `test2-leaderboard-ranking/`

### ✔ Overview  
Python-based ranking system that:
- Reads the **points table (top)** and **spending table (bottom)** from the same sheet
- Cleans values (`DSQ`, `D$Q`, `-` → 0)
- Computes:
  - **Total Points**  
  - **Total Spending**
  - **Countback Vector** (sorted event scores for tiebreaking)
- Applies ranking rules:
  1. Higher total points  
  2. Lower total spending  
  3. Countback on event scores  
  4. Alphabetical order  
  5. Highlight remaining ties in red  

### ✔ How to Run
```

cd test2-leaderboard-ranking
pip install pandas openpyxl numpy
python rank_leaderboard.py

```

### ✔ Output Files
- `leaderboard_ranked.xlsx` (final result)
- Clean & well-structured ranking with `Rank` column

### ✔ Documentation  
See `test2-leaderboard-ranking/README.md` for detailed logic and explanation.

---

## 📝 **Assumptions**
- The input Excel file structure remains unchanged  
- Event score columns are labeled `Pts`, `Pts.1`, …  
- Spending columns are `$m`, `$m.1`, …  
- No external database is required  
- Timestamp ordering and duplicate events are not part of the test scope  

---

## 🚀 **Future Improvements**
If this were a production project, I would extend:

### For Test 1:
- Introduce Redis/PostgreSQL to store vehicle state
- Add polygon geofences using Turf.js  
- Use message queue (Kafka / RabbitMQ) for event ingestion  
- Add authentication, validation & rate limiting  
- Add unit tests and logging based on winston or pino  

### For Test 2:
- Convert script into a reusable class or CLI tool  
- Add unit tests for scoring & countback  
- Add support for CSV / JSON input formats  
- Add visualization (leaderboard graph or summary)  

---

## 📬 **Contact**
If you have any questions or would like a walk-through of the logic, I’d be happy to explain.

**Harshraj Singh**  
Email: *harshraj9804@gmail.com*

```

---


