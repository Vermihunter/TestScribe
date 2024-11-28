// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import Parser from 'tree-sitter';
import Cpp from 'tree-sitter-cpp';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const cppCode = `
	#include <iostream>
	using namespace std;

	int add(int a, int b) {
		return a + b;
	}

	void greet() {
		cout << "Hello!" << endl;
	}
	`;

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "testscribe" is now active!');

	// Initialize parser and set the language
	const parser = new Parser();
	parser.setLanguage(Cpp);

	// Parse the C++ code
	const tree = parser.parse(cppCode);

	// Get the root node
	const rootNode = tree.rootNode;

	// Traverse to find all function definitions
	const functionNodes = rootNode.descendantsOfType('function_definition');

	for (const func of functionNodes) {
		// Extract function name
		const declarator = func.childForFieldName('declarator');
		const functionName = declarator?.childForFieldName('declarator')?.text;

		// Extract return type
		const returnType = declarator?.previousSibling?.text;

		// Extract parameters
		const parameterList = declarator?.childForFieldName('parameters');
		const parameters = parameterList?.namedChildren.map(param => param.text).join(', ') || 'void';

		// Extract body
		const body = func.childForFieldName('body')?.text;

		// Print details
		console.log(`Function Name: ${functionName}`);
		console.log(`Return Type: ${returnType}`);
		console.log(`Parameters: ${parameters}`);
		console.log(`Body: ${body}`);
		console.log('-----------------------');
	}


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('testscribe.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from TestScribe!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
