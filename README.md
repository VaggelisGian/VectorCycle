# VectorCycle

> **Institutional-Grade Triangular Arbitrage Detection Terminal**

A real-time visualization platform that scans the Binance cryptocurrency market for triangular arbitrage opportunities using live WebSocket data streams.

![VectorCycle](https://img.shields.io/badge/status-live-green) ![License](https://img.shields.io/badge/license-MIT-blue) ![Build](https://img.shields.io/badge/build-static-orange)

## 🌐 [**Try It Live →**](https://vaggelisgian.github.io/VectorCycle/)

**Experience the terminal in action:** [https://vaggelisgian.github.io/VectorCycle/](https://vaggelisgian.github.io/VectorCycle/)

---

## 🚀 Features

### Real-Time Market Data
- **Live Binance WebSocket Stream**: Connects to `wss://stream.binance.com:9443/ws/!ticker@arr`
- **Multi-Asset Support**: Monitors BTC, ETH, SOL, BNB, USDT, USDC pairs
- **Bid/Ask Spreads**: Uses realistic order book pricing for accurate arbitrage detection

### Intelligent Arbitrage Detection
- **Triangular Cycle Scanning**: Finds profitable 3-hop trading paths (e.g., BTC → ETH → USDT → BTC)
- **Fee-Adjusted Calculations**: Optional 0.075% trading fee inclusion
- **Smart Filtering**: Only logs unique opportunities to avoid spam
- **Real-Time Spread Analysis**: Calculates profit percentage accounting for market inefficiencies

### Professional Visualization
- **Network Graph**: Interactive canvas rendering with nodes representing currencies
- **Animated Particles**: Golden particles flow along profitable arbitrage paths
- **Live Terminal Log**: Table-formatted log showing Time | Path | Spread
- **Connection Monitoring**: Real-time status indicator with auto-reconnection

---

## 📸 Screenshots

**Main Terminal View**
```
┌─────────────────────────────────────────────────────┐
│  VectorCycle  ● LIVE DATA: CONNECTED (Binance)     │
├─────────────────────────────────────────────────────┤
│                                                     │
│         Network Graph (Canvas Visualization)        │
│                                                     │
│    [BTC] ←→ [ETH] ←→ [SOL] ←→ [BNB]               │
│      ↕         ↕         ↕         ↕                │
│    [USDT] ←───────────────→ [USDC]                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│ ☑ Include 0.075% Trading Fee  │  Cycles: 120       │
│ Scan Speed: ▬▬▬▬▬○─── 5x      │  Profitable: 3     │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Installation

### Option 1: Clone & Run Locally
```bash
git clone https://github.com/yourusername/VectorCycle.git
cd VectorCycle
```

Then open `index.html` in any modern browser (Chrome, Firefox, Edge recommended).

### Option 2: GitHub Pages Deployment
1. Fork this repository
2. Go to **Settings** → **Pages**
3. Set source to `main` branch
4. Your live URL: `https://yourusername.github.io/VectorCycle`

---

## 📁 Project Structure

```
VectorCycle/
│
├── index.html          # Main HTML structure
├── style.css           # Institutional UI styling
├── market.js           # BinanceStream WebSocket client
├── graph.js            # ArbitrageDetector algorithm
├── renderer.js         # Canvas network visualization
├── app.js              # Main application controller
└── README.md           # This file
```

---

## 🎯 How It Works

### 1. **WebSocket Connection**
The `BinanceStream` class connects to Binance's public WebSocket API and receives real-time ticker updates for all trading pairs.

### 2. **Rate Normalization**
For each pair (e.g., `ETHBTC`), the system:
- Stores the **ask price** for buying ETH with BTC
- Calculates the **inverse bid price** for selling ETH for BTC

### 3. **Triangular Cycle Detection**
The `ArbitrageDetector` scans all possible 3-hop paths:
```
Start → Mid1 → Mid2 → Start
```

For each path, it calculates:
```javascript
product = rate1 × rate2 × rate3
spread = (product - 1) × 100
```

If `product > 1.0001`, an arbitrage opportunity exists!

### 4. **Visualization**
The `NetworkRenderer` draws:
- **Nodes**: Currency circles arranged in a circle
- **Edges**: Thin gray lines connecting all pairs
- **Highlighted Paths**: Cyan glowing lines for profitable cycles
- **Particles**: Golden dots flowing along arbitrage routes

---

## 🎮 Usage

### Controls

| Control | Description |
|---------|-------------|
| **☑ Include 0.075% Trading Fee** | Toggle realistic trading fees in profit calculations |
| **Scan Speed Slider** | Adjust detection frequency (1x = slow, 10x = fast) |
| **Cycles Counter** | Total number of triangular paths analyzed |
| **Profitable Counter** | Number of unique arbitrage opportunities found |

### Reading the Log

```
14:23:45  BTC → ETH → USDT  +0.127%
──────────────────────────────────────
  Time      Path            Spread
```

- **Green Background**: Profitable opportunity
- **Timestamp**: When the opportunity was detected
- **Path**: Trading sequence (excluding return to start)
- **Spread**: Profit percentage (after fees if enabled)

---

## 🔧 Technical Details

### Technologies Used
- **100% Vanilla JavaScript** (No frameworks or build tools)
- **HTML5 Canvas API** for high-performance rendering
- **WebSocket API** for real-time data streaming
- **CSS Grid Layout** for responsive design

### Performance Optimizations
- **Efficient Cycle Detection**: O(n³) algorithm with early termination
- **Smart Logging**: Deduplicates paths to prevent log flooding
- **Canvas Rendering**: Runs at 60 FPS with requestAnimationFrame
- **Minimal DOM Manipulation**: Updates only changed elements

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

---

## ⚙️ Configuration

### Modify Watched Currencies
Edit `market.js`:
```javascript
this.currencies = ['BTC', 'ETH', 'SOL', 'BNB', 'USDT', 'USDC'];
```

### Adjust Fee Rate
Edit `market.js`:
```javascript
this.feeRate = 0.00075; // 0.075% (Binance default)
```

### Change Detection Threshold
Edit `graph.js`:
```javascript
const threshold = 1.0001; // 0.01% minimum profit
```

---

## 🐛 Troubleshooting

### WebSocket Won't Connect
- **Check your internet connection**
- Binance may block connections from certain regions
- Try using a VPN if the stream is geo-restricted

### No Arbitrage Opportunities Detected
- This is normal! Real arbitrage windows are **rare and brief**
- Increase the scan speed slider
- Disable the fee toggle to see theoretical opportunities

### Browser Console Errors
- Ensure you're using a modern browser (check compatibility above)
- Try opening in an Incognito/Private window
- Clear browser cache and reload

---

## 📚 Learn More

### What is Triangular Arbitrage?
Triangular arbitrage exploits price discrepancies between three currencies:

```
Example:
1. Start with 1 BTC
2. Trade BTC → ETH at rate 0.04 = 25 ETH
3. Trade ETH → USDT at rate 3,500 = 87,500 USDT
4. Trade USDT → BTC at rate 0.0000115 = 1.006 BTC

Profit: 0.006 BTC (0.6%)
```

In efficient markets, these opportunities are **extremely rare** and exist for milliseconds.

### Why Are Opportunities Rare?
- **High-Frequency Trading Bots**: Execute trades in microseconds
- **Market Efficiency**: Arbitrage itself corrects price discrepancies
- **Trading Fees**: Eat into small profit margins
- **Slippage**: Actual execution prices differ from quoted prices

---

## 📄 License

MIT License - feel free to use this project for educational or commercial purposes.

---

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- [ ] Add more cryptocurrency pairs
- [ ] Implement multi-hop (4+ currency) arbitrage detection
- [ ] Add historical profit tracking charts
- [ ] Create mobile-responsive layout
- [ ] Add sound alerts for opportunities
- [ ] Export opportunities to CSV

**Pull requests** and **issues** are appreciated!

---

## 👤 Author

Built with ⚡ by a Lead Creative Technologist

---

## 🌟 Acknowledgments

- **Binance** for providing free public WebSocket streams
- **Canvas API** for enabling high-performance visualizations
- Inspired by institutional trading terminals (Bloomberg, Refinitiv)

---

## ⚠️ Disclaimer

**This tool is for educational and research purposes only.**

- Do NOT use this for actual trading without understanding the risks
- Cryptocurrency trading carries substantial risk of loss
- Past performance does not guarantee future results
- Always do your own research (DYOR)

---

**Made with 💚 for the quantitative trading community**
