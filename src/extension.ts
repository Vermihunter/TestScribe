// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
//import {generateRootTestCMake, generateTestMain, generateTestsForFile} from './cpp_test_creator';
import { CMakeBuildSystem } from './cmake_build_system';
import { GoogleTestTestCreator } from './cpp_googletest_creator';

const fs = require('fs');
const path = require('path');


function getRelativePathFromRoot(filePath: string): string | null  {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if(!workspaceFolders || workspaceFolders.length === 0) {
        return null;
    }
    
    const rootPath = workspaceFolders[0].uri.fsPath;
    const relativePath = path.relative(rootPath, filePath);
    if(relativePath.startsWith('..')) {
        return null;
    }
    
    const parts = relativePath.split(path.sep); 
    parts[0] = "tests"; 
    const testPath = path.resolve(rootPath, parts.join(path.sep));
    return testPath;
}

function generateForFiles(fileNames: string[], srcRoot: string, testFilePath: string) {
    // const workspaceFolders = vscode.workspace.workspaceFolders;
    // if(!workspaceFolders || workspaceFolders.length === 0) {
    //     return null;
    // }

    // const testRootPath = path.resolve(workspaceFolders[0].uri.fsPath, "tests");
    // const generatedCppFiles: string[] = fileNames.flatMap(input =>  
    //     generateTestsForFile(input, srcRoot, testFilePath));
      
    // // This is unnecessary -> possible to link with google test's main 
    // //generateTestMain(testRootPath);

    // // TODO: get all relative paths from root/tests -> pass as third argument that are not root/tests = subdirectories
    // console.log(`Generated cpp files: ${generatedCppFiles}`);
    // const subdirectories = Array.from(
    //     // Make a set -> remove duplicates
    //     new Set(generatedCppFiles
    //     .map(x => path.relative(testFilePath, path.dirname(x)))
    //     .filter(x => x !== ""))); // Remove empty paths -> test files in root/tests (they are part of the root CMakeLists.txt)
    
    // console.log(`Subdirectories: ${subdirectories} - testFilePath: ${testFilePath}`);
    // generateRootTestCMake(generatedCppFiles, testRootPath, subdirectories);
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

        const testPath = getRelativePathFromRoot(filePath);
        if(testPath === null) {
            return;
        }

        console.log(`Curr file - file path: ${filePath}`);
        generateForFiles([filePath], path.dirname(filePath), path.dirname(testPath));
    });

    const forSelectedDir = vscode.commands.registerCommand('testscribe.forSelectedDir', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if(!workspaceFolders || workspaceFolders.length === 0) {
            return null;
        }
        
        const rootFolderPath = workspaceFolders[0].uri.fsPath; 

        const srcFolderUri = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select source folder'
        });

        if(srcFolderUri === undefined || srcFolderUri[0] === null) {
            return;
        }

        const srcFolderPath: string = srcFolderUri[0].fsPath;
        
        // const srcRootPath = srcFolderUri[0].fsPath;
        // const testPath = getRelativePathFromRoot(rootPath);
        // if(testPath === null) {
        //     return;
        // }

        // const cppFiles = getHppFilesRecursively(rootPath);
        // generateForFiles(cppFiles, rootPath, testPath);

        // console.log(`Root path: ${rootFolderPath}`);
        // console.log(`Src path: ${srcFolderPath}`);
        // console.log(`C++ files: ${getHppFilesRecursively(srcFolderPath)}`);
        const testCreator: GoogleTestTestCreator = new GoogleTestTestCreator({
            rootDir: rootFolderPath,
            relativeSrcDir: srcFolderPath,
            testFiles: getHppFilesRecursively(srcFolderPath)//["./src/test/data/src/nested/example.h", "./src/test/data/src/nested/double_nested/Game.h"]
            
        }, new CMakeBuildSystem("templates/GoogleTest"));


        testCreator.generateTests();
    });


	context.subscriptions.push(forCurrFile, forSelectedDir);
}

// This method is called when your extension is deactivated
export function deactivate() {}
