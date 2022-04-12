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
        calculate();
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
        calculate();
      }
      state.lastOperator = true;
      state.previousOperator = input;
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
  let result = operate(operator, num1, num2);
  result = roundNumber(result, 3);

  display.bottom = result.toString();
  state.firstNumber = result.toString();
}

function roundNumber(num, scale) {
  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}