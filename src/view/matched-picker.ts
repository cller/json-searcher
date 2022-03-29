import vscode, { QuickPickItem } from 'vscode';
import { Matcher } from '../core/matcher';

export class MatchedPicker {
  private readonly matcher = new Matcher();

  constructor(currentExpression: string) {
    this.matcher.all().then(async (all) => {
      const items = new Array<QuickPickItem>();

      all.forEach(jsonInfo => {
        jsonInfo.locations.forEach((location, expression) => {
          if (!items.some(item => item.label === expression)) {
            const item: QuickPickItem = {
              label: expression,
              description: jsonInfo.getText(location),
              picked: expression === currentExpression
            };
            items.push(item);
          }
        });
      });

      const selected = await vscode.window.showQuickPick(items, {});

      if (selected) {
        const snippet = new vscode.SnippetString(`${selected.label}`);
        vscode.window.activeTextEditor?.insertSnippet(snippet);
      }
    });
  }
}
