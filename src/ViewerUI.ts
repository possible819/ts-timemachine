import { DateUtil } from './DateUtil'
import { selectorUtil, themeUtil } from './utils'

type DateFieldType = HTMLSpanElement & {
  setDateFieldValue: (dateStr: string) => void
}

export class ViewerUI {
  public viewerHeader: HTMLDivElement
  public viewerContent: HTMLDivElement
  public dateField: DateFieldType
  public deleteBtn: HTMLObjectElement

  public currentDateUtil: DateUtil

  constructor(currentDateUtil: DateUtil) {
    this.viewerHeader = selectorUtil.byId<HTMLDivElement>('viewer-header')
    this.viewerContent = selectorUtil.byId<HTMLDivElement>('viewer-content')

    this.dateField = document.createElement('span') as DateFieldType
    this.dateField.setAttribute('id', 'viewer-date-field')
    this.dateField.setDateFieldValue = (dateStr: string) => {
      this.dateField.innerText = dateStr
    }

    this.deleteBtn = document.createElement('object')
    this.deleteBtn.setAttribute('id', 'viewer-delete-btn')
    this.deleteBtn.setAttribute('type', 'image/svg+xml')
    this.deleteBtn.setAttribute('data', './assets/images/x-btn.svg')

    this.deleteBtn.addEventListener('load', function () {
      const currentTheme = themeUtil.getThemeColorSet()
      if (this.contentDocument) {
        const xBtn: any = selectorUtil.byId<any>('x-btn', this.contentDocument)
        xBtn.style.fill = currentTheme.colors['--main-theme-color']
        const svg: any = selectorUtil.byTag<any>('svg', this.contentDocument)
        svg.addEventListener('touchend', () => {
          window.ha.openConfirm({
            title: '일기 삭제',
            type: CONST.NATIVE_STYLE.ALERT.ACTION,
            message: '일기를 삭제 하시겠습니까?',
            options: [
              {
                name: '취소',
                type: CONST.NATIVE_STYLE.BTN.CANCEL,
              },
              {
                name: '삭제',
                type: CONST.NATIVE_STYLE.BTN.DESTRUCTIVE,
                callback: () => {
                  document.dispatchEvent(
                    new CustomEvent('delete-diary', {
                      detail: {
                        fileName: `${window.currentDateUtil.getDateFileNameFormat()}.txt`,
                      },
                    })
                  )
                },
              },
            ],
          })
        })
      }
    })

    this.currentDateUtil = currentDateUtil
  }

  /**
   * @description date 객체를 전달 받아 viewer ui를 구성함
   */

  public renderViewer(): void {
    this.showDateField(false)
    this.showEmptyViewer()
  }

  public showDateField(showDeleteBtn: boolean): void {
    this.clearViewerHeader()
    this.dateField.setDateFieldValue(this.currentDateUtil.getFullDateStr())
    this.viewerHeader.appendChild(this.dateField)
    if (showDeleteBtn) {
      const deleteBtn = this.getDeleteBtn()
      this.viewerHeader.appendChild(deleteBtn)
    }
  }

  public clearViewerHeader(): void {
    while (this.viewerHeader.firstChild) {
      this.viewerHeader.removeChild(this.viewerHeader.firstChild)
    }
  }

  showEmptyViewer() {
    this.clearViewerContent()
    this.showDateField(false)
    this.viewerContent.appendChild(this.getEmptyViewer())
  }

  showContentViewer(content) {
    this.clearViewerContent()
    this.showDateField(true)
    this.viewerContent.appendChild(this.getContentViewer(content))
  }

  clearViewerContent() {
    while (this.viewerContent.children.length) {
      this.viewerContent.removeChild(this.viewerContent.firstChild)
    }
  }

  getEmptyViewer() {
    if (!this.emptyViewer) {
      this.emptyViewer = document.createElement('img')
      this.emptyViewer.setAttribute('id', 'empty-viewer')
      this.emptyViewer.setAttribute('src', './assets/images/gray-plus.svg')
      this.emptyViewer.addEventListener('click', () => {
        document.dispatchEvent(
          new CustomEvent('show-empty-editor', {
            detail: {
              fileName: event.currentTarget.getAttribute('file-name'),
            },
          })
        )
      })
    }

    this.currentDiaryDate = window.currentDateUtil.getFullDateStr()
    this.emptyViewer.setAttribute(
      'file-name',
      `${window.currentDateUtil.getDateFileNameFormat()}.txt`
    )
    return this.emptyViewer
  }

  getContentViewer(content) {
    if (!this.contentViewer) {
      this.contentViewer = document.createElement('div')
      this.contentViewer.setAttribute('id', 'content-viewer')
      this.contentViewer.addEventListener('click', () => {
        document.dispatchEvent(
          new CustomEvent('show-content-editor', {
            detail: {
              fileName: event.currentTarget.getAttribute('file-name'),
            },
          })
        )
      })
    }

    this.currentDiaryDate = window.currentDateUtil.getFullDateStr()
    this.contentViewer.setAttribute(
      'file-name',
      `${window.currentDateUtil.getDateFileNameFormat()}.txt`
    )
    this.contentViewer.innerText = content
    return this.contentViewer
  }

  getYearMonth() {
    const dateArray = this.currentDiaryDate.split(' ')
    const year = dateArray[0]
    const month = dateArray[1]

    return `${year.substr(0, year.length - 1)}${month.substr(
      0,
      month.length - 1
    )}`
  }

  getFileName() {
    const dateArray = this.currentDiaryDate.split(' ')
    dateArray.pop()
    const fileName =
      dateArray
        .map((date) => {
          return date.substr(0, date.length - 1)
        })
        .join('-') + '.txt'

    return fileName
  }
}
