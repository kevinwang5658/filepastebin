export class FileDragAndDropHandler {
  private container = <HTMLDivElement>document.getElementById('container');

  constructor(public listener: (file: File[]) => void) {
    this.container.addEventListener('dragenter', this.dragEnterHandler);
    this.container.addEventListener('dragover', this.dragHandler);
    this.container.addEventListener('dragleave', this.dragLeaveHandler);
    this.container.addEventListener('drop', this.dropHandler);
  }

  private dragEnterHandler = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    this.container.style.background = '#F4F4F4';
  };

  private dragHandler = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    this.container.style.background = '#F4F4F4';
  };

  private dragLeaveHandler = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    this.container.style.background = '#FFFFFF';
  };

  private dropHandler = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    this.container.style.background = '#FFFFFF';

    if (ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files.length !== 0) {
      this.listener(Array.from(ev.dataTransfer.files));
    }
  };
}
