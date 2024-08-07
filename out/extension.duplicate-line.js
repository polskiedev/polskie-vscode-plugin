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
const os = require("os"); // Import the os module to get the home directory
function activate(context) {
    // Create a status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '$(rocket) My Extension'; // Text shown in the status bar
    statusBarItem.tooltip = 'My Extension Tooltip'; // Tooltip when hovering over the status bar item
    // Read items from the text file
    const homeDir = os.homedir();
    const filePath = `${homeDir}/tests/dropdown/list.txt`;
    const dropdownItemsFile = vscode.Uri.file(filePath);
    const items = fs.readFileSync(dropdownItemsFile.fsPath, 'utf-8').split('\n').map(item => item.trim());
    // Create a dropdown menu
    const dropdownItems = items.map(label => ({ label }));
    // Register a command to handle the dropdown selection
    const dropdownCommand = vscode.commands.registerCommand('extension.dropdownCommand', () => __awaiter(this, void 0, void 0, function* () {
        const selectedOption = yield vscode.window.showQuickPick(dropdownItems);
        if (selectedOption) {
            vscode.window.showInformationMessage(`Selected option: ${selectedOption.label}`);
        }
    }));
    // Add the dropdown menu to the status bar item
    statusBarItem.command = 'extension.dropdownCommand';
    statusBarItem.show();
    // Register the dropdown command
    context.subscriptions.push(dropdownCommand);
    context.subscriptions.push(statusBarItem);
}
exports.activate = activate;
// Deactivate function (optional)
function deactivate() { }
exports.deactivate = deactivate;
