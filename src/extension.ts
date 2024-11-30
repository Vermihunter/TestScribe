// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "testscribe" is now active!');


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
    const forCurrFile = vscode.commands.registerCommand('testscribe.forCurrFile', () => {
        console.log("Curr file");
        // Get the active editor
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        // Get the current file path
        const filePath = editor.document.uri.fsPath;

        // Get the current file content
        const fileContent = editor.document.getText();

        // Print the path and content (log to console and show a message)
        console.log('Current File Path:', filePath);
        console.log('Current File Content:', fileContent);
    });

    const forSelectedDir = vscode.commands.registerCommand('testscribe.forSelectedDir', () => {
    
    });


	const forSelected = vscode.commands.registerCommand('testscribe.forSelected', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }

        // Get the selected text
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (selectedText) {
            // Print the selected text
            console.log('Selected Test:', selectedText);
            vscode.window.showInformationMessage(`Selected Test: ${selectedText}`);
        } else {
            vscode.window.showWarningMessage('No text selected');
        }

		vscode.window.showInformationMessage('Hello Worlddddd from TestScribe!');
	});

	context.subscriptions.push(forCurrFile, forSelectedDir, forSelected);
}

// This method is called when your extension is deactivated
export function deactivate() {}
