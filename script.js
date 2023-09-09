// Badger
let currentValue = '';
let currentBase = 10; // Default base is decimal (DEC)
let previousAns = 0;

document.getElementById('display').addEventListener('keyup', function(event) {
	if (event.key === 'Enter') {
		calculateResult();
	}
});

/**
 * Convert a number from one base to another.
 * @param {string} number - The number to convert as a string.
 * @param {number} fromBase - The source base of the number (e.g., 2, 8, 10, or 16).
 * @param {number} toBase - The target base to convert to (e.g., 2, 8, 10, or 16).
 * @returns {string} - The converted number as a string.
 */
function convertBase(number, fromBase, toBase) {
	// Define characters for bases greater than 10 (hexadecimal)
	const characters = "0123456789ABCDEF";

	// Function to convert a number from any base to base 10
	function toBase10(number, base) {
		let result = 0;
		let power = 0;
		while (number > 0) {
			const digit = number % 10;
			result += digit * Math.pow(base, power);
			number = Math.floor(number / 10);
			power++;
		}
		return result;
	}

	// Function to convert a number from base 10 to any other base
	function fromBase10(number, base) {
		let result = '';
		while (number > 0) {
			const remainder = number % base;
			result = characters[remainder] + result;
			number = Math.floor(number / base);
		}
		return result;
	}

	// Convert the number to base 10 and then to the target base
	const base10Number = toBase10(number, fromBase);
	const result = fromBase10(base10Number, toBase);

	return result;
}

function getCurrentVal() {
	return document.getElementById('display').value.toUpperCase();
}

function switchBase(base) {
	changeValue(currentBase, base);
	currentBase = base;
	updateButtons();
}

function getBasePrefix(base) {
	var ans = '';
	switch(base){
		case 2:ans = '0b';break;
		case 8:ans = '0';break;
		case 10:ans = '';break;
		case 16:ans = '0x';break;
		default:ans = '';break;
	}
	return ans;
}

function changeValue(previousBase, newBase) {
	currentValue = getBasePrefix(newBase);
	currentValue += convertBase(getCurrentVal(),previousBase,newBase);
	updateDisplay();
}

function updateButtons() {
	const buttons = document.querySelectorAll('.buttons button');
	buttons.forEach(button => {
		const value = button.innerText;
		if (isNaN(parseInt(value))) {
			// Button is not a number
			if (currentBase === 16) {
				// Enable the hex alphabet dropdown only when base is hexadecimal
				document.getElementById('hexAlphabetDropdown').disabled = false;
		document.getElementById('hexAlphabetSelect').disabled = false;
		const letters = document.getElementsByClassName('letters');
		for(letter in letters){
			letter.disabled = false;
		}
			} else {
				// Disable the hex alphabet dropdown for other bases
				document.getElementById('hexAlphabetDropdown').disabled = true;
		document.getElementById('hexAlphabetSelect').disabled = true;
		const letters = document.getElementsByClassName('letters');
		for(letter in letters){
			letter.disabled = true;
		}
			}
		} else {
			// Button is a number
			if (parseInt(value) >= currentBase) {
				button.disabled = true;
			} else {
				button.disabled = false;
			}
		}
	});
}

// Function to add a selected hexadecimal alphabet character
function addHexAlphabetCharacter() {
	const selectedCharacter = document.getElementById('hexAlphabetSelect').value;
	appendValue(selectedCharacter);
}

// Initialize the hex alphabet dropdown with A-F options
function initializeHexAlphabetDropdown() {
	const hexAlphabetDropdown = document.getElementById('hexAlphabetDropdown');
	const hexAlphabetSelect = document.createElement('select');
	hexAlphabetSelect.id = 'hexAlphabetSelect';
	hexAlphabetSelect.disabled = true;

	for (let i = 0; i < 6; i++) {
		const hexCharacter = String.fromCharCode(65 + i); // A-F
		const option = document.createElement('option');
		option.value = hexCharacter;
		option.text = hexCharacter;
	option.classList.add('letters');
		hexAlphabetSelect.appendChild(option);
	}

	hexAlphabetDropdown.appendChild(hexAlphabetSelect);
	hexAlphabetSelect.addEventListener('change', addHexAlphabetCharacter);
}

// Call the initialization function when the page loads
window.onload = initializeHexAlphabetDropdown;

function appendValue(value) {
	currentValue += value;
	updateDisplay();
}

function appendOperator(operator) {
	currentValue += operator;
	updateDisplay();
}

function leftShift() {
	currentValue += ' << ';
	updateDisplay();
}

function rightShift() {
	currentValue += ' >> ';
	updateDisplay();
}

// Define token types for the lexer
const TokenType = {
	NUMBER: 'NUMBER',
	OPERATOR: 'OPERATOR',
	LEFT_PAREN: 'LEFT_PAREN',
	RIGHT_PAREN: 'RIGHT_PAREN'
};

