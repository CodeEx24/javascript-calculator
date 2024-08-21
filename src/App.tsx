import { useState, useEffect } from 'react';
import SocialLinks from './components/SocialLinks';
import { socialLinks } from './const/socialLinks';

function App() {
  const [currInput, setCurrInput] = useState('0');
  const [history, setHistory] = useState('');
  const [prevValue, setPrevValue] = useState('');
  const [isEvaluated, setIsEvaluated] = useState(false);

  const [buttonClick, setButtonClick] = useState('');

  const handleNumber = (value: string) => {
    setButtonClick(value);
    if (currInput === 'Limit') return;
    if (isEvaluated) {
      setCurrInput(value);
      setHistory(value);
      setIsEvaluated(false);
    } else {
      setCurrInput(currInput === '0' ? value : currInput + value);
      setHistory(history + value);
    }
  };

  const handleOperator = (value: string) => {
    setButtonClick(value);
    if (currInput === 'Limit') return;

    // Check if history has two consecutive operands in last two index
    if (isEvaluated) {
      setHistory(prevValue + value);
      setCurrInput(value);
      setIsEvaluated(false);
    } else {
      setHistory(history + value);
      setPrevValue(currInput);
      setCurrInput('');
    }
  };

  const handleDot = () => {
    setButtonClick('.');
    if (currInput.includes('.') || currInput === 'Limit') return;

    if (isEvaluated) {
      setCurrInput('0.');
      setHistory('0.');
      setIsEvaluated(false);
    } else {
      setCurrInput(currInput === '' ? '0.' : currInput + '.');
      setHistory(history + '.');
    }
  };

  const clear = () => {
    setButtonClick('clear');
    setCurrInput('0');
    setHistory('');
    setPrevValue('');
    setIsEvaluated(false);
  };

  const calculate = () => {
    setButtonClick('=');
    if (currInput === 'Limit') return;

    let expression = history;

    // Remove trailing operators
    while (/[x+/-]$/.test(expression)) {
      expression = expression.slice(0, -1);
    }

    // Replace 'x' with '*' and '‑' with '-'
    expression = expression.replace(/x/g, '*').replace(/‑/g, '-');

    // Remove first two of three consecutive operators
    expression = expression.replace(/([+\-*/]){3}/g, (match) => match[2]);

    // Normalize consecutive identical operators
    expression = expression.replace(/([+\-*/])\1+/g, '$1');

    try {
      const result = eval(expression);
      setCurrInput(result.toString());
      setHistory(
        `${expression.replace(/\*/g, '⋅').replace(/-/g, '‑')}=${result}`
      );
      setPrevValue(result);
      setIsEvaluated(true);
    } catch {
      setCurrInput('Error');
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (/^[0-9]$/.test(key)) {
        handleNumber(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key);
      } else if (key === '.') {
        handleDot();
      } else if (key === 'Enter' || key === '=') {
        calculate();
      } else if (key === 'Escape' || key === 'Backspace') {
        clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currInput, history, prevValue, isEvaluated]);

  useEffect(() => {
    if (!buttonClick) return; // Skip if buttonClick is empty

    const timeoutId = setTimeout(() => {
      setButtonClick('');
    }, 80);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [buttonClick]);

  useEffect(() => {
    const container = document.getElementById('scroll-container');
    if (container) {
      container.scrollLeft = container.scrollWidth;
    }
  }, [currInput, history]);

  return (
    <div
      id="container"
      className="flex flex-col justify-center items-center w-screen h-screen bg-violet-600"
    >
      <div className="grid grid-cols-4 gap-2 bg-gray-900 p-2 text-white rounded-md w-auto max-w-[300px]">
        <div
          className="col-span-4 h-16 overflow-x-scroll overflow-y-hidden"
          id="scroll-container"
        >
          <div className="h-full flex flex-col justify-end items-end w-full">
            <p id="history" className="text-end w-full">
              {history}
            </p>
            <p id="display" className="text-2xl text-end w-full">
              {currInput}
            </p>
          </div>
        </div>
        <button
          id="clear"
          onClick={clear}
          className={`col-span-2 bg-red-600 ${
            buttonClick == 'clear' && 'scale-95'
          }`}
        >
          AC
        </button>
        <button
          id="divide"
          value="/"
          onClick={() => handleOperator('/')}
          className={`h-12 w-16 ${buttonClick == '/' && 'scale-95'}`}
        >
          /
        </button>
        <button
          id="multiply"
          value="x"
          onClick={() => handleOperator('*')}
          className={`h-12 w-16 ${buttonClick == '*' && 'scale-95'}`}
        >
          x
        </button>
        <button
          id="seven"
          value="7"
          onClick={() => handleNumber('7')}
          className={`h-12 w-16 ${buttonClick == '7' && 'scale-95'}`}
        >
          7
        </button>
        <button
          id="eight"
          value="8"
          onClick={() => handleNumber('8')}
          className={`h-12 w-16 ${buttonClick == '8' && 'scale-95'}`}
        >
          8
        </button>
        <button
          id="nine"
          value="9"
          onClick={() => handleNumber('9')}
          className={`h-12 w-16 ${buttonClick == '9' && 'scale-95'}`}
        >
          9
        </button>
        <button
          id="subtract"
          value="-"
          onClick={() => handleOperator('-')}
          className={`h-12 w-16 ${buttonClick == '-' && 'scale-95'}`}
        >
          -
        </button>
        <button
          id="four"
          value="4"
          onClick={() => handleNumber('4')}
          className={`h-12 w-16 ${buttonClick == '4' && 'scale-95'}`}
        >
          4
        </button>
        <button
          id="five"
          value="5"
          onClick={() => handleNumber('5')}
          className={`h-12 w-16 ${buttonClick == '5' && 'scale-95'}`}
        >
          5
        </button>
        <button
          id="six"
          value="6"
          onClick={() => handleNumber('6')}
          className={`h-12 w-16 ${buttonClick == '6' && 'scale-95'}`}
        >
          6
        </button>
        <button
          id="add"
          value="+"
          onClick={() => handleOperator('+')}
          className={`h-12 w-16 ${buttonClick == '+' && 'scale-95'}`}
        >
          +
        </button>
        <button
          id="one"
          value="1"
          onClick={() => handleNumber('1')}
          className={`h-12 w-16 ${buttonClick == '1' && 'scale-95'}`}
        >
          1
        </button>
        <button
          id="two"
          value="2"
          onClick={() => handleNumber('2')}
          className={`h-12 w-16 ${buttonClick == '2' && 'scale-95'}`}
        >
          2
        </button>
        <button
          id="three"
          value="3"
          onClick={() => handleNumber('3')}
          className={`h-12 w-16 ${buttonClick == '3' && 'scale-95'}`}
        >
          3
        </button>
        <button id="equals" onClick={calculate} className="row-span-2">
          =
        </button>
        <button
          id="zero"
          value="0"
          onClick={() => handleNumber('0')}
          className={`col-span-2 h-12 ${buttonClick == '0' && 'scale-95'}`}
        >
          0
        </button>
        <button id="decimal" onClick={handleDot}>
          .
        </button>
      </div>
      <SocialLinks links={socialLinks} />
    </div>
  );
}

export default App;
