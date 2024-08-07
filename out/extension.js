"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
function activate(context) {
    // Create a status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    statusBarItem.text = `FPath`;
    statusBarItem.tooltip = 'Click to copy activeFilePath to clipboard';
    statusBarItem.command = 'polskie-plugin.getActiveFilePath';
    statusBarItem.show();
    let getActiveFilePathDisposable = vscode.commands.registerCommand('polskie-plugin.getActiveFilePath', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const filePath = editor.document.uri.fsPath;
            // const tempFilePath = path.join(os.tmpdir(), 'vscode-active-file.txt');
            // fs.writeFileSync(tempFilePath, filePath, 'utf-8');
            yield vscode.env.clipboard.writeText(filePath);
            vscode.window.showInformationMessage(`Active file: ${filePath}`);
            // vscode.window.showInformationMessage(`Temp file: ${tempFilePath}`);
        }
        else {
            vscode.window.showInformationMessage('No active file');
        }
    }));
    const readOnlyDisposable = vscode.commands.registerCommand('polskie-plugin.tagAsReadOnly', (uri) => __awaiter(this, void 0, void 0, function* () {
        if (uri) {
            const filePath = uri.fsPath;
            fs.chmod(filePath, '0444', (err) => {
                if (err) {
                    vscode.window.showErrorMessage(`Failed to tag the file as read-only: ${err.message}`);
                }
                else {
                    vscode.window.showInformationMessage('File tagged as read-only!');
                    updateReadOnlyContext(uri, true);
                }
            });
        }
        else {
            vscode.window.showWarningMessage('No file selected');
        }
    }));
    const untagReadOnlyDisposable = vscode.commands.registerCommand('polskie-plugin.untagAsReadOnly', (uri) => __awaiter(this, void 0, void 0, function* () {
        if (uri) {
            const filePath = uri.fsPath;
            fs.chmod(filePath, '0644', (err) => {
                if (err) {
                    vscode.window.showErrorMessage(`Failed to untag the file as read-only: ${err.message}`);
                }
                else {
                    vscode.window.showInformationMessage('File untagged as read-only!');
                    updateReadOnlyContext(uri, false);
                }
            });
        }
        else {
            vscode.window.showWarningMessage('No file selected');
        }
    }));
    const updateReadOnlyContext = (uri, isReadOnly) => {
        vscode.commands.executeCommand('setContext', 'isReadOnly', isReadOnly);
    };
    const updateContextForActiveEditor = () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const filePath = editor.document.uri.fsPath;
            fs.access(filePath, fs.constants.W_OK, (err) => {
                const isReadOnly = !!err;
                vscode.commands.executeCommand('setContext', 'isReadOnly', isReadOnly);
            });
        }
        else {
            vscode.commands.executeCommand('setContext', 'isReadOnly', false);
        }
    };
    const updateContextForFileExplorer = (resource) => __awaiter(this, void 0, void 0, function* () {
        const filePath = resource.fsPath;
        fs.stat(filePath, (err, stats) => {
            if (!err) {
                const isFile = stats.isFile();
                vscode.commands.executeCommand('setContext', 'isFile', isFile);
                if (isFile) {
                    fs.access(filePath, fs.constants.W_OK, (err) => {
                        const isReadOnly = !!err;
                        vscode.commands.executeCommand('setContext', 'isReadOnly', isReadOnly);
                    });
                }
            }
        });
    });
    vscode.window.onDidChangeActiveTextEditor(updateContextForActiveEditor);
    vscode.window.onDidChangeVisibleTextEditors(updateContextForActiveEditor);
    vscode.workspace.onDidOpenTextDocument(updateContextForActiveEditor);
    vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            updateContextForFileExplorer(editor.document.uri);
        }
    });
    vscode.commands.registerCommand('extension.openFile', (resource) => {
        updateContextForFileExplorer(resource);
    });
    vscode.workspace.onDidOpenTextDocument((document) => {
        updateContextForFileExplorer(document.uri);
    });
    vscode.workspace.onDidCloseTextDocument((document) => {
        updateContextForFileExplorer(document.uri);
    });
    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(getActiveFilePathDisposable);
    context.subscriptions.push(readOnlyDisposable);
    context.subscriptions.push(untagReadOnlyDisposable);
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateContextForActiveEditor));
    context.subscriptions.push(vscode.window.onDidChangeVisibleTextEditors(updateContextForActiveEditor));
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(updateContextForActiveEditor));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
