import React, { useReducer } from "react";
import "./styles.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DEGIT: "delete-digit",
  EVALUATE: "evaluate",
};
const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currOp: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currOp === "0") {
        return state;
      }
      if (payload.digit === "." && state.currOp.includes(".")) {
        return state;
      }
      return {
        ...state,
        currOp: `${state.currOp || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currOp == null && state.prevOp == null) {
        return state;
      }
      if(state.currOp == null){
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.prevOp == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOp: state.currOp,
          currOp: null,
        };
      }
      return {
        ...state,
        prevOp: evaluate(state),
        operation: payload.operation,
        currOp: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DEGIT:
      if(state.overwrite){
        return{
          ...state,
          overwrite: false,
          currOp: null,
        }
      }
      if(state.currOp == null) return state
      if(state.currOp.length === 1) return{
        ...state,
        currOp: null,
      }
    return{
      ...state,
      currOp: state.currOp.slice(0, -1),
    };
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currOp == null || state.prevOp == null) {
        return state;
      }
      return{
        ...state,
        overwrite: true,
        currOp: evaluate(state),
        prevOp: null,
        operation: null,
      }
  }
};

function evaluate({ currOp, prevOp, operation }) {
  const prev = parseFloat(prevOp);
  const curr = parseFloat(currOp);
  if (isNaN(prev) || isNaN(curr)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "÷":
      computation = prev / curr;
      break;
  }
  return computation.toString();
}

const INTERGER_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return "";
  const [int, dec] = operand.split(".");
  if (dec == null) return INTERGER_FORMATTER.format(int);
  return `${INTERGER_FORMATTER.format(int)}.${dec}`;
}

function App() {
  const [{ currOp, prevOp, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="cal-grid">
      <div className="output">
        <div className="prev-op">
          {formatOperand(prevOp)}
          { operation }
        </div>
        <div className="curr-op">{formatOperand(currOp)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button
            onClick={() => dispatch({ type: ACTIONS.DELETE_DEGIT })}

      >DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two"
      onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >=</button>
    </div>
  );
}

export default App;
