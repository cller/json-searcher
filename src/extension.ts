import * as vscode from 'vscode';
import { MatchedView, MatchedPicker } from './view';

function getSelections() {
  const textEditor = vscode.window.activeTextEditor;
  return textEditor?.selections.map(selection => textEditor.document.getText(selection)) || [];
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.jsonSearcher', async () => {
      new MatchedView(getSelections()[0]);
    }),
    vscode.commands.registerCommand('extension.jsonPicker', async () => {
      new MatchedPicker(getSelections()[0]);
    })
  );
}
