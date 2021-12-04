import { h, render } from "preact";
import { FileInputiBase } from "./file-inputi-base";

export class FileInputRenderer {

  private paste = document.getElementById('paste') as HTMLButtonElement;
  private fileInputBase;

  constructor() {
    render(
      <FileInputiBase pasteButton={this.paste}
                      ref={ref => this.fileInputBase = ref}/>, document.getElementById("file-input")
    );
  }

  public getFileList = () => {
    return this.fileInputBase.state.filesList
  }
}
