import { LocalStorageKeyTypes, EventTypes } from './enums'
import { localStorageUtil, deviceUtil } from './utils'
import { Themes, ThemeObj } from './constants'
import { ThemeUtil } from './utils/ThemeUtil'
import { StatusbarUtil } from './controllers/Statusbar'

export default class Timemachine {
  private theme: ThemeObj

  constructor() {
    this.theme = ThemeUtil.getThemeColorSet()
  }

  public initializeApplication(): void {
    this.adjustTheme()
  }

  private adjustTheme(): void {
    ThemeUtil.adjustTheme(this.theme)

    if (deviceUtil.isMobileDevice()) {
      StatusbarUtil.overlayWebView(false)
      StatusbarUtil.backgroundColorByHexString(
        this.theme.colors['--main-theme-color']
      )
    }
  }
}
