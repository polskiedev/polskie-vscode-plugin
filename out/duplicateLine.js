"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    // Register the duplicate line command
    const duplicateLineCommand = vscode.commands.registerCommand('extension.duplicateLine', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No active editor
        }
        const selections = editor.selections;
        if (selections.length === 0) {
            return; // No selection
        }
        const textEdits = [];
        for (const selection of selections) {
            const text = editor.document.getText(selection);
            const startPosition = new vscode.Position(selection.start.line + 1, 0);
            textEdits.push(vscode.TextEdit.insert(startPosition, text + '\n'));
        }
        editor.edit(editBuilder => {
            for (const edit of textEdits) {
                editBuilder.insert(edit.range.start, edit.newText);
            }
        });
    });
    // Register the command
    context.subscriptions.push(duplicateLineCommand);
}
exports.activate = activate;
// Deactivate function (optional)
function deactivate() { }
exports.deactivate = deactivate;
