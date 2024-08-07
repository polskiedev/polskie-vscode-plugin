import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    // Create a status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    statusBarItem.text = `FPath`;
    statusBarItem.tooltip = 'Click to copy activeFilePath to clipboard';
    statusBarItem.command = 'polskie-plugin.getActiveFilePath';
    statusBarItem.show();

    let getActiveFilePathDisposable = vscode.commands.registerCommand('polskie-plugin.getActiveFilePath', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const filePath = editor.document.uri.fsPath;
            // const tempFilePath = path.join(os.tmpdir(), 'vscode-active-file.txt');
            // fs.writeFileSync(tempFilePath, filePath, 'utf-8');
            await vscode.env.clipboard.writeText(filePath);
            vscode.window.showInformationMessage(`Active file: ${filePath}`);
            // vscode.window.showInformationMessage(`Temp file: ${tempFilePath}`);
        } else {
            vscode.window.showInformationMessage('No active file');
        }
    });

    const readOnlyDisposable = vscode.commands.registerCommand('polskie-plugin.tagAsReadOnly', async (uri: vscode.Uri) => {
        if (uri) {
            const filePath = uri.fsPath;
            fs.chmod(filePath, '0444', (err) => {
                if (err) {
                    vscode.window.showErrorMessage(`Failed to tag the file as read-only: ${err.message}`);
                } else {
                    vscode.window.showInformationMessage('File tagged as read-only!');
                    updateReadOnlyContext(uri, true);
                }
            });
        } else {
            vscode.window.showWarningMessage('No file selected');
        }
    });

    const untagReadOnlyDisposable = vscode.commands.registerCommand('polskie-plugin.untagAsReadOnly', async (uri: vscode.Uri) => {
        if (uri) {
            const filePath = uri.fsPath;
            fs.chmod(filePath, '0644', (err) => {
                if (err) {
                    vscode.window.showErrorMessage(`Failed to untag the file as read-only: ${err.message}`);
                } else {
                    vscode.window.showInformationMessage('File untagged as read-only!');
                    updateReadOnlyContext(uri, false);
                }
            });
        } else {
            vscode.window.showWarningMessage('No file selected');
        }
    });

    const updateReadOnlyContext = (uri: vscode.Uri, isReadOnly: boolean) => {
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
        } else {
            vscode.commands.executeCommand('setContext', 'isReadOnly', false);
        }
    };

    const updateContextForFileExplorer = async (resource: vscode.Uri) => {
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
    };

    vscode.window.onDidChangeActiveTextEditor(updateContextForActiveEditor);
    vscode.window.onDidChangeVisibleTextEditors(updateContextForActiveEditor);
    vscode.workspace.onDidOpenTextDocument(updateContextForActiveEditor);

    vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            updateContextForFileExplorer(editor.document.uri);
        }
    });

    vscode.commands.registerCommand('extension.openFile', (resource: vscode.Uri) => {
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

export function deactivate() { }
