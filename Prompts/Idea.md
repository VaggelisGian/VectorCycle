# Role
You are a Lead Creative Technologist and Quantitative Developer.

# Project Name
**VectorCycle** (A Real-Time Triangular Arbitrage Visualization Network)

# Deployment Constraint (Critical)
The final output must be **100% Static Client-Side Code** (HTML/CSS/JS) deployable to **GitHub Pages**.
- **NO** Backend Servers (Node/Python).
- **NO** API Keys or External Data Fetching (to avoid CORS/Rate Limits).
- **NO** Build steps (Webpack/Vite). I want a plug-and-play solution.

# The Concept
Build a high-performance "Quant Trading Terminal" that visualizes how arbitrage bots find inefficiencies in the market.

Instead of a boring table of numbers, I want a **Network Graph** where:
1.  **Nodes** = Currencies (USD, BTC, ETH, SOL, EUR, JPY).
2.  **Edges** = The exchange rates connecting them.
3.  **The Goal** = Visualize the "Search" for profit cycles (e.g., USD -> BTC -> ETH -> USD > 1.00).

# Functional Requirements

## 1. The Engine (The "Market Simulator")
Since we cannot pay for high-frequency institutional data, you must write a **Realistic Market Simulator** in vanilla JavaScript.
- **Initialization:** specific realistic starting prices (e.g., BTC = ~95,000, ETH = ~3,500).
- **The Heartbeat:** Every 100ms, slightly perturb the prices using a "Random Walk" or Brownian Motion logic.
- **The Inefficiency:** Occasionally (randomly), create a "discrepancy" where the cross-rates don't match perfectly, creating a theoretical profit opportunity.

## 2. The Algorithm (Cycle Detection)
Implement a custom graph search algorithm (like Depth-First Search) that runs on every "tick" (price update).
- It must scan for triangular paths (A -> B -> C -> A).
- Calculate the product of the rates.
- If Product > 1.000 (e.g., 1.005), flag it as an **ARBITRAGE OPPORTUNITY**.

## 3. The Visuals (HTML5 Canvas)
- **Do not use chart libraries.** Draw everything on a raw `<canvas>` for maximum performance.
- **Layout:** Arrange the Currency Nodes in a neat circle or a physics-based force layout in the center of the screen.
- **Animation:**
    - Draw faint lines for all connections.
    - When an Arbitrage Cycle is found: **Highlight the path** in Neon Green and animate a "particle" or "pulse" traveling along the wire to visualize the trade execution.

## 4. The UI (Cyberpunk / Terminal Style)
- **Theme:** Deep Space Black background. Monospace fonts (green/white).
- **Control Panel:**
    - "Market Volatility" Slider: Lets the user make the market "calm" or "chaotic" (more chaos = more arb opportunities).
    - "Execution Speed" Slider: Slow down the simulation to understand what's happening.
- **The Log:** A scrolling terminal window at the bottom printing:
    `[20:45:12] DETECTED: USD->BTC->ETH->USD | Spread: +0.42%`

# Final Output
Provide the complete source code (HTML, CSS, JS) structured so I can save it and upload it directly to GitHub.