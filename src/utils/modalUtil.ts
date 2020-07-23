export class ModalUtil {
  private modal: HTMLDivElement
  private contentContainer: HTMLDivElement

  constructor() {
    this.modal = document.createElement('div')
    this.modal.style.display = 'none'
    this.modal.style.position = 'absolute'
    this.modal.style.zIndex = '99'
    this.modal.style.left = '0'
    this.modal.style.top = '0'
    this.modal.style.right = '0'
    this.modal.style.bottom = '0'
    this.modal.style.backgroundColor = 'rgba(0,0,0,0.5)'
    this.modal.classList.add('modal')
    this.modal.setAttribute('active', 'false')

    this.contentContainer = document.createElement('div')
    this.contentContainer.style.margin = 'auto'
    this.contentContainer.style.display = 'flex'
    this.contentContainer.style.flexDirection = 'column'
    this.modal.appendChild(this.contentContainer)
    document.body.appendChild(this.modal)
  }

  public show(thumbnailPath: string, label: string): void {
    if (thumbnailPath) {
      this.setThumbnail(thumbnailPath)
    }

    if (label) {
      this.setLabel(label)
    }
    this.modal.style.display = 'flex'
    this.modal.setAttribute('active', 'true')
  }

  public hide(): void {
    this.modal.style.display = 'none'
    this.modal.setAttribute('active', 'false')
  }

  public setThumbnail(thumnailPath: string | HTMLImageElement): void {
    if (typeof thumnailPath === 'string') {
      const src = thumnailPath
      thumnailPath = new Image(100, 100)
      thumnailPath.src = src
    }

    thumnailPath.classList.add('modal-thumbnail')
    this.contentContainer.appendChild(thumnailPath)
  }

  public setLabel(label: string | HTMLSpanElement): void {
    if (typeof label === 'string') {
      const labelText = label
      label = document.createElement('span')
      label.innerHTML = labelText
      label.classList.add('modal-label')
      label.style.color = 'white'
      label.style.margin = 'auto'
      label.style.paddingTop = '1vh'
    }

    label.classList.add('modal-label')
    this.contentContainer.appendChild(label)
  }
}
