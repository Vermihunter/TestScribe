// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {generateTestCMake, generateTestMain, generateTestsForFile} from './cpp_test_creator';

const fs = require('fs');
const path = require('path');


function getRelativePathFromRoot(filePath: string): [string | null, string | null]  {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if(!workspaceFolders || workspaceFolders.length === 0) {
        return [null, null];
    }
    
    const rootPath = workspaceFolders[0].uri.fsPath;
    const relativePath = path.relative(rootPath, filePath);
    if(relativePath.startsWith('..')) {
        return [null, null];
    }
    
    const parts = relativePath.split(path.sep); 
    parts[0] = "tests"; 
    const testPath = path.resolve(rootPath, parts.join(path.sep));
    return [testPath, parts.slice(1).join(path.sep)];
}

function generateForFiles(fileNames: string[], srcRoot: string, testFilePath: string) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if(!workspaceFolders || workspaceFolders.length === 0) {
        return null;
    }

    const testRootPath = path.resolve(workspaceFolders[0].uri.fsPath, "tests");
    const generatedCppFiles: string[] = fileNames.flatMap(input =>  
        generateTestsForFile(input, srcRoot, testFilePath));
        
    generateTestMain(testRootPath);
    generateTestCMake(generatedCppFiles, testRootPath);
}

const endings = ['.hpp', '.cpp', '.h'];
function getHppFilesRecursively(dir: string): string[] {
    let hppFiles: string[] = [];

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Recursively read subdirectories
            hppFiles = hppFiles.concat(getHppFilesRecursively(fullPath));
        } else if (entry.isFile() && endings.some(ending => fullPath.endsWith(ending))) {
            // Add the .hpp file to the list
            hppFiles.push(fullPath);
        }
    }

    return hppFiles;
}


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
        // Get the active editor
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        // Get the current file path
        const filePath = editor.document.uri.fsPath;

        const [testPath, relativePath] = getRelativePathFromRoot(filePath);
        if(testPath === null) {
            return;
        }

        console.log(`Curr file - file path: ${filePath}`);
        generateForFiles([filePath], path.dirname(filePath), path.dirname(testPath));
    });

    const forSelectedDir = vscode.commands.registerCommand('testscribe.forSelectedDir', async () => {
        const folderUri = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select source folder'
        });

        if(folderUri === undefined || folderUri[0] === null) {
            return;
        }
        
        const rootPath = folderUri[0].fsPath;
        const [testPath, relativePath] = getRelativePathFromRoot(rootPath);
        if(testPath === null) {
            return;
        }

        const cppFiles = getHppFilesRecursively(rootPath);
        console.log(`Cpp files: ${cppFiles}`);
        console.log(`Test path: ${testPath}`);
        console.log(`Root path: ${rootPath}`);
        generateForFiles(cppFiles, rootPath, testPath);
    });


	context.subscriptions.push(forCurrFile, forSelectedDir);
}

// This method is called when your extension is deactivated
export function deactivate() {}
