import {h, render} from "preact";
import {FileInputBase} from "./fileInputBase";

export class FileInputRenderer {

    private paste = document.getElementById('paste') as HTMLButtonElement;
    private fileInputBase;

    constructor() {
        render(
            <FileInputBase pasteButton={this.paste} ref={ref => this.fileInputBase = ref}/>, document.getElementById("file-input")
        );
    }

    public getFileList = () => {
        return this.fileInputBase.state.filesList
    }
}
