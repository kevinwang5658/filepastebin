import { Component, h } from "preact";
import { BaseDialog } from "./base-dialog";

// @ts-ignore
import style from './index-dialog.module.css';

export interface HostDialogProps {
  roomCode: string;
  oncancel: () => void;
}

export interface HostDialogState {

}

export class HostDialog extends Component <HostDialogProps, HostDialogState> implements BaseDialog {
  constructor(props: HostDialogProps) {
    super(props);
  }

  onBackgroundClicked = () => {

  };

  render() {
    return (
      <div className={style.Dialog}>
        <h1 id="dialogcode" className={style.Dialogcode}>{this.props.roomCode}</h1>
        <p className={style.Dialogdescription}>
          Use this code to receive files <br/>
          (must keep dialog open)
        </p>
        <div className={style.Hostdialogcancel} onClick={this.props.oncancel}>CANCEL</div>
      </div>
    );
  }
}
