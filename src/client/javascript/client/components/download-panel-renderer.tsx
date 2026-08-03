import { h, render } from "preact";
import { Constants } from '../../constants';
import { DownloadPanelBase } from "./download-panel-base";
import FileDescription = Constants.FileDescription;

export class DownloadPanelRenderer {
  private downloadPanelBase: DownloadPanelBase;

  constructor() {
    render(
      <DownloadPanelBase
        onDownloadClickedCallback={() => {}}
        progress={[]}
        filesList={[]}
        loading={true}
        ref={f => this.downloadPanelBase = f as DownloadPanelBase}
      />, document.getElementById("download-panel"),
    );
  }

  public setFiles(files: FileDescription[]) {
    this.downloadPanelBase.setFiles(files);
  }

  public setOnDownloadClickedCallback(callback: () => void) {
    this.downloadPanelBase.setDownloadCallback(callback);
  }

  public updateProgress(progress: number[]) {
    this.downloadPanelBase.setProgress(progress);
  }

  public showRoomNotFound() {
    this.downloadPanelBase.setNotFound();
  }
}
