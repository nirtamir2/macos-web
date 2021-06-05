import { CalculatorKeyT, calculatorReducer, initialState, IState } from './calculatorReducer';

let state: IState = initialState;
describe('calculatorReducer', () => {
  beforeEach(() => {
    state = initialState;
  });

  function updateStateAfterPress(key: CalculatorKeyT) {
    switch (key) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9: {
        state = calculatorReducer(state, { type: 'PressNumber', payload: { number: key } });
        break;
      }
      case '.': {
        state = calculatorReducer(state, { type: 'PressDot' });
        break;
      }
      case '+':
      case '-':
      case '*':
      case '/': {
        state = calculatorReducer(state, {
          type: 'ChangeOperator',
          payload: { operatorValue: key },
        });
        break;
      }
      case '%': {
        state = calculatorReducer(state, { type: 'PercentOperator' });
        break;
      }
      case 'AC': {
        state = calculatorReducer(state, { type: 'Reset' });
        break;
      }
      case '=': {
        state = calculatorReducer(state, { type: 'ShowResult' });
        break;
      }
    }
  }

  function testEquation(keys: CalculatorKeyT[], results: string[]) {
    expect(keys).toHaveLength(results.length);

    for (let i = 0; i < results.length; i++) {
      const key = keys[i];
      const result = results[i];
      updateStateAfterPress(key);
      expect(state.result).toBe(result);
    }

    // Reset state
    state = initialState;
  }

  test('Show number', () => {
    testEquation([1, 2, 3], ['1', '12', '123']);
  });

  test('Reset number', () => {
    testEquation([1, 'AC', 3, 4], ['1', '0', '3', '34']);
  });

  test('Decimal number', () => {
    testEquation([1, '.', '.', 3, '.'], ['1', '1.', '1.', '1.3', '1.3']);
  });

  test('Simple Math', () => {
    testEquation([6, '+', 7, '='], ['6', '6', '7', '13']);
    testEquation([1, '+', 3, '='], ['1', '1', '3', '4']);
    testEquation([5, 5, '+', 2, 3, '='], ['5', '55', '55', '2', '23', '78']);
  });

  test('Equations with more than one operator', () => {
    testEquation([1, 0, '+', 2, 4, '+', 5, '='], ['1', '10', '10', '2', '24', '34', '5', '39']);
    testEquation(
      [1, 0, '+', 2, 4, '+', 5, '+', 1, 0, '='],
      ['1', '10', '10', '2', '24', '34', '5', '39', '1', '10', '49'],
    );
  });

  test('Double equal should calculate same operator', () => {
    testEquation([1, 0, '+', 2, 4, '=', '='], ['1', '10', '10', '2', '24', '34', '58']);
  });

  test('More than two equal at row', () => {
    testEquation([2, 4, '+', 1, 0, '=', '=', '='], ['2', '24', '24', '1', '10', '34', '44', '54']);
  });

  test('Operator after equal', () => {
    testEquation([8, '*', 9, '=', '+', 5, '='], ['8', '8', '9', '72', '72', '5', '77']);
  });
});

export {};
