import { Component, h } from "preact";
// @ts-ignore
import styles from "./file-input.module.css";
import { FileItem } from "./file-item";

export type FileInputListProps = {
  openFileSelector: () => void
  onFileRemoved: (name: number) => void
  filesList: File[]
}

export type FileInputListState = {}

export class FileInputList extends Component<FileInputListProps, FileInputListState> {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div className={styles.FileList}>
      {
        this.props.filesList.map((f, idx) => <FileItem fileName={f.name} index={idx}
                                                       onFileRemoved={this.props.onFileRemoved}/>)
      }
      {this.props.filesList.length == 0 &&
      <label
        onClick={this.props.openFileSelector}
        className={styles.FileInputDescription}>Click to add file, or drag and drop</label>
      }
    </div>)
  }

}
