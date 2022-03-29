import jsonToAst, { ValueNode } from 'json-to-ast';
import { Uri, workspace } from 'vscode';
import { Location } from './location';

export class JsonFile {
  constructor(
    public uri: Uri,
    public content: string,
    public locations: Map<string, Location>
  ) {
  }

  getText(location: Location) {
    return this.content.slice(location.start.offset, location.end.offset)
  }

  static async parse(target: Uri | ValueNode, jsonInfo?: JsonFile, prefix = ''): Promise<JsonFile> {
    let node: ValueNode;
    if (target instanceof Uri) {
      const content = await new Promise<string>((resolve) => workspace.fs.readFile(target)
        .then(content => resolve(content.toString()))
      );
      node = jsonToAst(content);
      jsonInfo = new JsonFile(target, content, new Map());
    } else {
      node = target;
    }

    if (jsonInfo === undefined) {
      throw new Error('target required is uri or required set json info !!!');
    }

    switch (node.type) {
      case 'Object':
        for (const item of node.children) {
          const key = `${jsonInfo?.locations.get(prefix) ? `${prefix}.` : ''}${item.key.value}`;
          jsonInfo?.locations.set(key, new Location(key, item));
          await JsonFile.parse(item.value, jsonInfo, `${key}`);
        }
        break;
      case 'Array':
        for (const item of node.children) {
          const key = `${prefix}[${node.children.indexOf(item)}]`;
          jsonInfo?.locations.set(key, new Location(key, item));
          await JsonFile.parse(item, jsonInfo, `${key}`);
        }
        break;
    }

    return jsonInfo as JsonFile;
  }
}
