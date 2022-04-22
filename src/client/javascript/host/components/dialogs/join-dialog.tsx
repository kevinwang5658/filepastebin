import { Component, h } from "preact";
import { BaseDialog } from "./base-dialog";
import style from "./index-dialog.module.css";

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

export class JoinDialog extends Component<JoinDialogProps, JoinDialogState> implements BaseDialog {

  private input: HTMLInputElement;

  constructor(props: JoinDialogProps) {
    super(props);

    this.setState({
      borderColor: BORDER_COLOR_NORMAL,
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        this.props.oncancel();
      }
    });
  }

  componentDidMount(): void {
    this.input.focus();
  }

  oninput = (currentTarget: any) => {
    this.setState({
      value: currentTarget.target.value,
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
        borderColor: BORDER_COLOR_WRONG,
      });

      return;
    }


    this.props.joinRoomRequest(value)
      .then((response: any) => {
        if (response) {
          this.props.onsuccess(response);
        } else {
          this.setState({
            borderColor: BORDER_COLOR_WRONG,
          });
        }
      });
  };

  onBackgroundClicked = () => {
    this.props.oncancel();
  };

  render(): preact.ComponentChild {
    return (
      <div className={style.Dialog}
           onClick={(e: Event) => {
             e.stopPropagation();
           }}>
        <p className={style.Roomtitle} id="roomtitle">
          Enter the 6 digit room code:
        </p>
        <input className={style.Roominput}
               id="roominput"
               style={{ borderColor: this.state.borderColor, outline: 'none' }}
               type="tel"
               pattern="\d*"
               maxLength={6}
               onInput={this.oninput}
               onKeyPress={this.onkeypressed}
               value={this.state.value}
               ref={(input) => this.input = input}/>
        <div style={"height: 96px;"}/>
        <div className={style.Dialogbuttonwrapper} id="dialogbuttonwrapper">
          <div className={style.Dialogjoin}
               id="dialogjoin"
               onClick={() => this.onjoinclicked()}>JOIN
          </div>
          <div className={style.Joindialogcancel}
               id="dialogcancel"
               onClick={this.props.oncancel}>CANCEL
          </div>
        </div>
      </div>
    );
  }
}
