import { Component, h } from "preact";
import { Constants } from "../../../../server/constants";
import { DownloadFileItem } from "./download-file-item";
// @ts-ignore
import styles from './download-page.module.css';
import FileDescription = Constants.FileDescription;

export type DownloadPageBaseProps = {
  filesList: FileDescription[],
  progress: number[],
  onDownloadClickedCallback: () => void
}

export type DownloadPageBaseState = {
  isDownloadClicked: boolean
  progress: number[]
}

export class DownloadPanelBase extends Component<DownloadPageBaseProps, DownloadPageBaseState> {

  constructor(props) {
    super(props);
    this.setState({
      isDownloadClicked: false,
      progress: this.props.progress,
    });
  }

  public setProgress = (progress: number[]) => {
    this.setState({
      progress: progress,
    });
  };

  private onDownloadClicked = (_) => {
    this.setState({
      isDownloadClicked: true,
    });
    this.props.onDownloadClickedCallback();
  };

  render() {
    return (
      <div className={styles.DownloadPanelWrapper}>
        <div className={styles.DownloadPanelHeader}>Files</div>
        <div className={styles.FilesList}>
          {
            this.props.filesList.map((f, idx) => (
              <DownloadFileItem fileName={f.fileName} fileSize={f.fileSize} progress={this.state.progress[idx]}
                                isDownloadClicked={this.state.isDownloadClicked}/>
            ))
          }
        </div>
        <button onClick={this.onDownloadClicked}
                style={this.state.isDownloadClicked && { background: '#62A4F0' }}
                disabled={this.state.isDownloadClicked}
                className={["blue-round", styles.DownloadButton].join(' ')}>Download
        </button>
      </div>
    );
  }
}
