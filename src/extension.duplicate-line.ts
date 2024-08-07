import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os'; // Import the os module to get the home directory

export function activate(context: vscode.ExtensionContext) {
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
    const dropdownItems: vscode.QuickPickItem[] = items.map(label => ({ label }));

    // Register a command to handle the dropdown selection
    const dropdownCommand = vscode.commands.registerCommand('extension.dropdownCommand', async () => {
        const selectedOption = await vscode.window.showQuickPick(dropdownItems);
        if (selectedOption) {
            vscode.window.showInformationMessage(`Selected option: ${selectedOption.label}`);
        }
    });

    // Add the dropdown menu to the status bar item
    statusBarItem.command = 'extension.dropdownCommand';
    statusBarItem.show();

    // Register the dropdown command
    context.subscriptions.push(dropdownCommand);
    context.subscriptions.push(statusBarItem);
}

// Deactivate function (optional)
export function deactivate() {}
 