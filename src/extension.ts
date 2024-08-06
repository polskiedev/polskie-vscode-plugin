import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.getActiveFilePath', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const filePath = editor.document.uri.fsPath;
            const tempFilePath = path.join(os.tmpdir(), 'vscode-active-file.txt');
            fs.writeFileSync(tempFilePath, filePath, 'utf-8');
            vscode.window.showInformationMessage(`Active file: ${filePath}`);
            vscode.window.showInformationMessage(`Temp file: ${tempFilePath}`);
        } else {
            vscode.window.showInformationMessage('No active file');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
