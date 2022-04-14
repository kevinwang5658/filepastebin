import { Component, h } from "preact";
import { FileDragAndDropHandler } from "./file-drag-and-drop-handler";
import { FileInputList } from "./file-input-list";
import styles from './file-input.module.css';

export type FileInputBaseProps = {
  pasteButton: HTMLButtonElement,
}

export type FileInputBaseState = {
  filesList: File[]
}

export class FileInputiBase extends Component<FileInputBaseProps, FileInputBaseState> {
  private fileInput;
  private fileDragAndDropHandler;

  constructor(props) {
    super(props);
    this.setState({
      filesList: [],
    });
    this.fileDragAndDropHandler = new FileDragAndDropHandler(this.onFileDropped);
  }

  render() {
    return (<div className={styles.FileInputWrapper}>
      <FileInputList openFileSelector={this.openFileSelector} filesList={this.state.filesList}
                     onFileRemoved={this.onFileRemoved}/>
      <div className={styles.AddFileButtonDivider}/>
      <button className={styles.AddFileButton} onClick={this.openFileSelector}>Add files</button>
      <input className={styles.FileInput}
             ref={ref => this.fileInput = ref}
             onChange={this.onFileInputChanged}
             type="file" multiple/>
    </div>);
  }

  private openFileSelector = () => this.fileInput.click();

  private onFileInputChanged = () => {
    this.setState({
      filesList: this.state.filesList.concat(Array.from(this.fileInput.files)),
    });

    this.props.pasteButton.disabled = this.state.filesList.length == 0;
  };

  private onFileDropped = (filesList: File[]) => {
    this.setState({
      filesList: this.state.filesList.concat(filesList),
    });

    this.props.pasteButton.disabled = this.state.filesList.length == 0;
  };

  private onFileRemoved = (index: number) => {
    this.setState({
      filesList: this.state.filesList.splice(index, 1)
    })
  };
}
