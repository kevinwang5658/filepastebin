import {Component, h, render} from "preact";
import {JoinDialog} from "./joindialog";
// @ts-ignore
import style from './index-dialog.module.css';
import * as preact from "preact";
import {HostDialog} from "./hostdialog";
import {IDialog} from "./idialog";

export class DialogManager {

    private container: DialogContainer;

    constructor() {
        render(<DialogContainer ref={ container => this.container = container}/>,
            document.getElementById("dialog-manager"))
    }

    showJoinDialog = (joinRoomRequest: Function, onsuccess: (roomId: string) => void) => {
        this.showDialog(<JoinDialog
            joinRoomRequest={joinRoomRequest}
            onsuccess={onsuccess}
            oncancel={this.hideDialog}
            ref={(dialog: IDialog) => {
                if (dialog) {
                    this.container.addBackgroundClickListener(dialog.onbackgroundclicked)
                }
            }}
        />);
    };

    showHostDialog = (roomId: string, oncancel: () => void) => {
        this.showDialog(<HostDialog
            roomId={roomId}
            oncancel={() => {
                oncancel();
                this.hideDialog()
            }}
        />);
    };

    private hideDialog = () => {
        this.container.addBackgroundClickListener(null);
        this.container.setState({
            dialog: null,
        })
    };

    private showDialog = (element: JSX.Element) => {
        this.container.setState({
            dialog: element,
        })
    };
}

interface IDialogContainerState {
    dialog: JSX.Element,
    onbackgroundclicked?: () => void
}

interface IDialogContainerProps {
    ref: any
}

class DialogContainer extends Component<IDialogContainerProps, IDialogContainerState> {

    private backgroundClickListener: () => void;

    constructor(public props: IDialogContainerProps) {
        super();

        this.state = {
            dialog: null
        };
    }

    addBackgroundClickListener(handler: () => void) {
        this.backgroundClickListener = handler;
    }

    render(): preact.ComponentChild {

        return (<div className={style.dialogcontainer}
                     style={{ display: this.state.dialog ? 'flex': 'none' }}
                     onClick={ () => {
                         if (this.backgroundClickListener) {
                             this.backgroundClickListener()
                         }
                     }}>
            {
                this.state.dialog
            }
        </div>)
    }
}
