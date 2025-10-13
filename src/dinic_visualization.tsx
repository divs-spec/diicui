import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Zap } from 'lucide-react';

const DinicVisualizer = () => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [step, setStep] = useState(0);
  const [maxFlow, setMaxFlow] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('idle');
  const [levelGraph, setLevelGraph] = useState([]);
  const [highlightedEdges, setHighlightedEdges] = useState([]);
  const [flowPath, setFlowPath] = useState([]);
  
  // Graph structure with positions for visualization
  const [graph, setGraph] = useState({
    nodes: [
      { id: 0, x: 100, y: 250, label: 'S', type: 'source' },
      { id: 1, x: 300, y: 150, label: '1', type: 'normal' },
      { id: 2, x: 300, y: 350, label: '2', type: 'normal' },
      { id: 3, x: 500, y: 150, label: '3', type: 'normal' },
      { id: 4, x: 500, y: 350, label: '4', type: 'normal' },
      { id: 5, x: 700, y: 250, label: 'T', type: 'sink' }
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
  });

  const resetGraph = () => {
    setGraph(prev => ({
      ...prev,
      edges: prev.edges.map(e => ({ ...e, flow: 0 }))
    }));
    setMaxFlow(0);
    setStep(0);
    setCurrentPhase('idle');
    setLevelGraph([]);
    setHighlightedEdges([]);
    setFlowPath([]);
    setIsPlaying(false);
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw edges
    graph.edges.forEach((edge, idx) => {
      const fromNode = graph.nodes[edge.from];
      const toNode = graph.nodes[edge.to];
      
      const isHighlighted = highlightedEdges.includes(idx);
      const isInPath = flowPath.some(p => p.from === edge.from && p.to === edge.to);
      
      // Edge line
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      
      if (isInPath) {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 15;
      } else if (isHighlighted) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 10;
      } else {
        ctx.strokeStyle = edge.flow > 0 ? '#8b5cf6' : '#475569';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
      }
      
      ctx.stroke();
      
      // Arrow head
      const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
      const arrowLength = 15;
      const arrowX = toNode.x - Math.cos(angle) * 35;
      const arrowY = toNode.y - Math.sin(angle) * 35;
      
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle - Math.PI / 6),
        arrowY - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle + Math.PI / 6),
        arrowY - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Edge label (capacity/flow)
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      const offsetX = -Math.sin(angle) * 20;
      const offsetY = Math.cos(angle) * 20;
      
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(midX + offsetX - 25, midY + offsetY - 12, 50, 24);
      
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = edge.flow > 0 ? '#a78bfa' : '#cbd5e1';
      ctx.fillText(
        `${edge.flow}/${edge.capacity}`,
        midX + offsetX,
        midY + offsetY
      );
    });
    
    // Draw nodes
    graph.nodes.forEach((node) => {
      const isInLevel = levelGraph.includes(node.id);
      
      // Node shadow/glow
      ctx.beginPath();
      ctx.arc(node.x, node.y, 35, 0, Math.PI * 2);
      
      if (node.type === 'source') {
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 20;
      } else if (node.type === 'sink') {
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 20;
      } else if (isInLevel) {
        ctx.fillStyle = '#3b82f6';
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 15;
      } else {
        ctx.fillStyle = '#475569';
        ctx.shadowBlur = 10;
      }
      
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Node border
      ctx.beginPath();
      ctx.arc(node.x, node.y, 35, 0, Math.PI * 2);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Node label
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });
  };

  useEffect(() => {
    drawGraph();
  }, [graph, highlightedEdges, levelGraph, flowPath]);

  const simulateDinicStep = () => {
    // Simplified Dinic's algorithm simulation for visualization
    if (step === 0) {
      setCurrentPhase('Building Level Graph');
      setLevelGraph([0, 1, 2]);
      setHighlightedEdges([0, 1]);
    } else if (step === 1) {
      setLevelGraph([0, 1, 2, 3, 4, 5]);
      setHighlightedEdges([3, 4, 5, 6, 8]);
      setCurrentPhase('Level Graph Complete');
    } else if (step === 2) {
      setCurrentPhase('Finding Blocking Flow');
      setFlowPath([{ from: 0, to: 1 }, { from: 1, to: 3 }, { from: 3, to: 5 }]);
      setHighlightedEdges([0, 3, 6]);
    } else if (step === 3) {
      setGraph(prev => ({
        ...prev,
        edges: prev.edges.map(e => {
          if ((e.from === 0 && e.to === 1) || (e.from === 1 && e.to === 3) || (e.from === 3 && e.to === 5)) {
            return { ...e, flow: e.flow + 4 };
          }
          return e;
        })
      }));
      setMaxFlow(prev => prev + 4);
      setFlowPath([]);
      setCurrentPhase('Flow pushed: +4');
    } else if (step === 4) {
      setFlowPath([{ from: 0, to: 2 }, { from: 2, to: 4 }, { from: 4, to: 5 }]);
      setHighlightedEdges([1, 5, 8]);
      setCurrentPhase('Finding another path');
    } else if (step === 5) {
      setGraph(prev => ({
        ...prev,
        edges: prev.edges.map(e => {
          if ((e.from === 0 && e.to === 2) || (e.from === 2 && e.to === 4) || (e.from === 4 && e.to === 5)) {
            return { ...e, flow: e.flow + 9 };
          }
          return e;
        })
      }));
      setMaxFlow(prev => prev + 9);
      setFlowPath([]);
      setCurrentPhase('Flow pushed: +9');
    } else if (step === 6) {
      setFlowPath([{ from: 0, to: 1 }, { from: 1, to: 4 }, { from: 4, to: 3 }, { from: 3, to: 5 }]);
      setHighlightedEdges([0, 4, 7, 6]);
      setCurrentPhase('Complex path found');
    } else if (step === 7) {
      setGraph(prev => ({
        ...prev,
        edges: prev.edges.map(e => {
          if ((e.from === 0 && e.to === 1)) return { ...e, flow: e.flow + 6 };
          if ((e.from === 1 && e.to === 4)) return { ...e, flow: e.flow + 6 };
          if ((e.from === 4 && e.to === 3)) return { ...e, flow: e.flow + 6 };
          if ((e.from === 3 && e.to === 5)) return { ...e, flow: e.flow + 6 };
          return e;
        })
      }));
      setMaxFlow(prev => prev + 6);
      setFlowPath([]);
      setCurrentPhase('Flow pushed: +6');
    } else if (step === 8) {
      setCurrentPhase('Algorithm Complete!');
      setHighlightedEdges([]);
      setLevelGraph([]);
      setIsPlaying(false);
    }
    
    setStep(prev => prev + 1);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && step < 9) {
      timer = setTimeout(() => {
        simulateDinicStep();
      }, speed);
    } else if (step >= 9) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, speed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
            Dinic's Algorithm Visualizer
          </h1>
          <p className="text-slate-300 text-lg">Maximum Flow in O(V²E) time complexity</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-6 mb-6">
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={500}
            className="w-full rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 shadow-lg">
            <div className="text-emerald-100 text-sm font-semibold mb-2">MAXIMUM FLOW</div>
            <div className="text-4xl font-bold text-white">{maxFlow}</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg">
            <div className="text-blue-100 text-sm font-semibold mb-2">CURRENT PHASE</div>
            <div className="text-xl font-bold text-white truncate">{currentPhase}</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg">
            <div className="text-purple-100 text-sm font-semibold mb-2">STEP</div>
            <div className="text-4xl font-bold text-white">{step} / 9</div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={step >= 9}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center gap-2"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <button
                onClick={simulateDinicStep}
                disabled={step >= 9}
                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center gap-2"
              >
                <SkipForward size={20} />
                Step
              </button>
              
              <button
                onClick={resetGraph}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-yellow-400" />
              <label className="text-slate-300 font-semibold">Speed:</label>
              <input
                type="range"
                min="200"
                max="2000"
                step="200"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-32 accent-purple-500"
              />
              <span className="text-slate-300 font-mono">{(2200 - speed) / 200}x</span>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700 p-6">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded"></div>
            Algorithm Overview
          </h3>
          <div className="text-slate-300 space-y-2">
            <p><strong className="text-blue-400">Phase 1:</strong> Build level graph using BFS from source</p>
            <p><strong className="text-purple-400">Phase 2:</strong> Find blocking flow using DFS</p>
            <p><strong className="text-emerald-400">Phase 3:</strong> Repeat until no augmenting path exists</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DinicVisualizer;
