import { Component, h } from "preact";
import * as preact from "preact";
// @ts-ignore
import style from "./index-dialog.module.css";

interface DialogContainerState {
  dialog: JSX.Element,
  onBackgroundClicked?: () => void
}

interface DialogContainerProps {
  ref: any
}

export class DialogContainer extends Component<DialogContainerProps, DialogContainerState> {

  private backgroundClickedListener: () => void;

  constructor(public props: DialogContainerProps) {
    super();

    this.state = {
      dialog: null
    };
  }

  addOnBackgroundClickedListener(handler: () => void) {
    this.backgroundClickedListener = handler;
  }

  render(): preact.ComponentChild {
    return (<div className={style.Dialogcontainer}
                 style={{ display: this.state.dialog ? 'flex' : 'none' }}
                 onClick={() => {
                   if (this.backgroundClickedListener) {
                     this.backgroundClickedListener()
                   }
                 }}>
      {
        this.state.dialog
      }</div>)
  }
}