// Tokenize the input expression
function tokenize(expression) {
	const tokens = [];
	let currentToken = '';

	for (let i = 0; i < expression.length; i++) {
		const char = expression[i];

		// Skip spaces
		if (char === ' ') {
			continue;
		}

		// Check for operators
		if (isOperator(char)) {
			// If we have a current token, push it to the tokens array with type
			if (currentToken !== '') {
				tokens.push({ type: TokenType.NUMBER, value: currentToken });
				currentToken = '';
			}
			if (char === '(') {
				tokens.push({ type: TokenType.LEFT_PAREN, value: char });
			} else if (char === ')') {
				tokens.push({ type: TokenType.RIGHT_PAREN, value: char });
			} else {
				tokens.push({ type: TokenType.OPERATOR, value: char });
			}
		} else {
			// If it's not an operator, add it to the current token
			currentToken += char;
		}
	}

	// Add the last token if it exists
	if (currentToken !== '') {
		tokens.push({ type: TokenType.NUMBER, value: currentToken });
	}

	return tokens;
}

// Helper function to check if a character is an operator
function isOperator(char) {
	return ['+', '-', '*', '/', '&', '|', '^', '(', ')'].includes(char);
}

// AST Node types
const ASTNodeType = {
	BINARY_OP: 'BinaryOperation',
	NUMBER: 'Number',
};

// AST Node for binary operations
class BinaryOperation {
	constructor(operator, left, right) {
		this.type = ASTNodeType.BINARY_OP;
		this.operator = operator;
		this.left = left;
		this.right = right;
	}
}

// AST Node for numbers
class NumberNode {
	constructor(value) {
		this.type = ASTNodeType.NUMBER;
		this.value = value;
	}
}

// Custom parser to build the AST with proper precedence
function parse(tokens) {
	let index = 0;

	// Helper function to get operator precedence
	function getPrecedence(operator) {
		switch (operator) {
			case '+':
			case '-':
				return 1;
			case '*':
			case '/':
				return 2;
			case '&':
			case '|':
			case '^':
				return 3;
			default:
				return 0; // Default precedence for unknown operators
		}
	}

	function parsePrimary() {
		const token = tokens[index];
		if (token.type === TokenType.NUMBER) {
			index++;
			return new NumberNode(parseFloat(token.value));
		} else if (token.type === TokenType.LEFT_PAREN) {
			index++;
			const expression = parseExpression();
			if (tokens[index].type === TokenType.RIGHT_PAREN) {
				index++;
				return expression;
			} else {
				throw new Error('Expected closing parenthesis');
			}
		}
		throw new Error('Unexpected token: ' + token.value);
	}

	function parseExpression() {
		let left = parsePrimary();
		while (index < tokens.length) {
			const token = tokens[index];
			if (token.type === TokenType.OPERATOR) {
				const operator = token.value;
				const precedence = getPrecedence(operator);

				if (precedence === 0) {
					break; // Not an operator, exit
				}

				index++;
				let right = parseExpression();
				while (index < tokens.length) {
					const nextOperator = tokens[index].value;
					const nextPrecedence = getPrecedence(nextOperator);
					if (nextPrecedence > precedence) {
						right = parseBinaryOperation(operator, right, parseExpression());
					} else {
						break;
					}
				}
				left = parseBinaryOperation(operator, left, right);
			} else {
				break; // Not an operator, exit
			}
		}
		return left;
	}

	function parseBinaryOperation(operator, left, right) {
		return new BinaryOperation(operator, left, right);
	}

	return parseExpression();
}

// Updated evaluate function to handle parentheses
function evaluate(node) {
	if (node.type === ASTNodeType.NUMBER) {
		return node.value;
	} else if (node.type === ASTNodeType.BINARY_OP) {
		const leftValue = evaluate(node.left);
		const rightValue = evaluate(node.right);
		switch (node.operator) {
			case '+':
				return leftValue + rightValue;
			case '-':
				return leftValue - rightValue;
			case '*':
				return leftValue * rightValue;
			case '/':
				return leftValue / rightValue;
			case '&':
				return leftValue & rightValue;
			case '|':
				return leftValue | rightValue;
			case '^':
				return leftValue ^ rightValue;
			default:
				throw new Error('Unsupported operator: ' + node.operator);
		}
	}
	throw new Error('Invalid AST node type: ' + node.type);
}

function calculateResult() {
	try {
		const expression = getCurrentVal();
		const tokens = tokenize(expression);
		const ast = parse(tokens);
		const result = evaluate(ast);
		currentValue = result.toString(currentBase);
		previousAns = currentValue;
		updateDisplay();
	} catch (error) {
		alert('Invalid input');
		console.log(error);
		clearDisplay();
	}
}

function appendAns() {
	appendValue(previousAns);
	updateDisplay();
}

function clearDisplay() {
	currentValue = '';
	updateDisplay();
}

function updateDisplay() {
	document.getElementById('display').value = currentValue;
}

/*function evaluate(expression) {
	// Implement custom parser and evaluator here to handle different bases
	// Need to build an Abstract Syntax Tree (AST) and evaluate it accordingly
	return eval(expression);
}*/