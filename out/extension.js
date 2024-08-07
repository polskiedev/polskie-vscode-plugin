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
function activate(context) {
    // Create a status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    statusBarItem.text = `FP`;
    statusBarItem.tooltip = 'Click to copy activeFilePath to clipboard';
    statusBarItem.command = 'extension.getActiveFilePath';
    statusBarItem.show();
    let disposable = vscode.commands.registerCommand('extension.getActiveFilePath', () => __awaiter(this, void 0, void 0, function* () {
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
    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
