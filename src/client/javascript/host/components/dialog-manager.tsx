import { h, render } from "preact";
import { JoinDialog } from "./join-dialog";
// @ts-ignore
import style from './index-dialog.module.css';
import { HostDialog } from "./host-dialog";
import { BaseDialog } from "./base-dialog";
import { DialogContainer } from "./dialog-container";

export class DialogManager {

  private container: DialogContainer;

  constructor() {
    render(<DialogContainer ref={container => this.container = container}/>,
      document.getElementById("dialog-manager"))
  }

  showJoinDialog = (joinRoomRequest: Function, onsuccess: (roomId: string) => void) => {
    this.showDialog(<JoinDialog
      joinRoomRequest={joinRoomRequest}
      onsuccess={onsuccess}
      oncancel={this.hideDialog}
      ref={(dialog: BaseDialog) => {
        if (dialog) {
          this.container.addOnBackgroundClickedListener(dialog.onBackgroundClicked)
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
    this.container.addOnBackgroundClickedListener(null);
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
