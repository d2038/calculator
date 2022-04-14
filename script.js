const display = {
  top: '',
  bottom: '0'
}

const state = {
  lastOperator: false,
  previousOperator: '',
  firstNumber: ''
}

const displayTop = document.querySelector('.display-top');
const displayBottom = document.querySelector('.display-bottom');

const keys = document.querySelectorAll('.key');
keys.forEach(key => key.addEventListener('click', setDisplay));

window.addEventListener('keydown', clickKey);

function setDisplay() {
  const input = this.textContent;

  switch (input) {
    case 'Clear':
      clear();
      break;

    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      if (display.bottom.length === 15 && !state.lastOperator) break;
      if (state.previousOperator === '=') clear();
      if (display.bottom === '0' || state.lastOperator) {
        display.bottom = input;
      } else {
        display.bottom += input;
      }
      state.lastOperator = false;
      break;

    case '+':
    case '-':
    case '*':
    case '/':
      if (state.lastOperator || state.firstNumber === '') {
        state.firstNumber = display.bottom;
      } else {
        if (!calculate()) {
          clear();
          break;
        }
      }
      display.top = `${state.firstNumber} ${input}`;
      state.lastOperator = true;
      state.previousOperator = input;
      break;

    case '=':
      if (state.lastOperator || state.firstNumber === '') {
        state.firstNumber = display.bottom;
        display.top = `${state.firstNumber} ${input}`;
      } else {
        display.top = `${display.top} ${display.bottom} ${input}`;
        if (!calculate()) {
          clear();
          break;
        }
      }
      state.lastOperator = true;
      state.previousOperator = input;
      break;

    case '.':
      if (display.bottom.length === 15 && !state.lastOperator) break;
      if (state.previousOperator === '=') clear();
      if (display.bottom === '' || state.lastOperator) {
        display.bottom = `0${input}`;
      } else if (!(display.bottom).includes('.')) {
        display.bottom += input;
      }
      state.lastOperator = false;
      break;
    case 'Del':
      if (!state.lastOperator) {
        display.bottom = (display.bottom).slice(0, -1);
      }
      break;
  }

  displayTop.textContent = display.top;
  displayBottom.textContent = display.bottom;
}

function add(num1, num2) {
  return num1 + num2;
}

function substract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function operate(operator, num1, num2) {
  switch (operator) {
    case '+':
      return add(num1, num2);
    case '-':
      return substract(num1, num2);
    case '*':
      return multiply(num1, num2);
    case '/':
      return divide(num1, num2);
  }
}

function clear() {
  display.top = '';
  display.bottom = '0';
  state.lastOperator = false;
  state.previousOperator = '';
  state.firstNumber = '';
}

function calculate() {
  const num1 = +state.firstNumber;
  const num2 = +display.bottom;
  const operator = state.previousOperator;
  if (num2 === 0 && operator === '/') {
    alert("You can't divide by 0!");
    return false;
  }
  let result = operate(operator, num1, num2);
  result = roundNumber('round', result, -3);

  display.bottom = result.toString();
  state.firstNumber = result.toString();
  return true;
}

function roundNumber(type, value, exp) {
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

function clickKey(e) {
  const key = document.querySelector(`[data-key='${e.keyCode}']`);
  if (!key) return;
  key.click();
}