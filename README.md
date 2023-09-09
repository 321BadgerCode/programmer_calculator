# Programmer Calculator

The Programmer Calculator is a simple web-based calculator that allows you to perform arithmetic operations, bitwise operations, and base conversions for numbers in different bases (binary, octal, decimal, and hexadecimal).

<p align="center">
	<img alt="Icon" src="./icon.ico"/>
</p>

## Features

- **Arithmetic Operations:** You can perform basic arithmetic operations like addition, subtraction, multiplication, and division on decimal numbers.

- **Bitwise Operations:** The calculator supports bitwise AND, OR, and XOR operations on binary numbers.

- **Base Conversions:** You can switch between different bases (binary, octal, decimal, and hexadecimal) and perform calculations in the selected base.

- **Parentheses:** The calculator correctly handles parentheses to evaluate expressions following the order of operations (PEMDAS).

- **Hexadecimal Alphabet:** In hexadecimal mode, you can use the dropdown to select hexadecimal alphabet characters (A-F) for input.

## How to Use

1. **Select Base:** Use the "BIN," "OCT," "DEC," and "HEX" buttons to switch between different bases.

2. **Input Numbers and Operators:** Click on the buttons to input numbers (0-9), operators (+, -, *, /, %, &, |, ^, <<, >>), and parentheses.

3. **Evaluate Expression:** Click the "=" button to evaluate the expression. The result will be displayed in the input box.

4. **Clear Display:** Click the "C" button to clear the display.

## Examples

- Decimal Calculation: `2 + 3 * 4` will display `14` as the result.

- Binary Calculation: In binary mode, `1101 + 1010` will display `10111` as the result.

- Hexadecimal Calculation: In hexadecimal mode, `A + B` will display `21` as the result.

## Customization

The calculator uses a custom parser and evaluator with an Abstract Syntax Tree (AST) to handle different bases and operator precedence. You can further extend the functionality or customize the calculator to meet your specific requirements.

## Credits

This calculator was created by [Badger Code].

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.