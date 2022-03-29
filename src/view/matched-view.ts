import { Event, ProviderResult, TreeDataProvider, TreeItem, window } from 'vscode';
import { MatchedFile } from './matched-file';
import { Matcher } from '../core/matcher';
import { MatchedLocation } from './matched-location';
import { Matched } from '../core';

export class MatchedView implements TreeDataProvider<TreeItem> {
  matcher = new Matcher();

  onDidChangeTreeData?: Event<void | TreeItem | null | undefined> | undefined;

  getTreeItem(element: TreeItem): TreeItem {
    return element;
  }

  getChildren(element?: TreeItem): ProviderResult<TreeItem[]> {
    if (!element) {
      return this.matcher
        .matchAllJSON(this.expression)
        .then(result => this.createTree(result))
        .catch((error) => {
          window.showErrorMessage(error.message);
          return [];
        });
    } else if (element instanceof MatchedFile) {
      return element.locations;
    } else {
      return [];
    }
  }

  createTree(result: Matched[]) {
    const files = new Array<MatchedFile>(0);
    result.forEach(item => {
      const location = new MatchedLocation(item);
      const file = files.find(itemFile => itemFile.jsonFile.uri === item.jsonFile.uri);
      if (file) {
        file.locations.push(location);
      } else {
        files.push(new MatchedFile(item.jsonFile, [location]));
      }
    });
    return files;
  }

  constructor(private expression: string) {
    if (expression.length === 0) {
      window.showInputBox({
        placeHolder: 'Please input JSON expression ...'
      }).then(value => {
        this.expression = value || '';
        window.registerTreeDataProvider('jsonSearchResults', this);
      });
    } else {
      window.registerTreeDataProvider('jsonSearchResults', this);
    }
  }
}
