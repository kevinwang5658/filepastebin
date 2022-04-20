import { Component, h } from "preact";
import prettyBytes from "pretty-bytes";
import styles from './download-page.module.css';

export type DownloadFileItemProps = {
  fileName: string
  fileSize: number
  progress: number
  isDownloadClicked: boolean
}

export type DownloadFileItemState = {}

export class DownloadFileItem extends Component<DownloadFileItemProps, DownloadFileItemState> {

  render() {
    return (
      <div className={styles.fileDescriptionWrapper}>
        {/*Adding animation by adding animation class if the boolean isDownloadClicked is true*/}
        <div
          className={[styles.FileDescription, this.props.isDownloadClicked ? styles.DownloadAnimation : ""].join(' ')}>
          {this.props.fileName + " - " + prettyBytes(this.props.fileSize)}</div>
        {this.props.isDownloadClicked &&
        <div className={styles.FileDownloadProgress}>{`${Math.min(this.props.progress, 100).toFixed(2)}%`}</div>
        }
      </div>
    );
  }
}
