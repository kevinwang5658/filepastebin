import {Component, h, render} from "preact";
// @ts-ignore
import styles from './file-input.module.css'
import {FileInputList} from "./fileInputList";

export function renderFileInput() {
    render(
        <FileInputBase />, document.getElementById("file-input")
    );
}

export type FileInputBaseState = {
    fileList: File[]
}

export class FileInputBase extends Component<any, FileInputBaseState>{

    private fileInput;

    constructor(props) {
        super(props)
        this.setState({
            fileList: []
        })
    }

    render() {
        return (<div className={styles.fileInputWrapper}>
            <FileInputList openFileSelector={this.openFileSelector} filesList={this.state.fileList}/>
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
            fileList: Array.from(this.fileInput.files)
        })
    }
}
