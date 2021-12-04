import { Component, h } from "preact";
// @ts-ignore
import styles from "./file-input.module.css";

export type FileItemProps = {
  fileName: string
  index: number
  onFileRemoved: (index: number) => void
}

export type FileItemState = {
  isHovering: boolean
}

export class FileItem extends Component<FileItemProps, FileItemState> {

  constructor(props) {
    super(props);
    this.setState({ isHovering: false })
  }

  private onHover = () => this.setState({ isHovering: true })

  private onHoverLeave = () => this.setState({ isHovering: false })

  render() {
    return (
      <div className={styles.fileNameWrapper}
           onMouseEnter={this.onHover}
           onMouseLeave={this.onHoverLeave}>
        <p className={styles.fileName}>{this.props.fileName}</p>
        {this.state.isHovering &&
        <input type="image" className={styles.deleteFileButton}
               src={window.origin + '/images/close_icon.png'}
               onClick={() => this.props.onFileRemoved(this.props.index)}/>
        }
      </div>
    )
  }
}
