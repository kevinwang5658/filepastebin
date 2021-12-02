import {Component, h, render} from "preact";
// @ts-ignore
import styles from './file-input.module.css'
import {FileInputList} from "./fileInputList";
import {FileDragAndDropHandler} from "./fileDragAndDropHandler";

export type FileInputBaseProps = {
    pasteButton: HTMLButtonElement,
}

export type FileInputBaseState = {
    filesList: File[]
}

export class FileInputBase extends Component<FileInputBaseProps, FileInputBaseState>{
    private fileInput;
    private fileDragAndDropHandler

    constructor(props) {
        super(props)
        this.setState({
            filesList: []
        })
        this.fileDragAndDropHandler = new FileDragAndDropHandler(this.onFileDropped)
    }

    render() {
        return (<div className={styles.fileInputWrapper}>
            <FileInputList openFileSelector={this.openFileSelector} filesList={this.state.filesList} onFileRemoved={this.onFileRemoved}/>
            <div className={styles.addFileButtonDivider}/>
            <button className={styles.addFileButton} onClick={this.openFileSelector}>Add files</button>
            <input className={styles.fileInput}
                   ref={ref => this.fileInput = ref}
                   onChange={this.onFileInputChanged}
                   type="file" multiple/>
        </div>)
    }

    private openFileSelector = () => this.fileInput.click()

    private onFileInputChanged = () => {
        this.setState({
            filesList: this.state.filesList.concat(Array.from(this.fileInput.files))
        })

        this.props.pasteButton.disabled = this.state.filesList.length == 0;
    }

    private onFileDropped = (filesList: File[]) => {
        this.setState({
            filesList: this.state.filesList.concat(filesList)
        })

        this.props.pasteButton.disabled = this.state.filesList.length == 0;
    }

    private onFileRemoved = (index: number) => {
        this.setState(prevState => {
            prevState.filesList.splice(index, 1)
            return {
                prevState
            }
        })
    }
}
