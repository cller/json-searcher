import { ThemeColor, ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { JsonFile } from '../core';
import { MatchedLocation } from './matched-location';

export class MatchedFile extends TreeItem {
  constructor(
    public readonly jsonFile: JsonFile,
    public readonly locations: MatchedLocation[]
  ) {
    super(`${jsonFile.uri.fsPath}`, TreeItemCollapsibleState.Expanded);
    this.resourceUri = jsonFile.uri;
    this.iconPath = new ThemeIcon('json', new ThemeColor('icon.foreground'));
  }
}
