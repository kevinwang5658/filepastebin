import { Fragment, h } from 'preact';
import { useEffect, useState } from 'preact/compat';
import { HostNetworkManager, HostProgressListener, HostProgressState } from '../../network/host-network-manager';
import style from './index-dialog.module.css';

interface HostDialogProgressBarProps {
  hostNetworkManager: HostNetworkManager;
}

export function HostDialogProgressBar(props: HostDialogProgressBarProps) {

  const [joinItemState, setJoinItemState] = useState(ItemState.IN_PROGRESS);
  const [connectItemState, setConnectItemState] = useState(ItemState.EMPTY);
  const [uploadItemState, setUploadItemState] = useState({
    itemState: ItemState.EMPTY,
    uploadProgress: 0,
  });

  useEffect(() => {
    console.log('hi');
    const progressListener: HostProgressListener = (state: HostProgressState, uploadProgress: number) => {
      console.log('state ' + state);
      if (state >= HostProgressState.FILES_SENDING) {
        setJoinItemState(ItemState.COMPLETE);
        setConnectItemState(ItemState.COMPLETE);
        setUploadItemState({ itemState: ItemState.IN_PROGRESS, uploadProgress: uploadProgress });
      } else if (state >= HostProgressState.SOCKET_IO_WAITING_FOR_JOIN) {
        setJoinItemState(ItemState.COMPLETE);
        setConnectItemState(ItemState.IN_PROGRESS);
        setUploadItemState({ itemState: ItemState.EMPTY, uploadProgress: 0 });
      } else {
        setJoinItemState(ItemState.IN_PROGRESS);
        setConnectItemState(ItemState.EMPTY);
        setUploadItemState({ itemState: ItemState.EMPTY, uploadProgress: 0 });
      }
    };

    props.hostNetworkManager.addProgressListener(progressListener);
    return () => props.hostNetworkManager.removeProgressListener(progressListener);
  }, []);

  return <div className={style.HostDialogProgressBarParent}>
    <CheckMarkProgressItem inProgressText="Joining" completedText="Joined" state={joinItemState}/>
    <CheckMarkProgressItem inProgressText="Connecting" completedText="Connected" state={connectItemState}/>
    <FileSendProgressItem state={uploadItemState}/>
  </div>;
}

function CheckMarkProgressItem(props) {
  const [periodAnimation, updatePeriodAnimation] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePeriodAnimation(getNextPeriodAnimation(periodAnimation));
    }, 500);
    return () => clearTimeout(timer);
  });

  const text = props.state <= ItemState.IN_PROGRESS ? props.inProgressText + periodAnimation : props.completedText;
  const icon = props.state <= ItemState.IN_PROGRESS ? <LoadingDots/>
    : <img className={style.HostDialogProgressBarCheckMark} src={window.origin + '/images/checkmark.png'}/>;

  return <div className={style.HostDialogProgressBarItem}>{
    props.state !== ItemState.EMPTY &&
    <Fragment>
      <p className={style.HostDialogProgressBarText}>{text}</p>
      {icon}
    </Fragment>
  }</div>;
}

function FileSendProgressItem(props) {
  const { itemState, uploadProgress } = props.state
  const [periodAnimation, updatePeriodAnimation] = useState('');

  console.log(uploadProgress);

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePeriodAnimation(getNextPeriodAnimation(periodAnimation));
    }, 500);
    return () => clearTimeout(timer);
  });
  const text = itemState <= ItemState.IN_PROGRESS ? 'Sending' + periodAnimation : 'Sent';

  return <div className={style.HostDialogProgressBarItem}>{
    itemState !== ItemState.EMPTY &&
    <Fragment>
      <p className={style.HostDialogProgressBarText}>{text}</p>
      <p>{uploadProgress}</p>
    </Fragment>
  }</div>;
}

function LoadingDots(props) {
  return <div className={style.LoadingBar}>
    <div className={style.LoadingBarDot}></div>
    <div className={style.LoadingBarDot}></div>
    <div className={style.LoadingBarDot}></div>
    <div className={style.LoadingBarDot}></div>
    <div className={style.LoadingBarDot}></div>
    <div className={style.LoadingBarDot}></div>
  </div>
}


//***********************
// Helper functions
//*********************

enum ItemState {
  EMPTY,
  IN_PROGRESS,
  COMPLETE
}

function getNextPeriodAnimation(curr: string): string {
  switch (curr) {
    case '':
    case '.':
    case '..':
      return curr + '.';
    default:
      return '';
  }
}