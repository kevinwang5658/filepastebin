import {h, render} from "preact";
import {DownloadPanelBase} from "./downloadPanelBase";
import {Constants} from "../../../../shared/constants";
import FileDescription = Constants.FileDescription;

export class DownloadPanelRenderer {
    constructor(filesList: FileDescription[]) {
        render(
            <DownloadPanelBase filesList={filesList}/>, document.getElementById("download-panel")
        )
    }
}
