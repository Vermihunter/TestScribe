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

const cppFileEndings = ['.hpp','.hh', '.hxx', '.h', '.cpp', '.cc', '.cxx', '.c'];
function getCppFilesRecursively(dir: string): string[] {
    let cppFiles: string[] = [];

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            cppFiles = cppFiles.concat(getCppFilesRecursively(fullPath));
        } else if (entry.isFile() && cppFileEndings.some(ending => fullPath.endsWith(ending))) {
            cppFiles.push(fullPath);
        }
    }

    return cppFiles;
}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

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

        if(!cppFileEndings.includes(path.extname(filePath))) {
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

        new GoogleTestTestCreator(ctx, new CMakeBuildSystem("templates/GoogleTest", ctx)).generateTests();
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

        const allSrcFiles = srcFolderUri.flatMap(uri => getCppFilesRecursively(uri.fsPath));

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

        new GoogleTestTestCreator(ctx, new CMakeBuildSystem("templates/GoogleTest", ctx)).generateTests();
    });


	context.subscriptions.push(forCurrFile, forSelectedDir);
}

// This method is called when your extension is deactivated
export function deactivate() {}