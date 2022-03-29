import { ASTNode } from 'json-to-ast';

export interface Position {
  line: number;
  column: number;
  offset: number;
}


export class Location {
  get start(): Position {
    return this.convertPosition('start');
  }

  get end(): Position {
    return this.convertPosition('end');
  }

  constructor(
    /**
     * uri string
     */
    public source: string,
    private astNode: ASTNode
  ) { }

  private convertPosition(type: 'start' | 'end'): Position {
    if (this.astNode.loc === undefined) {
      throw new Error('AST node no has location.');
    }
    return this.astNode.loc[type]
  }
}