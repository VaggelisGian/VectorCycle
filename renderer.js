class NetworkRenderer {
    constructor(canvas, market) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.market = market;
        this.nodes = [];
        this.particles = [];
        this.setupCanvas();
        this.initializeNodes();
    }

    setupCanvas() {
        const updateSize = () => {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width * window.devicePixelRatio;
            this.canvas.height = rect.height * window.devicePixelRatio;
            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            this.width = rect.width;
            this.height = rect.height;
        };
        
        updateSize();
        window.addEventListener('resize', () => updateSize());
    }

    initializeNodes() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(this.width, this.height) * 0.35;
        
        this.nodes = this.market.currencies.map((currency, i) => {
            const angle = (i / this.market.currencies.length) * Math.PI * 2 - Math.PI / 2;
            return {
                currency,
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                radius: 40
            };
        });
    }

    draw(cycles) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.drawConnections();
        this.drawHighlightedCycles(cycles);
        this.drawNodes();
        this.updateParticles();
        this.drawParticles();
    }

    drawConnections() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                this.ctx.stroke();
            }
        }
    }

    drawHighlightedCycles(cycles) {
        cycles.forEach((cycle, index) => {
            if (!cycle.profitable) return;
            
            const opacity = Math.max(0.4, 1 - index * 0.15);
            this.ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
            this.ctx.lineWidth = 1.5 - index * 0.2;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
            
            for (let i = 0; i < cycle.path.length - 1; i++) {
                const fromNode = this.nodes.find(n => n.currency === cycle.path[i]);
                const toNode = this.nodes.find(n => n.currency === cycle.path[i + 1]);
                
                if (fromNode && toNode) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(fromNode.x, fromNode.y);
                    this.ctx.lineTo(toNode.x, toNode.y);
                    this.ctx.stroke();
                }
            }
            
            this.ctx.shadowBlur = 0;
            
            if (index === 0 && Math.random() < 0.4) {
                this.createParticle(cycle.path);
            }
        });
    }

    drawNodes() {
        this.nodes.forEach(node => {
            this.ctx.fillStyle = '#1a1d23';
            this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
            this.ctx.lineWidth = 1.5;
            
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = 'rgba(59, 130, 246, 0.3)';
            
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            this.ctx.shadowBlur = 0;
            
            this.ctx.fillStyle = '#e2e8f0';
            this.ctx.font = '500 13px "Inter"';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.currency, node.x, node.y);
        });
    }

    createParticle(path) {
        const nodes = path.map(currency => this.nodes.find(n => n.currency === currency));
        this.particles.push({
            path: nodes,
            progress: 0,
            speed: 0.04,
            currentSegment: 0
        });
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.progress += particle.speed;
            
            if (particle.progress >= 1) {
                particle.progress = 0;
                particle.currentSegment++;
                
                if (particle.currentSegment >= particle.path.length - 1) {
                    return false;
                }
            }
            
            return true;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            if (particle.currentSegment >= particle.path.length - 1) return;
            
            const from = particle.path[particle.currentSegment];
            const to = particle.path[particle.currentSegment + 1];
            
            const x = from.x + (to.x - from.x) * particle.progress;
            const y = from.y + (to.y - from.y) * particle.progress;
            
            this.ctx.fillStyle = '#f59e0b';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.shadowBlur = 0;
        });
    }
}
