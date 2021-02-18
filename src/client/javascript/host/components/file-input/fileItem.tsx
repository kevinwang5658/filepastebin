import {Component, h} from "preact";
// @ts-ignore
import styles from "./file-input.module.css";

export type FileItemProps = {
    fileName: string
}

export class FileItem extends Component<FileItemProps, any>{

    render() {
        return (
            <p className={styles.fileName}>{this.props.fileName}</p>
        )
    }
}
