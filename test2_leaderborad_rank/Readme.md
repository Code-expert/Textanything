# Test 2 – Leaderboard Points Ranking

This solution ranks players in a championship series according to the specification:

1. Highest total points.
2. Lowest total spending.
3. Countback on event scores.
4. Alphabetical order.
5. Highlight remaining ties in red.

The input file is the provided `leaderboard.xlsx` with a single sheet `Leaderboard` that contains:

- A **top table** with points per event (R01–R24).
- A **bottom table** with spending per event ($m) for the same players.

## How It Works

### 1. Reading Both Tables

`rank_leaderboard.py` loads the `Leaderboard` sheet twice:

- It finds the two header rows where the first two cells are `Pos` and `Player`.
  - The first header row belongs to the **points table**.
  - The second header row belongs to the **spending table**.
- It then reads each table separately using those header rows.

### 2. Cleaning and Totals

- In both tables, values `DSQ`, `D$Q` and `-` are converted to `0`.
- **Points table:**
  - Event columns are the `Pts`, `Pts.1`, …, `Pts.23` columns.
  - `total_points` is computed as the sum of all event points for each player.
- **Spending table:**
  - Event spending columns are `$m`, `$m.1`, … etc.
  - `total_spend` is computed as the sum of all spending columns for each player.

Players are matched between the two tables by the `Player` name.

### 3. Countback System

For each player a `countback_vector` is built:

- It is the list of all their event scores sorted in descending order
  (e.g., `[87, 86, 82, 80, 75, ...]`).
- When two players are tied on total points and total spending, their
  `countback_vector`s are compared lexicographically:
  - higher first value wins,
  - if equal, higher second value wins,
  - and so on.

### 4. Ranking Rules Applied

Players are sorted with the following priority:

1. `total_points` – **higher is better**.
2. `total_spend` – **lower is better**.
3. `countback_vector` – better score distribution wins.
4. `Player` name in alphabetical order.

The final ranking is written to `leaderboard_ranked.xlsx` with an added `Rank` column.

### 5. Remaining Ties

After sorting, the script checks for players who are still tied on:

- `total_points`
- `total_spend`
- `countback_vector`

If any such rows exist, they are printed to the console so they can be
**highlighted in red** in the final spreadsheet as required.  
For the current dataset, no players remain exactly tied after all criteria.

## Running the Script

```bash
pip install pandas openpyxl numpy
python rank_leaderboard.py
