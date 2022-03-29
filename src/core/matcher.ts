import { GlobPattern, workspace } from 'vscode';
import { JsonFile } from './json-file';
import { Matched } from './matched';

export class Matcher {
  async all(include: GlobPattern = '**/*.json') {
    const files = await workspace.findFiles(include, 'node_modules');

    const jsonInfoList = await Promise.all(files.map(async uri => {
      try {
        return await JsonFile.parse(uri);
      } catch (error) {
        /**
         * Not support invalid json or jsonc
         */
        return new JsonFile(uri, '', new Map());
      }
    }));

    return jsonInfoList;
  }

  async match(list: Array<JsonFile>, expression: string) {
    const matchedList = new Array<Matched>(0);
    for (const item of list) {
      const location = item.locations.get(expression);
      if (location) {
        matchedList.push(new Matched(item, expression, location));
      }
    }
    return matchedList;
  }

  async matchAllJSON(expression: string) {
    const all = await this.all();
    return this.match(all, expression.trim());
  }
}
