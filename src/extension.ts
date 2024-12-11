// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
//import {generateRootTestCMake, generateTestMain, generateTestsForFile} from './cpp_test_creator';
import { CMakeBuildSystem } from './cmake_build_system';
import { GoogleTestTestCreator } from './cpp_googletest_creator';
import { TestCreatorContext } from './test_creator_context';
import { AccessSpecifier } from './cpp_objects';
import * as fs from 'fs';
import * as path from 'path';

function getRelativePathFromRoot(filePath: string, relativeTestDir: string): string | null  {
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
    parts[0] = relativeTestDir; 
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
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!editor || !workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }


        // Get the current file path
        const filePath = editor.document.uri.fsPath;
        const rootFolderPath = workspaceFolders[0].uri.fsPath; 

        if(!endings.includes(path.extname(filePath))) {
            vscode.window.showErrorMessage('The selected file must be a C++ file');
            return;
        }

        const config = vscode.workspace.getConfiguration('testScribe');
        const ctx: TestCreatorContext = {
            rootDir: rootFolderPath,
            testFiles: [filePath],
            generatedForMethodVisibilities: [AccessSpecifier.Public],
            relativeTestDirName: config.get<string>("testPath") ?? "tests"
        };

        const testPath = getRelativePathFromRoot(filePath, ctx.relativeTestDirName);
        if(testPath === null) {
            return;
        }

        console.log(`Curr file - file path: ${filePath}`);
        //generateForFiles([filePath], path.dirname(filePath), path.dirname(testPath));


        const testCreator: GoogleTestTestCreator = new GoogleTestTestCreator(ctx, new CMakeBuildSystem("templates/GoogleTest", ctx));
        testCreator.generateTests();
    });

    const forSelectedDir = vscode.commands.registerCommand('testscribe.forSelectedDir', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if(!workspaceFolders || workspaceFolders.length === 0) {
            return null;
        }
        
        const rootFolderPath = workspaceFolders[0].uri.fsPath; 

        const d = vscode.Uri.joinPath(workspaceFolders[0].uri);
        const srcFolderUri = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: true,
            openLabel: 'Select source folder',
            defaultUri: d
        });

        if(!srcFolderUri) {
            return;
        }

        const allSrcFiles = srcFolderUri.flatMap(uri => getHppFilesRecursively(uri.fsPath));

        if(allSrcFiles.length === 0) {
            vscode.window.showErrorMessage('No C++ files found under the selected directories!');
            return;
        }

        const config = vscode.workspace.getConfiguration('testScribe');
        const visibilitiesToGenerateFor: AccessSpecifier[] = [AccessSpecifier.Public];
        if(config.get<boolean>("generateForClassPrivateMethods")) {
            visibilitiesToGenerateFor.push(AccessSpecifier.Private);
        }

        if(config.get<boolean>("generateForClassProtectedMethods")) {
            visibilitiesToGenerateFor.push(AccessSpecifier.Protected);
        }
        
        const ctx: TestCreatorContext = {
            rootDir: rootFolderPath,
            generatedForMethodVisibilities: visibilitiesToGenerateFor,
            testFiles: allSrcFiles,
            relativeTestDirName: config.get<string>('testPath') ?? "tests"
        };

        const testCreator: GoogleTestTestCreator = new GoogleTestTestCreator(ctx, new CMakeBuildSystem("templates/GoogleTest", ctx));


        testCreator.generateTests();
    });


	context.subscriptions.push(forCurrFile, forSelectedDir);
}

// This method is called when your extension is deactivated
export function deactivate() {}