import { Component, h } from "preact";
import { fetchRoomIdFromCode } from '../../join-room-request';
import { HostNetworkManager, HostProgressState } from '../../network/host-network-manager';
import { BaseDialog } from "./base-dialog";
import { HostDialogProgressBar } from './hostDialogProgressBar';
import style from './index-dialog.module.css';

export interface HostDialogProps {
  roomCode: string;
  hostNetworkManager: HostNetworkManager,
  oncancel: () => void;
}

export interface HostDialogState {

}

export class HostDialog extends Component <HostDialogProps, HostDialogState> implements BaseDialog {

  private dialogCode = null;

  constructor(props: HostDialogProps) {
    super(props);
  }

  onBackgroundClicked = () => {};

  onCodeClicked = async () => {
    const roomId = await fetchRoomIdFromCode(this.props.roomCode);
    selectTextInDiv(this.dialogCode)
    navigator.clipboard.writeText(`${window.origin}/${roomId}`);
  }

  onCancelClicked = () => {
    const state = this.props.hostNetworkManager.state
    if (state !== HostProgressState.FILES_SENT && state !== HostProgressState.SOCKET_IO_WAITING_FOR_JOIN) {
      if (confirm('Warning: The files are currently being sent, do you want to cancel?')) {
        this.props.oncancel();
      }
    }
     else {
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
