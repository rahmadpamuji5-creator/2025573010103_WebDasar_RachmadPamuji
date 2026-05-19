const display = document.getElementById("display");
const buttons = document.getElementById("buttons");

let firstNumber = "";
let secondNumber = "";
let operator = "";
let isSecondNumber = false;

buttons.addEventListener("click", function (e) {
    const value = e.target.dataset.value;

    if (!value) return;

    handleInput(value);
});

// HANDLE INPUT
function handleInput(value) {

    // CLEAR
    if (value === "C") {
        clearCalculator();
        return;
    }

    // EQUAL
    if (value === "=") {
        calculate();
        return;
    }

    // OPERATOR
    if (["+", "-", "*", "/"].includes(value)) {

        if (firstNumber !== "") {
            operator = value;
            isSecondNumber = true;
            display.value = `${firstNumber} ${operator}`;
        }

        return;
    }

    // ANGKA / DESIMAL
    if (!isSecondNumber) {
        firstNumber += value;
        display.value = firstNumber;
    } else {
        secondNumber += value;
        display.value = `${firstNumber} ${operator} ${secondNumber}`;
    }
}
function calculate() {

    if (firstNumber === "" || secondNumber === "") return;

    let result;

    const num1 = parseFloat(firstNumber);
    const num2 = parseFloat(secondNumber);

    switch (operator) {
        case "+":
            result = num1 + num2;
            break;

        case "-":
            result = num1 - num2;
            break;

        case "*":
            result = num1 * num2;
            break;

        case "/":
            result = num1 / num2;
            break;

        default:
            return;
    }

    display.value = result;

    // reset untuk perhitungan berikutnya
    firstNumber = result.toString();
    secondNumber = "";
    operator = "";
    isSecondNumber = false;
}

// CLEAR
function clearCalculator() {
    display.value = "";
    firstNumber = "";
    secondNumber = "";
    operator = "";
    isSecondNumber = false;
}

// KEYBOARD SUPPORT
document.addEventListener("keydown", function (e) {

    const key = e.key;

    // angka dan operator
    if (
        /[0-9]/.test(key) ||
        ["+", "-", "*", "/", "."].includes(key)
    ) {
        handleInput(key);
    }

    // enter = hasil
    else if (key === "Enter") {
        calculate();
    }

    // escape = clear
    else if (key === "Escape") {
        clearCalculator();
    }
});