import {Component, h} from "preact";
// @ts-ignore
import styles from './download-page.module.css'
import * as prettyBytes from "pretty-bytes";

export type DownloadFileItemProps = {
    fileName: string
    fileSize: number
    progress: number
    isDownloadClicked: boolean
}

export type DownloadFileItemState = {

}

export class DownloadFileItem extends Component<DownloadFileItemProps, DownloadFileItemState>{

    render() {
        return (
            <div className={styles.fileDescriptionWrapper}>
                {/*Adding animation by adding animation class if the boolean isDownloadClicked is true*/}
                <div className={[styles.fileDescription, this.props.isDownloadClicked ? styles.downloadAnimation : ""].join(' ')}>
                    {this.props.fileName + " - " + prettyBytes(this.props.fileSize)}</div>
                { this.props.isDownloadClicked &&
                    <div className={styles.fileDownloadProgress}>{`${Math.min(this.props.progress, 100).toFixed(2)}%`}</div>
                }
            </div>
        )
    }
}
