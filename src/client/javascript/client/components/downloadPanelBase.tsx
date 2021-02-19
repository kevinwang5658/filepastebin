import {Component, h} from "preact";
// @ts-ignore
import styles from './download-page.module.css'
import {Constants} from "../../../../shared/constants";
import FileDescription = Constants.FileDescription;
import {DownloadFileItem} from "./downloadFileItem";

export type DownloadPageBaseProps = {
    filesList: FileDescription[]
}

export type DownloadPageBaseState = {
    isDownloadClicked: boolean
}

export class DownloadPanelBase extends Component<DownloadPageBaseProps, DownloadPageBaseState>{

    constructor(props) {
        super(props);
        this.setState({
            isDownloadClicked: false
        })
    }

    private onDownloadClicked = (ev) => {
        this.setState({
            isDownloadClicked: true
        })
    }

    render() {
        return (
            <div className={styles.downloadPanelWrapper}>
                <div className={styles.downloadPanelHeader}>Files</div>
                <div className={styles.filesList}>
                    {
                        this.props.filesList.map(f => (
                            <DownloadFileItem fileName={f.fileName} fileSize={f.fileSize} progress={0} isDownloadClicked={this.state.isDownloadClicked} />
                        ))
                    }
                </div>
                <button onClick={this.onDownloadClicked} className={["blue-round", styles.downloadButton].join(' ')}>Download</button>
            </div>
        )
    }
}
