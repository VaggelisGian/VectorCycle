class VectorCycle {
    constructor() {
        this.market = new BinanceStream();
        this.detector = new ArbitrageDetector(this.market);
        this.canvas = document.getElementById('network-canvas');
        this.renderer = new NetworkRenderer(this.canvas, this.market);
        this.terminal = document.getElementById('terminal-log');
        
        this.speed = 5;
        this.lastUpdate = 0;
        this.updateInterval = 1000;
        this.lastLoggedCycles = new Set();
        
        this.market.onStatusChange = (connected) => {
            this.updateConnectionStatus(connected);
        };
        
        this.setupControls();
        this.start();
    }

    setupControls() {
        const feesToggle = document.getElementById('fees-toggle');
        const speedSlider = document.getElementById('speed');
        const speedValue = document.getElementById('speed-value');
        
        feesToggle.addEventListener('change', (e) => {
            this.market.setIncludeFees(e.target.checked);
        });
        
        speedSlider.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            speedValue.textContent = `${this.speed}x`;
            this.updateInterval = Math.max(500, 3000 - this.speed * 250);
        });
    }

    updateConnectionStatus(connected) {
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        
        if (connected) {
            statusDot.style.background = '#10b981';
            statusText.textContent = 'LIVE DATA: CONNECTED (Binance Public Stream)';
        } else {
            statusDot.style.background = '#f59e0b';
            statusText.textContent = 'Reconnecting...';
        }
    }

    start() {
        const loop = (timestamp) => {
            if (timestamp - this.lastUpdate >= this.updateInterval) {
                this.update();
                this.lastUpdate = timestamp;
            }
            this.renderer.draw(this.detector.cycles);
            requestAnimationFrame(loop);
        };
        
        requestAnimationFrame(loop);
    }

    update() {
        const cycles = this.detector.detectArbitrage();
        
        cycles.forEach(cycle => {
            if (cycle.profitable) {
                const pathKey = cycle.path.join('-');
                if (!this.lastLoggedCycles.has(pathKey)) {
                    this.logArbitrage(cycle);
                    this.lastLoggedCycles.add(pathKey);
                }
            }
        });
        
        if (this.lastLoggedCycles.size > 50) {
            this.lastLoggedCycles.clear();
        }
        
        this.updateStats();
    }

    logArbitrage(cycle) {
        const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        const path = cycle.path.slice(0, -1).join(' → ');
        const spread = cycle.spread.toFixed(3);
        const className = cycle.profitable ? 'log-profit' : 'log-loss';
        
        const entry = document.createElement('div');
        entry.className = `log-entry ${className}`;
        entry.innerHTML = `
            <span class="log-timestamp">${timestamp}</span>
            <span class="log-path">${path}</span>
            <span class="log-spread">${spread > 0 ? '+' : ''}${spread}%</span>
        `;
        
        this.terminal.insertBefore(entry, this.terminal.firstChild);
        
        if (this.terminal.children.length > 100) {
            this.terminal.removeChild(this.terminal.lastChild);
        }
    }

    updateStats() {
        const stats = this.detector.getStats();
        document.getElementById('cycles-count').textContent = stats.total;
        document.getElementById('profitable-count').textContent = stats.profitable;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VectorCycle();
});
