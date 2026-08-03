import { Component, h } from "preact";
import { Constants } from '../../constants';
import { DownloadFileItem } from "./download-file-item";
import styles from './download-page.module.css';
import FileDescription = Constants.FileDescription;

export type DownloadPageBaseProps = {
  filesList: FileDescription[],
  progress: number[],
  onDownloadClickedCallback: () => void,
  loading: boolean,
}

export type DownloadPageBaseState = {
  isDownloadClicked: boolean,
  progress: number[],
  filesList: FileDescription[],
  loading: boolean,
  notFound: boolean,
  onDownloadClickedCallback: () => void,
}

export class DownloadPanelBase extends Component<DownloadPageBaseProps, DownloadPageBaseState> {

  constructor(props) {
    super(props);
    this.setState({
      isDownloadClicked: false,
      progress: this.props.progress,
      filesList: this.props.filesList,
      loading: this.props.loading,
      notFound: false,
      onDownloadClickedCallback: this.props.onDownloadClickedCallback,
    });
  }

  public setProgress = (progress: number[]) => {
    this.setState({ progress });
  };

  public setFiles = (files: FileDescription[]) => {
    this.setState({ filesList: files, loading: false });
  };

  public setNotFound = () => {
    this.setState({ notFound: true, loading: false });
  };

  public setDownloadCallback = (cb: () => void) => {
    this.setState({ onDownloadClickedCallback: cb });
  };

  private onDownloadClicked = (_) => {
    this.setState({ isDownloadClicked: true });
    this.state.onDownloadClickedCallback();
  };

  render() {
    if (this.state.notFound) {
      return (
        <div className={styles.DownloadPanelWrapper}>
          <div className={styles.DownloadPanelHeader}>Room not found</div>
          <div className={styles.NotFoundMessage}>
            This transfer session has expired or does not exist.
          </div>
        </div>
      );
    }

    if (this.state.loading) {
      return (
        <div className={styles.LoadingWrapper}>
          <div className="lds-ring-gray">
            <div></div><div></div><div></div><div></div>
          </div>
          <div className={styles.LoadingText}>Connecting...</div>
        </div>
      );
    }

    return (
      <div className={styles.DownloadPanelWrapper}>
        <div className={styles.DownloadPanelHeader}>Files</div>
        <div className={styles.FilesList}>
          {
            this.state.filesList.map((f, idx) => (
              <DownloadFileItem
                key={f.fileName}
                fileName={f.fileName}
                fileSize={f.fileSize}
                progress={this.state.progress[idx] || 0}
                isDownloadClicked={this.state.isDownloadClicked}
              />
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
