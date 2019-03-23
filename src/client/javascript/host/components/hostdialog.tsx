import {Component, h} from "preact";

// @ts-ignore
import style from './index-dialog.module.css'
import {IDialog} from "./idialog";

export interface IHostDialogProps {
    roomId: string
    oncancel: () => void
}

export interface IHostDialogState {

}

export class HostDialog extends Component <IHostDialogProps, IHostDialogState> implements IDialog {

    constructor(props: IHostDialogProps) {
        super(props);
    }

    onbackgroundclicked = () => {

    };

    render() {
        return (
            <div className={style.dialog}>
                <h1 id={style.dialogcode} className={style.dialogcode}>{this.props.roomId}</h1>
                <p className={style.dialogdescription}>
                    Use this code to receive files <br/>
                    (must keep dialog open)
                </p>
                <div className={style.hostdialogcancel} onClick={this.props.oncancel}>CANCEL</div>
            </div>
        )
    }
}