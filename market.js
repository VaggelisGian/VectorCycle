class BinanceStream {
    constructor() {
        this.currencies = ['BTC', 'ETH', 'SOL', 'BNB', 'USDT', 'USDC'];
        this.rates = {};
        this.ws = null;
        this.connected = false;
        this.reconnectTimeout = null;
        this.includeFees = false;
        this.feeRate = 0.00075;
        this.onStatusChange = null;
        
        this.initializeRates();
        this.connect();
    }

    initializeRates() {
        for (let from of this.currencies) {
            this.rates[from] = {};
            for (let to of this.currencies) {
                if (from !== to) {
                    this.rates[from][to] = 0;
                }
            }
        }
    }

    connect() {
        try {
            this.ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
            
            this.ws.onopen = () => {
                this.connected = true;
                console.log('Connected to Binance WebSocket');
                if (this.onStatusChange) this.onStatusChange(true);
            };
            
            this.ws.onmessage = (event) => {
                this.handleMessage(event.data);
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            
            this.ws.onclose = () => {
                this.connected = false;
                console.log('WebSocket disconnected. Reconnecting...');
                if (this.onStatusChange) this.onStatusChange(false);
                
                this.reconnectTimeout = setTimeout(() => {
                    this.connect();
                }, 3000);
            };
        } catch (error) {
            console.error('Failed to connect:', error);
            this.reconnectTimeout = setTimeout(() => {
                this.connect();
            }, 3000);
        }
    }

    handleMessage(data) {
        try {
            const tickers = JSON.parse(data);
            
            tickers.forEach(ticker => {
                const symbol = ticker.s;
                const price = parseFloat(ticker.c);
                const bid = parseFloat(ticker.b);
                const ask = parseFloat(ticker.a);
                
                if (!price || price <= 0) return;
                
                const pair = this.parsePair(symbol);
                if (pair) {
                    const { base, quote } = pair;
                    
                    const buyRate = ask > 0 ? ask : price;
                    const sellRate = bid > 0 ? bid : price;
                    
                    this.rates[quote][base] = buyRate;
                    
                    if (sellRate > 0) {
                        this.rates[base][quote] = 1 / sellRate;
                    }
                }
            });
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    }

    parsePair(symbol) {
        for (let base of this.currencies) {
            for (let quote of this.currencies) {
                if (base !== quote && symbol === `${base}${quote}`) {
                    return { base, quote };
                }
            }
        }
        return null;
    }

    getRate(from, to) {
        if (from === to) return 1;
        const rate = this.rates[from]?.[to] || 0;
        
        if (this.includeFees && rate > 0) {
            return rate * (1 - this.feeRate);
        }
        
        return rate;
    }

    setIncludeFees(value) {
        this.includeFees = value;
    }

    isConnected() {
        return this.connected;
    }

    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        if (this.ws) {
            this.ws.close();
        }
    }
}
