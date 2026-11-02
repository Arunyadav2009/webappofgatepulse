import React, { useState } from 'react';
import { X, Copy, Check, RotateCcw } from 'lucide-react';

interface VirtualGateCalculatorProps {
  onClose: () => void;
}

export const VirtualGateCalculator: React.FC<VirtualGateCalculatorProps> = ({ onClose }) => {
  const [display, setDisplay] = useState<string>('0');
  const [memory, setMemory] = useState<number>(0);
  const [isRad, setIsRad] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<string>('');

  const handleNumber = (n: string) => {
    setDisplay(prev => {
      if (prev === '0' || prev === 'Error') return n;
      return prev + n;
    });
  };

  const handleDecimal = () => {
    setDisplay(prev => {
      if (prev.includes('.')) return prev;
      return prev + '.';
    });
  };

  const handleClear = () => {
    setDisplay('0');
    setHistory('');
  };

  const handleBackspace = () => {
    setDisplay(prev => {
      if (prev.length <= 1 || prev === 'Error') return '0';
      return prev.slice(0, -1);
    });
  };

  const handleToggleSign = () => {
    setDisplay(prev => {
      if (prev === '0' || prev === 'Error') return prev;
      if (prev.startsWith('-')) return prev.slice(1);
      return '-' + prev;
    });
  };

  const handleOperator = (op: string) => {
    setHistory(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculateResult = () => {
    try {
      if (!history) return;
      const fullExpr = (history + display)
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');

      // Safe calculation using standard math parser
      // eslint-disable-next-line no-eval
      const result = Function('"use strict";return (' + fullExpr + ')')();
      if (!isFinite(result) || isNaN(result)) {
        setDisplay('Error');
      } else {
        setDisplay(String(Number(result.toFixed(8))));
      }
      setHistory('');
    } catch {
      setDisplay('Error');
    }
  };

  // Scientific functions
  const handleScientific = (fn: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    try {
      switch (fn) {
        case 'sin':
          res = Math.sin(isRad ? val : toRad(val));
          break;
        case 'cos':
          res = Math.cos(isRad ? val : toRad(val));
          break;
        case 'tan':
          res = Math.tan(isRad ? val : toRad(val));
          break;
        case 'asin':
          res = Math.asin(val);
          if (!isRad) res = toDeg(res);
          break;
        case 'acos':
          res = Math.acos(val);
          if (!isRad) res = toDeg(res);
          break;
        case 'atan':
          res = Math.atan(val);
          if (!isRad) res = toDeg(res);
          break;
        case 'sinh':
          res = Math.sinh(val);
          break;
        case 'cosh':
          res = Math.cosh(val);
          break;
        case 'tanh':
          res = Math.tanh(val);
          break;
        case 'ln':
          if (val <= 0) throw new Error();
          res = Math.log(val);
          break;
        case 'log10':
          if (val <= 0) throw new Error();
          res = Math.log10(val);
          break;
        case 'log2':
          if (val <= 0) throw new Error();
          res = Math.log2(val);
          break;
        case 'sqrt':
          if (val < 0) throw new Error();
          res = Math.sqrt(val);
          break;
        case 'cbrt':
          res = Math.cbrt(val);
          break;
        case 'sqr':
          res = Math.pow(val, 2);
          break;
        case 'cube':
          res = Math.pow(val, 3);
          break;
        case 'inv':
          if (val === 0) throw new Error();
          res = 1 / val;
          break;
        case 'exp':
          res = Math.exp(val);
          break;
        case '10x':
          res = Math.pow(10, val);
          break;
        case '2x':
          res = Math.pow(2, val);
          break;
        case 'fact': {
          if (val < 0 || !Number.isInteger(val)) throw new Error();
          let f = 1;
          for (let i = 2; i <= Math.min(val, 170); i++) f *= i;
          res = f;
          break;
        }
        case 'abs':
          res = Math.abs(val);
          break;
        default:
          return;
      }
      setDisplay(String(Number(res.toFixed(8))));
    } catch {
      setDisplay('Error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  // Memory keys
  const handleMemory = (action: 'MC' | 'MR' | 'MS' | 'M+' | 'M-') => {
    const val = parseFloat(display) || 0;
    switch (action) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(String(memory));
        break;
      case 'MS':
        setMemory(val);
        break;
      case 'M+':
        setMemory(prev => prev + val);
        break;
      case 'M-':
        setMemory(prev => prev - val);
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header matching official TCS iON style */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 border-b border-slate-700 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">GATE Virtual Scientific Calculator</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-400">TCS iON Reference Model</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 rounded transition-colors text-xs"
              title="Copy current display value"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/80 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Display screen */}
        <div className="p-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono h-4 px-1">
            <span>{history}</span>
            <span className="text-indigo-400 font-semibold">{memory !== 0 ? `M = ${memory}` : ''}</span>
          </div>
          <div className="text-right text-2xl font-mono font-bold tracking-tight text-white py-1 px-2 select-all overflow-x-auto whitespace-nowrap">
            {display}
          </div>
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsRad(true)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  isRad ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                RAD
              </button>
              <button
                onClick={() => setIsRad(false)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  !isRad ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                DEG
              </button>
            </div>
            <span className="text-slate-500 font-mono text-[10px]">Tabular IEEE 754 precision</span>
          </div>
        </div>

        {/* Keys grid */}
        <div className="p-3 grid grid-cols-6 gap-1.5 text-xs font-mono select-none bg-slate-900/90">
          {/* Row 1: Memory & Clear */}
          <button onClick={() => handleMemory('MC')} className="calc-btn-meta">MC</button>
          <button onClick={() => handleMemory('MR')} className="calc-btn-meta">MR</button>
          <button onClick={() => handleMemory('MS')} className="calc-btn-meta">MS</button>
          <button onClick={() => handleMemory('M+')} className="calc-btn-meta">M+</button>
          <button onClick={() => handleMemory('M-')} className="calc-btn-meta">M-</button>
          <button onClick={handleBackspace} className="calc-btn-danger">⌫ Del</button>

          {/* Row 2: Trig & Clear */}
          <button onClick={() => handleScientific('sin')} className="calc-btn-fn">sin</button>
          <button onClick={() => handleScientific('cos')} className="calc-btn-fn">cos</button>
          <button onClick={() => handleScientific('tan')} className="calc-btn-fn">tan</button>
          <button onClick={() => handleScientific('ln')} className="calc-btn-fn">ln</button>
          <button onClick={() => handleScientific('log10')} className="calc-btn-fn">log₁₀</button>
          <button onClick={handleClear} className="calc-btn-danger font-semibold">C</button>

          {/* Row 3: Inverse Trig & Logs */}
          <button onClick={() => handleScientific('asin')} className="calc-btn-fn">sin⁻¹</button>
          <button onClick={() => handleScientific('acos')} className="calc-btn-fn">cos⁻¹</button>
          <button onClick={() => handleScientific('atan')} className="calc-btn-fn">tan⁻¹</button>
          <button onClick={() => handleScientific('exp')} className="calc-btn-fn">eˣ</button>
          <button onClick={() => handleScientific('10x')} className="calc-btn-fn">10ˣ</button>
          <button onClick={() => handleOperator('÷')} className="calc-btn-op font-bold">÷</button>

          {/* Row 4: Hyperbolic & Powers */}
          <button onClick={() => handleScientific('sinh')} className="calc-btn-fn">sinh</button>
          <button onClick={() => handleScientific('cosh')} className="calc-btn-fn">cosh</button>
          <button onClick={() => handleScientific('tanh')} className="calc-btn-fn">tanh</button>
          <button onClick={() => handleNumber('7')} className="calc-btn-num font-semibold">7</button>
          <button onClick={() => handleNumber('8')} className="calc-btn-num font-semibold">8</button>
          <button onClick={() => handleNumber('9')} className="calc-btn-num font-semibold">9</button>

          {/* Row 5: Powers & Operators */}
          <button onClick={() => handleScientific('sqr')} className="calc-btn-fn">x²</button>
          <button onClick={() => handleScientific('cube')} className="calc-btn-fn">x³</button>
          <button onClick={() => handleOperator('^')} className="calc-btn-fn">xʸ</button>
          <button onClick={() => handleNumber('4')} className="calc-btn-num font-semibold">4</button>
          <button onClick={() => handleNumber('5')} className="calc-btn-num font-semibold">5</button>
          <button onClick={() => handleNumber('6')} className="calc-btn-num font-semibold">6</button>

          {/* Row 6: Roots & Multiply */}
          <button onClick={() => handleScientific('sqrt')} className="calc-btn-fn">√x</button>
          <button onClick={() => handleScientific('cbrt')} className="calc-btn-fn">³√x</button>
          <button onClick={() => handleScientific('inv')} className="calc-btn-fn">1/x</button>
          <button onClick={() => handleNumber('1')} className="calc-btn-num font-semibold">1</button>
          <button onClick={() => handleNumber('2')} className="calc-btn-num font-semibold">2</button>
          <button onClick={() => handleNumber('3')} className="calc-btn-num font-semibold">3</button>

          {/* Row 7: Constants & Equal */}
          <button onClick={() => setDisplay(String(Math.PI))} className="calc-btn-fn">π</button>
          <button onClick={() => setDisplay(String(Math.E))} className="calc-btn-fn">e</button>
          <button onClick={() => handleScientific('fact')} className="calc-btn-fn">n!</button>
          <button onClick={() => handleScientific('log2')} className="calc-btn-fn">log₂</button>
          <button onClick={() => handleOperator('×')} className="calc-btn-op font-bold">×</button>
          <button onClick={() => handleOperator('-')} className="calc-btn-op font-bold">−</button>

          {/* Row 8: 0, decimal, sign, + and = */}
          <button onClick={handleToggleSign} className="calc-btn-fn">±</button>
          <button onClick={() => handleNumber('0')} className="calc-btn-num font-semibold">0</button>
          <button onClick={handleDecimal} className="calc-btn-num font-semibold">.</button>
          <button onClick={() => handleOperator('%')} className="calc-btn-fn">mod</button>
          <button onClick={() => handleOperator('+')} className="calc-btn-op font-bold">+</button>
          <button onClick={calculateResult} className="calc-btn-eval font-bold text-white bg-indigo-600 hover:bg-indigo-500">=</button>
        </div>

        {/* Footer tip for GATE examinees */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Tip: In GATE exam, modulo (%) and log₂ functions save critical minutes.</span>
          <button
            onClick={() => {
              handleClear();
              setMemory(0);
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
