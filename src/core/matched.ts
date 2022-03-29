import { JsonFile } from './json-file';
import { Location } from './location';

export class Matched {

  get text() {
    return this.jsonFile.getText(this.location);
  }

  constructor(
    public jsonFile: JsonFile,
    public expression: string,
    public location: Location
  ) {
  }
}