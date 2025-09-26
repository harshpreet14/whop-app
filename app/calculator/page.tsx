
'use client';
import { useState, useEffect } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<null | number>(null);
  const [operator, setOperator] = useState<null | string>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState(0);
  const [previousDisplay, setPreviousDisplay] = useState('0');

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      
      if (key >= '0' && key <= '9') {
        handleDigitClick(key);
      } else if (key === '.') {
        handleDecimalClick();
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperatorClick(key);
      } else if (key === 'Enter' || key === '=') {
        handleEqualClick();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClearClick();
      } else if (key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, waitingForSecondOperand, operator, firstOperand]);

  const handleDigitClick = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimalClick = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleOperatorClick = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (operator && !waitingForSecondOperand) {
      const result = calculate();
      setDisplay(String(result));
      setFirstOperand(result);
    } else {
      setFirstOperand(inputValue);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = () => {
    const inputValue = parseFloat(display);
    if (firstOperand === null || operator === null) {
      return inputValue;
    }

    let result: number;
    switch (operator) {
      case '+':
        result = firstOperand + inputValue;
        break;
      case '-':
        result = firstOperand - inputValue;
        break;
      case '*':
        result = firstOperand * inputValue;
        break;
      case '/':
        result = inputValue !== 0 ? firstOperand / inputValue : 0;
        break;
      case '^':
        result = Math.pow(firstOperand, inputValue);
        break;
      case '%':
        result = (firstOperand * inputValue) / 100;
        break;
      default:
        result = inputValue;
    }

    // Add to history
    const historyEntry = `${firstOperand} ${operator} ${inputValue} = ${result}`;
    setHistory(prev => [...prev.slice(-9), historyEntry]); // Keep last 10 entries

    return result;
  };

  const handleAdvancedOperation = (operation: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (operation) {
      case 'sqrt':
        result = Math.sqrt(inputValue);
        break;
      case 'square':
        result = inputValue * inputValue;
        break;
      case 'inverse':
        result = inputValue !== 0 ? 1 / inputValue : 0;
        break;
      case 'negate':
        result = -inputValue;
        break;
      case 'percent':
        result = inputValue / 100;
        break;
      default:
        result = inputValue;
    }

    const historyEntry = `${operation}(${inputValue}) = ${result}`;
    setHistory(prev => [...prev.slice(-9), historyEntry]);
    setDisplay(String(result));
  };

  const handleMemoryOperation = (operation: string) => {
    const inputValue = parseFloat(display);
    
    switch (operation) {
      case 'M+':
        setMemory(prev => prev + inputValue);
        break;
      case 'M-':
        setMemory(prev => prev - inputValue);
        break;
      case 'MR':
        setDisplay(String(memory));
        break;
      case 'MC':
        setMemory(0);
        break;
    }
  };

  const handleEqualClick = () => {
    const result = calculate();
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleClearClick = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Advanced Calculator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator */}
          <div className="lg:col-span-2">
            <div className="bg-black border-2 border-gray-800 rounded-2xl shadow-2xl p-6">
              {/* Display */}
              <div className="bg-gray-900 rounded-xl p-6 mb-6">
                <div className="text-right text-5xl font-mono font-bold text-white mb-2 min-h-[3rem] flex items-center justify-end">
                  {display}
                </div>
                <div className="text-right text-sm text-gray-300">
                  {operator && firstOperand !== null && `${firstOperand} ${operator}`}
                </div>
              </div>

              {/* Memory and Advanced Functions */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                <button onClick={() => handleMemoryOperation('MC')} className="p-3 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">MC</button>
                <button onClick={() => handleMemoryOperation('MR')} className="p-3 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">MR</button>
                <button onClick={() => handleMemoryOperation('M+')} className="p-3 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">M+</button>
                <button onClick={() => handleMemoryOperation('M-')} className="p-3 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">M-</button>
                <button onClick={handleClearHistory} className="p-3 text-sm font-bold text-white bg-red-800 rounded-lg hover:bg-red-700 transition-colors">Clear H</button>
              </div>

              {/* Advanced Operations */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                <button onClick={() => handleAdvancedOperation('sqrt')} className="p-3 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">√</button>
                <button onClick={() => handleAdvancedOperation('square')} className="p-3 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">x²</button>
                <button onClick={() => handleAdvancedOperation('inverse')} className="p-3 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">1/x</button>
                <button onClick={() => handleAdvancedOperation('negate')} className="p-3 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">±</button>
                <button onClick={() => handleAdvancedOperation('percent')} className="p-3 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">%</button>
              </div>

              {/* Main Calculator Grid */}
              <div className="grid grid-cols-4 gap-3">
                {/* Row 1 */}
                <button onClick={() => handleClearClick()} className="col-span-2 p-4 text-xl font-bold text-white bg-red-800 rounded-xl hover:bg-red-700 transition-colors">Clear</button>
                <button onClick={() => handleBackspace()} className="p-4 text-xl font-bold text-white bg-orange-800 rounded-xl hover:bg-orange-700 transition-colors">⌫</button>
                <button onClick={() => handleOperatorClick('/')} className="p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">÷</button>
                
                {/* Row 2 */}
                <button onClick={() => handleDigitClick('7')} className="p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">7</button>
                <button onClick={() => handleDigitClick('8')} className="p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">8</button>
                <button onClick={() => handleDigitClick('9')} className="p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">9</button>
                <button onClick={() => handleOperatorClick('*')} className="p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">×</button>
                
                {/* Row 3 */}
                <button onClick={() => handleDigitClick('4')} className="p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">4</button>
                <button onClick={() => handleDigitClick('5')} className="p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">5</button>
                <button onClick={() => handleDigitClick('6')} className="p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">6</button>
                <button onClick={() => handleOperatorClick('-')} className="p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">−</button>
                
                {/* Row 4 */}
                <button onClick={() => handleDigitClick('1')} className="p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">1</button>
                <button onClick={() => handleDigitClick('2')} className="p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">2</button>
                <button onClick={() => handleDigitClick('3')} className="p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">3</button>
                <button onClick={() => handleOperatorClick('+')} className="p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">+</button>
                
                {/* Row 5 */}
                <button onClick={() => handleDigitClick('0')} className="col-span-2 p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">0</button>
                <button onClick={handleDecimalClick} className="p-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">.</button>
                <button onClick={() => handleEqualClick()} className="p-4 text-xl font-bold text-white bg-green-800 rounded-xl hover:bg-green-700 transition-colors">=</button>
              </div>

              {/* Additional Operations Row */}
              <div className="grid grid-cols-4 gap-3 mt-3">
                <button onClick={() => handleOperatorClick('^')} className="p-3 text-lg font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">x^y</button>
                <button onClick={() => handleOperatorClick('%')} className="p-3 text-lg font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">%</button>
                <button onClick={() => handleAdvancedOperation('sqrt')} className="p-3 text-lg font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">√x</button>
                <button onClick={() => handleAdvancedOperation('square')} className="p-3 text-lg font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">x²</button>
              </div>
            </div>
          </div>

          {/* History Panel */}
          <div className="lg:col-span-1">
            <div className="bg-black border-2 border-gray-800 rounded-2xl shadow-2xl p-6 h-full">
              <h2 className="text-2xl font-bold text-white mb-4">History</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No calculations yet</p>
                ) : (
                  history.map((entry, index) => (
                    <div key={index} className="p-3 bg-gray-900 rounded-lg text-sm font-mono text-white">
                      {entry}
                    </div>
                  ))
                )}
              </div>
              {memory !== 0 && (
                <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                  <p className="text-sm text-white font-bold">Memory: {memory}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="mt-8 bg-black border-2 border-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
            <div><kbd className="bg-gray-800 text-white px-2 py-1 rounded">0-9</kbd> Numbers</div>
            <div><kbd className="bg-gray-800 text-white px-2 py-1 rounded">+ - * /</kbd> Operations</div>
            <div><kbd className="bg-gray-800 text-white px-2 py-1 rounded">Enter</kbd> Equals</div>
            <div><kbd className="bg-gray-800 text-white px-2 py-1 rounded">Escape</kbd> Clear</div>
            <div><kbd className="bg-gray-800 text-white px-2 py-1 rounded">.</kbd> Decimal</div>
            <div><kbd className="bg-gray-800 text-white px-2 py-1 rounded">Backspace</kbd> Delete</div>
          </div>
        </div>
      </div>
    </div>
  );
}
