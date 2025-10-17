<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dinic's Algorithm Visualizer</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            color: #fff;
            overflow-x: hidden;
            min-height: 100vh;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            animation: fadeInDown 0.8s ease-out;
        }

        .title {
            font-size: 3.5rem;
            font-weight: 900;
            margin-bottom: 10px;
        }

        .title-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            font-size: 1.2rem;
            color: #cbd5e1;
            font-weight: 300;
            letter-spacing: 2px;
        }

        .canvas-container {
            position: relative;
            background: rgba(15, 23, 42, 0.6);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            border: 2px solid rgba(102, 126, 234, 0.3);
            animation: fadeIn 1s ease-out;
        }

        #graphCanvas {
            width: 100%;
            height: auto;
            border-radius: 12px;
            display: block;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6));
            padding: 25px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.3s;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .stat-icon {
            font-size: 2.5rem;
        }

        .stat-content {
            flex: 1;
        }

        .stat-label {
            font-size: 0.9rem;
            color: #94a3b8;
            margin-bottom: 5px;
            text-transform: uppercase;
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #fff;
        }

        .stat-phase-text {
            font-size: 1.2rem;
        }

        .stat-flow { border-left: 4px solid #10b981; }
        .stat-phase { border-left: 4px solid #3b82f6; }
        .stat-step { border-left: 4px solid #a78bfa; }
        .stat-iterations { border-left: 4px solid #f59e0b; }

        .control-panel {
            background: rgba(30, 41, 59, 0.8);
            padding: 30px;
            border-radius: 20px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            border: 2px solid rgba(102, 126, 234, 0.2);
        }

        .control-section {
            margin-bottom: 30px;
        }

        .control-section:last-child {
            margin-bottom: 0;
        }

        .control-title {
            font-size: 1.3rem;
            margin-bottom: 15px;
            color: #e2e8f0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .button-group {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }

        .btn {
            padding: 15px 30px;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .btn:active {
            transform: scale(0.95);
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-secondary {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
        }

        .btn-danger {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .speed-control {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        .speed-slider {
            flex: 1;
            min-width: 200px;
            height: 8px;
            border-radius: 5px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            outline: none;
        }

        .speed-value {
            background: rgba(139, 92, 246, 0.3);
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 600;
            color: #a78bfa;
            min-width: 60px;
            text-align: center;
        }

        .toggle-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .toggle-item {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            padding: 10px;
            border-radius: 8px;
            transition: background 0.3s;
        }

        .toggle-item:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        .toggle-item input {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }

        .legend {
            background: rgba(30, 41, 59, 0.8);
            padding: 20px 30px;
            border-radius: 16px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .legend-title {
            font-size: 1.2rem;
            margin-bottom: 15px;
            color: #e2e8f0;
        }

        .legend-items {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #cbd5e1;
        }

        .legend-dot {
            width: 20px;
            height: 20px;
            border-radius: 50%;
        }

        .legend-source { background: #10b981; }
        .legend-sink { background: #ef4444; }
        .legend-normal { background: #64748b; }
        .legend-level { background: #3b82f6; }

        .legend-line {
            width: 30px;
            height: 3px;
            border-radius: 2px;
        }

        .legend-edge { background: #64748b; }
        .legend-flow { background: #22c55e; }

        .footer {
            text-align: center;
            padding: 30px 0;
            color: #94a3b8;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1 class="title">
                <span class="title-gradient">Dinic's Algorithm Visualizer</span>
            </h1>
            <p class="subtitle">Maximum Flow Problem • O(V²E) Time Complexity</p>
        </header>

        <div class="canvas-container">
            <canvas id="graphCanvas" width="1000" height="600"></canvas>
        </div>

        <div class="stats-grid">
            <div class="stat-card stat-flow">
                <div class="stat-icon">💧</div>
                <div class="stat-content">
                    <div class="stat-label">Maximum Flow</div>
                    <div class="stat-value" id="maxFlowValue">0</div>
                </div>
            </div>

            <div class="stat-card stat-phase">
                <div class="stat-icon">⚡</div>
                <div class="stat-content">
                    <div class="stat-label">Current Phase</div>
                    <div class="stat-value stat-phase-text" id="currentPhase">Ready to Start</div>
                </div>
            </div>

            <div class="stat-card stat-step">
                <div class="stat-icon">📊</div>
                <div class="stat-content">
                    <div class="stat-label">Progress</div>
                    <div class="stat-value" id="stepValue">0 / 9</div>
                </div>
            </div>

            <div class="stat-card stat-iterations">
                <div class="stat-icon">🔄</div>
                <div class="stat-content">
                    <div class="stat-label">Iterations</div>
                    <div class="stat-value" id="iterationValue">0</div>
                </div>
            </div>
        </div>

        <div class="control-panel">
            <div class="control-section">
                <h3 class="control-title">
                    <span>🎮</span>
                    Playback Controls
                </h3>
                <div class="button-group">
                    <button class="btn btn-primary" id="playBtn">
                        <span id="playIcon">▶</span>
                        <span id="playText">Play</span>
                    </button>
                    <button class="btn btn-secondary" id="stepBtn">
                        <span>⏭</span>
                        <span>Step</span>
                    </button>
                    <button class="btn btn-danger" id="resetBtn">
                        <span>↻</span>
                        <span>Reset</span>
                    </button>
                </div>
            </div>

            <div class="control-section">
                <h3 class="control-title">
                    <span>⚙️</span>
                    Speed Control
                </h3>
                <div class="speed-control">
                    <label>🐌 Slow</label>
                    <input type="range" id="speedSlider" min="200" max="2000" step="200" value="1000" class="speed-slider">
                    <label>Fast 🚀</label>
                    <div class="speed-value" id="speedValue">1.2x</div>
                </div>
            </div>

            <div class="control-section">
                <h3 class="control-title">
                    <span>🎨</span>
                    Visualization Options
                </h3>
                <div class="toggle-group">
                    <label class="toggle-item">
                        <input type="checkbox" id="showLabels" checked>
                        <span>Show Edge Labels</span>
                    </label>
                    <label class="toggle-item">
                        <input type="checkbox" id="showAnimation" checked>
                        <span>Smooth Animations</span>
                    </label>
                    <label class="toggle-item">
                        <input type="checkbox" id="showLevels" checked>
                        <span>Highlight Levels</span>
                    </label>
                </div>
            </div>
        </div>

        <div class="legend">
            <h3 class="legend-title">Legend</h3>
            <div class="legend-items">
                <div class="legend-item">
                    <div class="legend-dot legend-source"></div>
                    <span>Source Node</span>
                </div>
                <div class="legend-item">
                    <div class="legend-dot legend-sink"></div>
                    <span>Sink Node</span>
                </div>
                <div class="legend-item">
                    <div class="legend-dot legend-normal"></div>
                    <span>Normal Node</span>
                </div>
                <div class="legend-item">
                    <div class="legend-dot legend-level"></div>
                    <span>Level Graph Node</span>
                </div>
                <div class="legend-item">
                    <div class="legend-line legend-edge"></div>
                    <span>Edge</span>
                </div>
                <div class="legend-item">
                    <div class="legend-line legend-flow"></div>
                    <span>Flow Path</span>
                </div>
            </div>
        </div>

        <footer class="footer">
            <p>Interactive Visualization of Dinic's Maximum Flow Algorithm</p>
        </footer>
    </div>

    <script>
        const graphData = {
            nodes: [
                { id: 0, x: 150, y: 300, label: 'S', type: 'source' },
                { id: 1, x: 350, y: 180, label: '1', type: 'normal' },
                { id: 2, x: 350, y: 420, label: '2', type: 'normal' },
                { id: 3, x: 600, y: 180, label: '3', type: 'normal' },
                { id: 4, x: 600, y: 420, label: '4', type: 'normal' },
                { id: 5, x: 850, y: 300, label: 'T', type: 'sink' }
            ],
            edges: [
                { from: 0, to: 1, capacity: 10, flow: 0 },
                { from: 0, to: 2, capacity: 10, flow: 0 },
                { from: 1, to: 2, capacity: 2, flow: 0 },
                { from: 1, to: 3, capacity: 4, flow: 0 },
                { from: 1, to: 4, capacity: 8, flow: 0 },
                { from: 2, to: 4, capacity: 9, flow: 0 },
                { from: 3, to: 5, capacity: 10, flow: 0 },
                { from: 4, to: 3, capacity: 6, flow: 0 },
                { from: 4, to: 5, capacity: 10, flow: 0 }
            ]
        };

        let state = {
            isPlaying: false,
            speed: 1000,
            step: 0,
            maxFlow: 0,
            iterations: 0,
            currentPhase: 'Ready to Start',
            levelGraph: [],
            highlightedEdges: [],
            flowPath: [],
            showLabels: true,
            showAnimation: true,
            showLevels: true,
            graph: JSON.parse(JSON.stringify(graphData))
        };

        const canvas = document.getElementById('graphCanvas');
        const ctx = canvas.getContext('2d');
        const playBtn = document.getElementById('playBtn');
        const stepBtn = document.getElementById('stepBtn');
        const resetBtn = document.getElementById('resetBtn');
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        const maxFlowValue = document.getElementById('maxFlowValue');
        const currentPhase = document.getElementById('currentPhase');
        const stepValue = document.getElementById('stepValue');
        const iterationValue = document.getElementById('iterationValue');
        const playIcon = document.getElementById('playIcon');
        const playText = document.getElementById('playText');
        const showLabelsCheckbox = document.getElementById('showLabels');
        const showAnimationCheckbox = document.getElementById('showAnimation');
        const showLevelsCheckbox = document.getElementById('showLevels');

        function drawGraph() {
            const width = canvas.width;
            const height = canvas.height;
            
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#0f172a');
            gradient.addColorStop(0.5, '#1e1b4b');
            gradient.addColorStop(1, '#1e293b');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            state.graph.edges.forEach((edge, idx) => {
                drawEdge(edge, idx);
            });
            
            state.graph.nodes.forEach((node) => {
                drawNode(node);
            });
        }

        function drawEdge(edge, idx) {
            const fromNode = state.graph.nodes[edge.from];
            const toNode = state.graph.nodes[edge.to];
            
            const isHighlighted = state.highlightedEdges.includes(idx);
            const isInPath = state.flowPath.some(p => p.from === edge.from && p.to === edge.to);
            
            const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
            const startX = fromNode.x + Math.cos(angle) * 35;
            const startY = fromNode.y + Math.sin(angle) * 35;
            const endX = toNode.x - Math.cos(angle) * 35;
            const endY = toNode.y - Math.sin(angle) * 35;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            
            if (isInPath) {
                ctx.strokeStyle = '#22c55e';
                ctx.lineWidth = 5;
                ctx.shadowColor = '#22c55e';
                ctx.shadowBlur = 20;
            } else if (isHighlighted) {
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 4;
                ctx.shadowColor = '#3b82f6';
                ctx.shadowBlur = 15;
            } else if (edge.flow > 0) {
                const flowRatio = edge.flow / edge.capacity;
                ctx.strokeStyle = 'rgba(139, 92, 246, ' + (0.5 + flowRatio * 0.5) + ')';
                ctx.lineWidth = 2 + flowRatio * 2;
                ctx.shadowColor = '#8b5cf6';
                ctx.shadowBlur = 10;
            } else {
                ctx.strokeStyle = '#475569';
                ctx.lineWidth = 2;
                ctx.shadowBlur = 0;
            }
            
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            const arrowSize = 12;
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
                endX - arrowSize * Math.cos(angle - Math.PI / 6),
                endY - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(endX, endY);
            ctx.lineTo(
                endX - arrowSize * Math.cos(angle + Math.PI / 6),
                endY - arrowSize * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
            
            if (state.showLabels) {
                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;
                const offsetX = -Math.sin(angle) * 25;
                const offsetY = Math.cos(angle) * 25;
                
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(midX + offsetX - 28, midY + offsetY - 14, 56, 28);
                
                ctx.font = 'bold 13px Inter';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = edge.flow > 0 ? '#a78bfa' : '#cbd5e1';
                ctx.fillText(edge.flow + '/' + edge.capacity, midX + offsetX, midY + offsetY);
            }
        }

        function drawNode(node) {
            const isInLevel = state.showLevels && state.levelGraph.includes(node.id);
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, 35, 0, Math.PI * 2);
            
            if (node.type === 'source') {
                const sourceGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 35);
                sourceGrad.addColorStop(0, '#34d399');
                sourceGrad.addColorStop(1, '#10b981');
                ctx.fillStyle = sourceGrad;
            } else if (node.type === 'sink') {
                const sinkGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 35);
                sinkGrad.addColorStop(0, '#f87171');
                sinkGrad.addColorStop(1, '#ef4444');
                ctx.fillStyle = sinkGrad;
            } else if (isInLevel) {
                const levelGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 35);
                levelGrad.addColorStop(0, '#60a5fa');
                levelGrad.addColorStop(1, '#3b82f6');
                ctx.fillStyle = levelGrad;
            } else {
                const normalGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 35);
                normalGrad.addColorStop(0, '#64748b');
                normalGrad.addColorStop(1, '#475569');
                ctx.fillStyle = normalGrad;
            }
            
            ctx.fill();
            
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            ctx.font = 'bold 22px Inter';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label, node.x, node.y);
        }

        function simulateDinicStep() {
            if (state.step === 0) {
                state.currentPhase = 'Building Level Graph (BFS)';
                state.levelGraph = [0, 1, 2];
                state.highlightedEdges = [0, 1];
            } else if (state.step === 1) {
                state.levelGraph = [0, 1, 2, 3, 4, 5];
                state.highlightedEdges = [3, 4, 5, 6, 8];
                state.currentPhase = 'Level Graph Complete';
            } else if (state.step === 2) {
                state.currentPhase = 'Finding Blocking Flow (DFS)';
                state.flowPath = [{ from: 0, to: 1 }, { from: 1, to: 3 }, { from: 3, to: 5 }];
                state.highlightedEdges = [0, 3, 6];
            } else if (state.step === 3) {
                pushFlow([
                    { from: 0, to: 1 },
                    { from: 1, to: 3 },
                    { from: 3, to: 5 }
                ], 4);
                state.flowPath = [];
                state.currentPhase = 'Flow Pushed: +4 units';
                state.iterations++;
            } else if (state.step === 4) {
                state.flowPath = [{ from: 0, to: 2 }, { from: 2, to: 4 }, { from: 4, to: 5 }];
                state.highlightedEdges = [1, 5, 8];
                state.currentPhase = 'Finding Next Path';
            } else if (state.step === 5) {
                pushFlow([
                    { from: 0, to: 2 },
                    { from: 2, to: 4 },
                    { from: 4, to: 5 }
                ], 9);
                state.flowPath = [];
                state.currentPhase = 'Flow Pushed: +9 units';
                state.iterations++;
            } else if (state.step === 6) {
                state.flowPath = [
                    { from: 0, to: 1 },
                    { from: 1, to: 4 },
                    { from: 4, to: 3 },
                    { from: 3, to: 5 }
                ];
                state.highlightedEdges = [0, 4, 7, 6];
                state.currentPhase = 'Complex Path Found';
            } else if (state.step === 7) {
                pushFlow([
                    { from: 0, to: 1 },
                    { from: 1, to: 4 },
                    { from: 4, to: 3 },
                    { from: 3, to: 5 }
                ], 6);
                state.flowPath = [];
                state.currentPhase = 'Flow Pushed: +6 units';
                state.iterations++;
            } else if (state.step === 8) {
                state.currentPhase = 'Algorithm Complete!';
                state.highlightedEdges = [];
                state.levelGraph = [];
                state.isPlaying = false;
                updatePlayButton();
            }
            
            state.step++;
            updateUI();
            drawGraph();
        }

        function pushFlow(path, amount) {
            for (var i = 0; i < path.length; i++) {
                var p = path[i];
                for (var j = 0; j < state.graph.edges.length; j++) {
                    var edge = state.graph.edges[j];
                    if (edge.from === p.from && edge.to === p.to) {
                        edge.flow += amount;
                        break;
                    }
                }
            }
            state.maxFlow += amount;
        }

        function updateUI() {
            maxFlowValue.textContent = state.maxFlow;
            currentPhase.textContent = state.currentPhase;
            stepValue.textContent = state.step + ' / 9';
            iterationValue.textContent = state.iterations;
        }

        function updatePlayButton() {
            if (state.isPlaying) {
                playIcon.textContent = '⏸';
                playText.textContent = 'Pause';
            } else {
                playIcon.textContent = '▶';
                playText.textContent = 'Play';
            }
        }

        playBtn.addEventListener('click', function() {
            if (state.step >= 9) return;
            state.isPlaying = !state.isPlaying;
            updatePlayButton();
            if (state.isPlaying) {
                runAlgorithm();
            }
        });

        stepBtn.addEventListener('click', function() {
            if (state.step >= 9) return;
            state.isPlaying = false;
            updatePlayButton();
            simulateDinicStep();
        });

        resetBtn.addEventListener('click', function() {
            state.isPlaying = false;
            state.step = 0;
            state.maxFlow = 0;
            state.iterations = 0;
            state.currentPhase = 'Ready to Start';
            state.levelGraph = [];
            state.highlightedEdges = [];
            state.flowPath = [];
            state.graph = JSON.parse(JSON.stringify(graphData));
            updatePlayButton();
            updateUI();
            drawGraph();
        });

        speedSlider.addEventListener('input', function(e) {
            state.speed = parseInt(e.target.value);
            const speedMultiplier = (2200 - state.speed) / 1000;
            speedValue.textContent = speedMultiplier.toFixed(1) + 'x';
        });

        showLabelsCheckbox.addEventListener('change', function(e) {
            state.showLabels = e.target.checked;
            drawGraph();
        });

        showAnimationCheckbox.addEventListener('change', function(e) {
            state.showAnimation = e.target.checked;
            drawGraph();
        });

        showLevelsCheckbox.addEventListener('change', function(e) {
            state.showLevels = e.target.checked;
            drawGraph();
        });

        function runAlgorithm() {
            if (!state.isPlaying || state.step >= 9) {
                state.isPlaying = false;
                updatePlayButton();
                return;
            }
            
            simulateDinicStep();
            
            setTimeout(function() {
                runAlgorithm();
            }, state.speed);
        }

        function init() {
            drawGraph();
            updateUI();
        }

        init();
    </script>
</body>
</html>
