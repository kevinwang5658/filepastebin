import {Component, h} from "preact";
// @ts-ignore
import styles from './download-page.module.css'
import {Constants} from "../../../../shared/constants";
import FileDescription = Constants.FileDescription;
import {DownloadFileItem} from "./downloadFileItem";

export type DownloadPageBaseProps = {
    filesList: FileDescription[],
    progress: number[],
    onDownloadClickedCallback: () => void
}

export type DownloadPageBaseState = {
    isDownloadClicked: boolean
    progress: number[]
}

export class DownloadPanelBase extends Component<DownloadPageBaseProps, DownloadPageBaseState>{

    constructor(props) {
        super(props);
        this.setState({
            isDownloadClicked: false,
            progress: this.props.progress
        })
    }

    public setProgress = (progress: number[]) => {
        this.setState({
            progress: progress
        })
    }

    private onDownloadClicked = (ev) => {
        this.setState({
            isDownloadClicked: true
        })
        this.props.onDownloadClickedCallback()
    }

    render() {
        return (
            <div className={styles.downloadPanelWrapper}>
                <div className={styles.downloadPanelHeader}>Files</div>
                <div className={styles.filesList}>
                    {
                        this.props.filesList.map((f, idx) => (
                            <DownloadFileItem fileName={f.fileName} fileSize={f.fileSize} progress={this.state.progress[idx]} isDownloadClicked={this.state.isDownloadClicked} />
                        ))
                    }
                </div>
                <button onClick={this.onDownloadClicked}
                        style={this.state.isDownloadClicked && {background: '#62A4F0'}}
                        disabled={this.state.isDownloadClicked}
                        className={["blue-round", styles.downloadButton].join(' ')}>Download</button>
            </div>
        )
    }
}
