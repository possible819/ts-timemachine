import { DateUtil } from './DateUtil'
import { selectorUtil } from './utils'

type MonthDisplayType = HTMLSpanElement & { tapCount: number }

export class HeaderUI {
  public header: HTMLElement
  public headerLeft: HTMLElement
  public headerCenter: HTMLElement
  public headerRight: HTMLElement
  public hiddenDatepicker: HTMLInputElement
  public searchInput: HTMLInputElement
  public searchCloseBtn: HTMLImageElement
  public routeBackBtn: HTMLImageElement
  public fullDateDisplay: HTMLSpanElement
  public searchBtn: HTMLImageElement
  public monthDisplay: MonthDisplayType
  public menuBtn: HTMLImageElement

  public stdDateUtil: DateUtil
  public currentDateUtil: DateUtil

  constructor(stdDateUtil: DateUtil, currentDateUtil: DateUtil) {
    this.header = selectorUtil.byId<HTMLDivElement>('header')
    this.headerLeft = selectorUtil.byId<HTMLDivElement>(
      'header-left',
      this.header
    )
    this.headerCenter = selectorUtil.byId<HTMLDivElement>(
      'header-center',
      this.header
    )
    this.headerRight = selectorUtil.byId<HTMLDivElement>(
      'header-right',
      this.header
    )
    this.hiddenDatepicker = selectorUtil.byId<HTMLInputElement>(
      'hidden-datepicker'
    )

    this.searchInput = document.createElement('input')
    this.searchInput.setAttribute('id', 'search-input')
    this.searchInput.setAttribute('type', 'search')
    this.searchInput.addEventListener('input', () => {
      document.dispatchEvent(new CustomEvent('search-keyword-changed'))
    })

    this.searchCloseBtn = document.createElement('img')
    this.searchCloseBtn.setAttribute('id', 'search-close-btn')
    this.searchCloseBtn.setAttribute('src', './assets/images/white-x.svg')
    this.searchCloseBtn.addEventListener('click', () => {
      this.showCommonHeader()
      this.searchInput.value = ''
      if (location.hash.indexOf('search') >= 0) {
        history.back()
      }
    })

    this.routeBackBtn = document.createElement('img')
    this.routeBackBtn.setAttribute('id', 'route-back-btn')
    this.routeBackBtn.setAttribute('src', './assets/images/back-icon.svg')
    this.routeBackBtn.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('route-back'))
    })

    this.fullDateDisplay = document.createElement('span')
    this.fullDateDisplay.setAttribute('id', 'full-date-display')

    this.searchBtn = document.createElement('img')
    this.searchBtn.setAttribute('id', 'search-btn')
    this.searchBtn.setAttribute('src', './assets/images/search.svg')
    this.searchBtn.addEventListener('click', () => {
      this.showSearchHeader()
    })

    this.monthDisplay = document.createElement('span') as HTMLSpanElement & {
      tapCount: number
    }
    this.monthDisplay.setAttribute('id', 'month-display')

    this.monthDisplay.addEventListener('touchstart', () => {
      this.monthDisplay.tapCount = this.monthDisplay.tapCount
        ? this.monthDisplay.tapCount + 1
        : 1
      setTimeout(() => {
        if (this.monthDisplay.tapCount === 2) {
          const date = new Date() // double tap event handler
          const year = date.getFullYear()
          const month =
            date.getMonth() <= 9
              ? `0${date.getMonth() + 1}`
              : date.getMonth() + 1
          this.hiddenDatepicker.value = `${year}-${month}`
          this.hiddenDatepicker.dispatchEvent(new InputEvent('change'))
        } else if (this.monthDisplay.tapCount === 1) {
          this.hiddenDatepicker.focus() // single tap event handler
        }
        this.monthDisplay.tapCount = 0
      }, 200)
    })

    this.menuBtn = document.createElement('img')
    this.menuBtn.setAttribute('id', 'menu-btn')
    this.menuBtn.setAttribute('src', './assets/images/menu.svg')
    this.menuBtn.addEventListener('click', () => {
      location.hash = 'setting'
    })

    this.stdDateUtil = stdDateUtil
    this.currentDateUtil = currentDateUtil
    this.hiddenDatepicker.addEventListener('change', this.onHiddenPickerChange)
  }

  /**
   * @description 헤더의 엘리먼트를 Object 형태로 전달 받아 append
   * @param {Object} elements
   */
  public appendContent(elements: {
    left?: HTMLElement
    center?: HTMLElement
    right?: HTMLElement
  }): void {
    if (elements.left) {
      this.appendLeftElement(elements.left)
    } else {
      this.clearLeftElement()
    }

    if (elements.center) {
      this.appendCenterElement(elements.center)
    } else {
      this.clearCenterElement()
    }

    if (elements.right) {
      this.appendRightElement(elements.right)
    } else {
      this.clearRightElement()
    }
  }

  /**
   * @description 헤더 왼쪽 섹션의 엘리먼트를 제거
   */
  public clearLeftElement(): void {
    while (this.headerLeft.firstChild) {
      this.headerLeft.removeChild(this.headerLeft.firstChild)
    }
  }

  /**
   * @description 헤더 중앙 섹션의 엘리먼트를 제거
   */
  public clearCenterElement(): void {
    while (this.headerCenter.firstChild) {
      this.headerCenter.removeChild(this.headerCenter.firstChild)
    }
  }

  /**
   * @description 헤더 오른쪽 섹션의 엘리먼트를 제거
   */
  public clearRightElement(): void {
    while (this.headerRight.firstChild) {
      this.headerRight.removeChild(this.headerRight.firstChild)
    }
  }

  /**
   * @description 헤더 왼쪽의 엘리먼트를 제거 후 append
   * @param {Object} element append할 Element
   */
  public appendLeftElement(element: HTMLElement): void {
    this.clearLeftElement()
    this.headerLeft.appendChild(element)
  }

  /**
   * @description 헤더 중앙의 엘리먼트를 제거 후 append
   * @param {Object} element append할 Element
   */
  public appendCenterElement(element: HTMLElement): void {
    this.clearCenterElement()
    this.headerCenter.appendChild(element)
  }

  /**
   * @description 헤더 오른쪽의 엘리먼트를 제거 후 append
   * @param {Object} element append할 Element
   */

  public appendRightElement(element: HTMLElement): void {
    this.clearRightElement()
    this.headerRight.appendChild(element)
  }

  /**
   * @description DateUtil 객체를 전달 받아 캘린더 화면의 기본 구성을 헤더에 표현함
   */
  public showCommonHeader(): void {
    this.showSearchBtn()
    this.showMonthDisplay()
    this.showMenuBtn()
  }

  public showEditorHeader(): void {
    this.showRouteBackBtn()
    this.showCenterFullDate()
    // this.showWeatherIcon();
    this.clearRightElement()
  }

  public showSearchHeader(): void {
    this.showSearchBtn()
    this.showSearchCloseBtn()
    this.showSearchInput()
  }

  /**
   * @description 헤더 왼쪽 섹션에 조회 버튼을 표시함
   */
  public showSearchBtn(): void {
    this.appendLeftElement(this.searchBtn)
  }

  /**
   * @description 헤더 중앙 섹션에 날짜를 표시함
   */
  public showMonthDisplay(): void {
    this.appendCenterElement(this.getMonthDisplay())
  }

  /**
   * @description 헤더 오른쪽 섹션에 메뉴 버튼을 표시함
   */
  public showMenuBtn(): void {
    this.appendRightElement(this.menuBtn)
  }

  /**
   * @description 헤더 중앙 섹선에 조회 input 필드를 표시하고 포커스를 이동함
   */
  public showSearchInput(): void {
    this.appendCenterElement(this.searchInput)
    this.searchInput.focus()
  }

  /**
   * @description 헤더 왼쪽 섹선에 조회 닫기 버튼을 표시함
   */
  public showSearchCloseBtn(): void {
    this.appendRightElement(this.searchCloseBtn)
  }

  /**
   * @description 헤더 왼쪽 섹션에 뒤로가기 버튼을 표시함
   */
  public showRouteBackBtn(): void {
    this.appendLeftElement(this.routeBackBtn)
  }

  public showCenterFullDate(): void {
    this.appendCenterElement(this.getFullDateDisplay())
  }

  /**
   * @description 날짜 표시 엘리먼트를 리턴함
   * @returns {Object} 날짜 표시 엘리먼트
   */
  public getMonthDisplay(): MonthDisplayType {
    this.monthDisplay.innerText = this.stdDateUtil.getYearMonthStr()
    return this.monthDisplay
  }

  public getFullDateDisplay(): HTMLSpanElement {
    this.fullDateDisplay.innerText = this.currentDateUtil.getFullDateStr()
    return this.fullDateDisplay
  }

  public showHeader(): void {
    this.header.style.display = 'grid'
  }

  public hideHeader(): void {
    this.header.style.display = 'none'
  }

  private onHiddenPickerChange(): void {
    let currentValue: string = this.hiddenDatepicker.value
    if (!currentValue) {
      const date: Date = new Date()
      const year: number = date.getFullYear()
      const month: string =
        date.getMonth() <= 9
          ? `0${date.getMonth() + 1}`
          : `${date.getMonth() + 1}`

      currentValue = `${year}-${month}`
      setTimeout(() => {
        this.hiddenDatepicker.value = currentValue
        this.hiddenDatepicker.blur()
      }, 100)
    }

    let [year, month]: string[] = currentValue.match(/\d+/g) as RegExpMatchArray
    if (
      Number(year) !== parseInt(this.stdDateUtil.getYearStr()) ||
      Number(month) !== parseInt(this.stdDateUtil.getMonthStr())
    ) {
      this.stdDateUtil.setYearMonth(Number(year), Number(month))
      document.dispatchEvent(new CustomEvent('date-picked'))
    }
  }
}
