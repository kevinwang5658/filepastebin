import {Component, h} from "preact";
// @ts-ignore
import style from "./index-dialog.module.css";
import {BaseDialog} from "./baseDialog";

export interface JoinDialogProps {
    joinRoomRequest: Function,
    onsuccess: (roomId: string) => void,
    oncancel: () => void
}

export interface JoinDialogState {
    value: string,
    borderColor: string
}

const BORDER_COLOR_NORMAL = "#9B9B9B";
const BORDER_COLOR_WRONG = "#D0021B";

export class JoinDialog extends Component<JoinDialogProps, JoinDialogState> implements BaseDialog{

    private input: HTMLInputElement;

    constructor(props: JoinDialogProps) {
        super(props);

        this.setState({
            borderColor: BORDER_COLOR_NORMAL
        });

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.keyCode === 27) {
                this.props.oncancel();
            }
        });
    }

    componentDidMount(): void {
        this.input.focus()
    }

    oninput = (event: KeyboardEvent) => {
        let target = event.target as HTMLInputElement;

        this.setState({
            value: target.value
        });
    };

    onkeypressed = (event: KeyboardEvent) => {
        if (event.keyCode === 13) {
            this.onjoinclicked();
        }
    };

    onjoinclicked = () => {
        let value = this.state.value;
        if (value.length < 6) {
            this.setState({
                borderColor: BORDER_COLOR_WRONG
            });

            return;
        }


        this.props.joinRoomRequest(value)
            .then((response: any) => {
                if (response) {
                    this.props.onsuccess(response.roomId);
                } else {
                    this.setState({
                        borderColor: BORDER_COLOR_WRONG
                    });
                }
            })
    };

    onBackgroundClicked = () => {
        this.props.oncancel()
    };

    render(): preact.ComponentChild {
        return (
            <div className={style.dialog}
                 onClick={(e: Event) => { e.stopPropagation()}}>
                <p className={style.roomtitle} id="roomtitle">
                    Enter the 6 digit room code:
                </p>
                <input className={style.roominput}
                       id="roominput"
                       style={{borderColor: this.state.borderColor, outline: 'none'}}
                       type="tel"
                       pattern="\d*"
                       maxLength={6}
                       onInput={this.oninput}
                       onKeyPress={this.onkeypressed}
                       value={this.state.value}
                       ref={ (input) => this.input = input } />
                <div className={style.dialogbuttonwrapper} id="dialogbuttonwrapper">
                    <div className={style.dialogjoin}
                         id="dialogjoin"
                         onClick={ () => this.onjoinclicked() }>JOIN</div>
                    <div className={style.joindialogcancel}
                         id="dialogcancel"
                         onClick={ this.props.oncancel }>CANCEL</div>
                </div>
            </div>
        )
    }
}
