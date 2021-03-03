import {Component, h} from "preact";

// @ts-ignore
import style from './index-dialog.module.css'
import {BaseDialog} from "./baseDialog";

export interface HostDialogProps {
    roomId: string
    oncancel: () => void
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
            <div className={style.dialog}>
                <h1 id="dialogcode" className={style.dialogcode}>{this.props.roomId}</h1>
                <p className={style.dialogdescription}>
                    Use this code to receive files <br/>
                    (must keep dialog open)
                </p>
                <div className={style.hostdialogcancel} onClick={this.props.oncancel}>CANCEL</div>
            </div>
        )
    }
}
