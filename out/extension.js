"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
const os = require("os");
const path = require("path");
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.getActiveFilePath', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const filePath = editor.document.uri.fsPath;
            const tempFilePath = path.join(os.tmpdir(), 'vscode-active-file.txt');
            fs.writeFileSync(tempFilePath, filePath, 'utf-8');
            vscode.window.showInformationMessage(`Active file: ${filePath}`);
            vscode.window.showInformationMessage(`Temp file: ${tempFilePath}`);
        }
        else {
            vscode.window.showInformationMessage('No active file');
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
