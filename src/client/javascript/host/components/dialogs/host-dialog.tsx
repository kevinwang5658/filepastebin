import { Component, createRef, h } from "preact";
import * as clipboard from "clipboard-polyfill/text";
import * as QRCode from 'qrcode';
import { HostNetworkManager, HostProgressState } from '../../network/host-network-manager';
import { BaseDialog } from "./base-dialog";
import { HostDialogProgressBar } from './hostDialogProgressBar';
import style from './index-dialog.module.css';

export interface HostDialogProps {
  roomCode: string;
  roomId: string;
  hostNetworkManager: HostNetworkManager,
  oncancel: () => void;
}

export interface HostDialogState {}

export class HostDialog extends Component <HostDialogProps, HostDialogState> implements BaseDialog {

  private dialogCode = null;
  private qrCanvasRef = createRef<HTMLCanvasElement>();

  constructor(props: HostDialogProps) {
    super(props);
  }

  componentDidMount() {
    if (this.qrCanvasRef.current) {
      QRCode.toCanvas(this.qrCanvasRef.current, `${window.location.origin}/${this.props.roomId}`, {
        width: 160,
        margin: 2,
      });
    }
  }

  onBackgroundClicked = () => {};

  onCodeClicked = async () => {
    selectTextInDiv(this.dialogCode);
    clipboard.writeText(this.props.roomCode);
  }

  onCancelClicked = () => {
    const state = this.props.hostNetworkManager.state;
    const safeToClose = state === HostProgressState.SOCKET_IO_WAITING_FOR_JOIN
      || state === HostProgressState.FILES_SENT
      || state === HostProgressState.FILES_DOWNLOADED;
    if (!safeToClose) {
      if (confirm('Warning: The files are currently being sent, do you want to cancel?')) {
        this.props.oncancel();
      }
    } else {
      this.props.oncancel();
    }
  };

  private setRef = (node) => {
    this.dialogCode = node;
  }

  render() {
    return (
      <div className={style.Dialog}>
        <div style={ 'height: 24px' }/>
        <div className={style.DialogCodeWrapper} onClick={this.onCodeClicked}>
          <h1 id="dialogcode" className={style.DialogCode} ref={this.setRef}>{this.props.roomCode}</h1>
          <img className={style.DialogCodeCopyIcon} src={window.origin + '/images/copy.png'}/>
        </div>
        <canvas ref={this.qrCanvasRef} style={{ display: 'block', margin: '8px auto 0' }}/>
        <p className={style.DialogDescription}>
          Use this code to receive files <br/>
          (must keep dialog open)
        </p>
        <HostDialogProgressBar hostNetworkManager={this.props.hostNetworkManager}/>
        <div className={style.HostDialogCancel} onClick={this.onCancelClicked}>CANCEL</div>
      </div>
    );
  }
}

function selectTextInDiv(node) {
  let text = node.childNodes[0];
  let range = new Range();
  let selection = document.getSelection();
  range.setStart(text, 0);
  range.setEnd(text, text.length);
  selection.removeAllRanges();
  selection.addRange(range);
}
