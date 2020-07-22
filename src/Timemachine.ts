import { ThemeObj } from './constants'
import { WebDatabase } from './controllers/WebDatabase'
import { DateUtil } from './DateUtil'
import { HeaderUI } from './HeaderUI'
import { deviceUtil, themeUtil } from './utils'
import { ViewerUI } from './ViewerUI'

export default class Timemachine {
  private theme: ThemeObj
  private webDatabase: WebDatabase
  private headerUI: HeaderUI
  private viewerUI: ViewerUI

  public stdDateUtil: DateUtil
  public currentDateUtil: DateUtil

  constructor() {
    this.stdDateUtil = new DateUtil()
    this.currentDateUtil = new DateUtil()

    this.theme = themeUtil.getThemeColorSet()
    this.webDatabase = new WebDatabase()
    this.headerUI = new HeaderUI(this.stdDateUtil, this.currentDateUtil)
    this.viewerUI = new ViewerUI(this.currentDateUtil)
  }

  public initializeApplication(): void {
    this.adjustTheme()
    // this.registerEventListeners()
    this.headerUI.showCommonHeader()
  }

  private adjustTheme(): void {
    themeUtil.adjustTheme(this.theme)

    if (deviceUtil.isMobileDevice()) {
      StatusbarUtil.overlayWebView(false)
      StatusbarUtil.backgroundColorByHexString(
        this.theme.colors['--main-theme-color']
      )
    }
  }
}
