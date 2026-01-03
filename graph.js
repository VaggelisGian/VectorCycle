class ArbitrageDetector {
    constructor(market) {
        this.market = market;
        this.cycles = [];
        this.profitableCycles = 0;
        this.totalCycles = 0;
        this.detectedPaths = new Set();
    }

    detectArbitrage() {
        this.cycles = [];
        const currencies = this.market.currencies;
        const newDetectedPaths = new Set();

        for (let start of currencies) {
            for (let mid1 of currencies) {
                if (mid1 === start) continue;
                
                for (let mid2 of currencies) {
                    if (mid2 === start || mid2 === mid1) continue;
                    
                    const rate1 = this.market.getRate(start, mid1);
                    const rate2 = this.market.getRate(mid1, mid2);
                    const rate3 = this.market.getRate(mid2, start);
                    
                    if (rate1 === 0 || rate2 === 0 || rate3 === 0) continue;
                    
                    const product = rate1 * rate2 * rate3;
                    const threshold = this.market.includeFees ? 1.0001 : 1.0001;
                    const spread = (product - 1) * 100;
                    
                    const pathKey = `${start}-${mid1}-${mid2}`;
                    
                    if (product > threshold) {
                        this.cycles.push({
                            path: [start, mid1, mid2, start],
                            product: product,
                            spread: spread,
                            profitable: true,
                            rates: [rate1, rate2, rate3]
                        });
                        
                        if (!this.detectedPaths.has(pathKey)) {
                            this.profitableCycles++;
                            newDetectedPaths.add(pathKey);
                        }
                    }
                    
                    this.totalCycles++;
                }
            }
        }

        this.detectedPaths = newDetectedPaths;
        this.cycles.sort((a, b) => b.spread - a.spread);
        return this.cycles.slice(0, 5);
    }

    getStats() {
        return {
            total: this.totalCycles,
            profitable: this.profitableCycles
        };
    }
}
