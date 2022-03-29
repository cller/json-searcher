import { Range, TextDocumentShowOptions, TreeItem } from 'vscode';
import { Matched } from '../core';

export class MatchedLocation extends TreeItem {
  constructor(public matched: Matched) {
    super(`${matched.expression}`);
    const matchedText = this.matched.text;
    const textDocumentShowOptions: TextDocumentShowOptions = {
      selection: new Range(
        this.matched.location.start.line - 1, this.matched.location.start.column - 1,
        this.matched.location.end.line - 1, this.matched.location.end.column
      )
    };
    this.resourceUri = this.matched.jsonFile.uri;
    this.description = matchedText;
    this.tooltip = matchedText;
    this.command = {
      title: 'Go to file',
      command: 'vscode.open',
      arguments: [this.matched.jsonFile.uri, textDocumentShowOptions]
    };
  }
}
