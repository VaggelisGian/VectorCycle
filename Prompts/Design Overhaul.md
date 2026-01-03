# Design Overhaul: "Institutional Grade"
The current design looks too "gamified" (neon green on black). I need you to completely re-skin this project to look like a **Professional High-Frequency Trading Terminal** (Bloomberg/Refinitiv style).

# 1. Visual Language Specs
- **Background:** Change deep black to **Dark Gunmetal Grey** (`#121417`).
- **Typography:** Use `Inter` or `Roboto Mono` for everything. Font weight should be light (300/400).
- **Color Palette:**
    - **Neutral Lines:** Very thin, faint grey (`rgba(255,255,255,0.1)`) for inactive connections.
    - **Active Nodes:** Muted Blue (`#3b82f6`) or White circles with a subtle halo.
    - **Profit Paths:** Instead of Neon Green, use **Amber/Gold** (`#f59e0b`) or **Cyan** (`#06b6d4`) for arbitrage detection.
    - **Text:** Off-white (`#e2e8f0`) for high readability.

# 2. Canvas Rendering Updates (Crucial)
- **Line Weight:** Reduce the line width of edges. They should be hairline thin (0.5px).
- **Particles:** Instead of large glowing orbs, make the "packets" small, sharp points of light moving quickly along the lines.
- **Node Design:** Draw nodes as clean, filled circles with a thin border. Add the Currency Symbol (BTC, USD) *inside* or floating elegantly *next to* the node, not obscuring it.

# 3. UI Layout Changes
- **Header:** Add a proper top bar with a "Status: Live" indicator (small pulsing green dot).
- **Log Panel:** Move the "Arbitrage Log" to a dedicated sidebar on the right (taking up 30% width) instead of the bottom. Format it like a data table (Time | Path | Spread).
- **Controls:** Style the sliders to be thin and minimal.

# Task
Rewrite the `index.html` (CSS + JS Canvas Logic) to match this "Hedge Fund" aesthetic.