import pandas as pd
import numpy as np

INPUT_FILE = "leaderboard.xlsx"
OUTPUT_FILE = "leaderboard_ranked.xlsx"
SHEET = "Leaderboard"   # sheet name shown at the bottom of Excel


# ---------- Helpers ----------

def clean_value(x):
    """Convert DSQ / D$Q / '-' to 0, keep numbers as floats."""
    if isinstance(x, (int, float, np.integer, np.floating)):
        return float(x)
    if isinstance(x, str):
        s = x.strip().upper()
        if s in ("-", "DSQ", "D$Q"):
            return 0.0
        try:
            return float(s)
        except ValueError:
            return 0.0
    return 0.0


# ---------- Load both tables from one sheet ----------

def load_points_and_spending():
    # Read raw so we can find both header rows ("Pos", "Player")
    raw = pd.read_excel(INPUT_FILE, sheet_name=SHEET, header=None)

    header_rows = raw.index[
        (raw.iloc[:, 0] == "Pos") & (raw.iloc[:, 1] == "Player")
    ].tolist()

    if len(header_rows) < 2:
        raise ValueError(
            f"Expected to find 2 header rows ('Pos','Player') but found {len(header_rows)}."
        )

    top_header_row = header_rows[0]      # points table header
    bottom_header_row = header_rows[1]   # spending table header

    # Read top table (points)
    points_df = pd.read_excel(
        INPUT_FILE, sheet_name=SHEET, header=top_header_row
    )
    # Read bottom table (spending)
    spending_df = pd.read_excel(
        INPUT_FILE, sheet_name=SHEET, header=bottom_header_row
    )

    # -------- Clean points table --------
    player_col_points = points_df.columns[1]  # column B
    points_df = points_df[points_df[player_col_points].notna()]
    points_df = points_df[points_df[player_col_points] != "Points Totals"]

    # Event score columns: Pts, Pts.1, ..., Pts.23
    score_cols = [
        col for col in points_df.columns
        if isinstance(col, str) and (col == "Pts" or col.startswith("Pts."))
    ]

    for col in score_cols:
        points_df[col] = points_df[col].apply(clean_value)

    # Recalculate total points from event columns
    points_df["total_points"] = points_df[score_cols].sum(axis=1)

    # -------- Clean spending table --------
    player_col_spend = spending_df.columns[1]  # column B
    spending_df = spending_df[spending_df[player_col_spend].notna()]
    spending_df = spending_df[spending_df[player_col_spend] != "Spending Totals"]

    # Per-event spending columns: "$m", "$m.1", ...
    spend_event_cols = [
        col for col in spending_df.columns
        if isinstance(col, str)
        and (col == "$m" or col.startswith("$m."))
    ]

    for col in spend_event_cols:
        spending_df[col] = spending_df[col].apply(clean_value)

    # Compute total spending from per-event values
    spending_df["total_spend"] = spending_df[spend_event_cols].sum(axis=1)

    # Also detect the original "Spent ($m)" column for reference (optional)
    spent_summary_cols = [
        col for col in spending_df.columns
        if isinstance(col, str) and "spent" in col.lower()
    ]
    spent_summary_col = spent_summary_cols[0] if spent_summary_cols else None

    # -------- Merge by player name --------
    points_df = points_df.rename(columns={player_col_points: "Player"})
    spending_df = spending_df.rename(columns={player_col_spend: "Player"})

    merged = points_df[["Player", "total_points"] + score_cols].merge(
        spending_df[["Player", "total_spend"] + (
            [spent_summary_col] if spent_summary_col else []
        )],
        on="Player",
        how="inner"
    )

    return merged, score_cols


# ---------- Ranking logic ----------

def build_countback_vector(row, score_cols):
    scores = [row[c] for c in score_cols]
    return tuple(sorted(scores, reverse=True))


def rank_players(df, score_cols):
    df = df.copy()
    df["countback_vector"] = df.apply(
        lambda r: build_countback_vector(r, score_cols),
        axis=1
    )

    records = df.to_dict(orient="records")

    def sort_key(rec):
        # Invert scores in countback vector for descending ordering
        inv_cb = tuple(-v for v in rec["countback_vector"])
        return (
            -rec["total_points"],      # 1) higher total points
            rec["total_spend"],        # 2) lower total spend
            inv_cb,                    # 3) better score pattern (countback)
            rec["Player"].lower()      # 4) alphabetical
        )

    ranked = sorted(records, key=sort_key)
    ranked_df = pd.DataFrame(ranked)
    ranked_df.insert(0, "Rank", range(1, len(ranked_df) + 1))
    return ranked_df


# ---------- Main ----------

def main():
    merged, score_cols = load_points_and_spending()
    ranked_df = rank_players(merged, score_cols)

    ranked_df.to_excel(OUTPUT_FILE, index=False)
    print(f"\n✅ Ranking complete using BOTH points and spending tables.")
    print(f"Output written to: {OUTPUT_FILE}")

    # Detect players still tied after all criteria
    tied = ranked_df[
        ranked_df.duplicated(
            subset=["total_points", "total_spend", "countback_vector"],
            keep=False
        )
    ]

    if not tied.empty:
        print("\n⚠ Players STILL tied after all rules (highlight these names in red):")
        print(tied[["Player", "total_points", "total_spend"]])
    else:
        print("\nNo exact ties remain after all tiebreakers.")

if __name__ == "__main__":
    main()
