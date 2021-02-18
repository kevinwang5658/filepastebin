import {Component, h, render} from "preact";
// @ts-ignore
import styles from './file-input.module.css'
import {FileInputList} from "./fileInputList";

export type FileInputBaseProps = {
    pasteButton: HTMLButtonElement,
}

export type FileInputBaseState = {
    filesList: File[]
}

export class FileInputBase extends Component<FileInputBaseProps, FileInputBaseState>{
    private fileInput;

    constructor(props) {
        super(props)
        this.setState({
            filesList: []
        })
    }

    render() {
        return (<div className={styles.fileInputWrapper}>
            <FileInputList openFileSelector={this.openFileSelector} filesList={this.state.filesList}/>
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
}
