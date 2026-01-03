# Functional Upgrade: Connect to Real-Time Data (Binance)

The current "Market Simulator" is too game-like. I want to make this a functional "Market Scanner" by connecting to live crypto data.

# Technical Pivot
1.  **Remove:** Delete the `MarketSimulator` class and the random price generation logic.
2.  **Add:** Create a `BinanceStream` class that connects to:
    `wss://stream.binance.com:9443/ws/!ticker@arr`
    * *Note:* This is the "All Market Tickers" stream. It pushes updates for every coin pair.

# Data Handling Logic
1.  **Filtering:** The stream is massive. Only listen for specific "Major Pairs" to keep the graph clean.
    * **Nodes:** BTC, ETH, SOL, BNB, USDT, USDC.
    * **Edges:** Only update rates for pairs involving these assets (e.g., ETHBTC, BTCUSDT, SOLETH).
2.  **Normalization:**
    * Store prices in a standard Map/Object.
    * Crucial: Handle the inverse rates. If Binance sends `ETHBTC = 0.04`, you must also calculate `BTCETH = 1 / 0.04`.

# Useful Features (The "Value Add")
1.  **Real Spread Calculation:**
    * Use the "Bid" price when selling and "Ask" price when buying (Standard Order Book logic).
    * This makes the arbitrage detection **realistic**. A cycle is only profitable if it beats the "Spread."
2.  **Fee Toggle:**
    * Add a checkbox: "Include 0.075% Trading Fee".
    * If checked, only highlight paths where: `Profit > (1.000 + Fees)`.

# UI Updates
* Change the top status to: "● LIVE DATA: CONNECTED (Binance Public Stream)".
* If the WebSocket disconnects, show a "Reconnecting..." warning.

# Goal
The project will now visualize *actual* market inefficiencies happening in real-time on the Binance exchange.