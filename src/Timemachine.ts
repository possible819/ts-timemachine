import { LocalStorage } from './constants/LocalStorage'
import { localStorageUtil } from './utils/localStorageUtil'
import { Themes, ThemeObj } from './constants'
import { statusbarUtil, WebDBUtil } from './utils'

export default class Timemachine {
  private webDBUtil: WebDBUtil

  constructor() {
    this.webDBUtil = new WebDBUtil()
  }

  public initializeApplication(): void {
    this.adjustTheme()
    this.webDBUtil.initialize()
  }

  private adjustTheme(): void {
    const currentTheme: string = localStorageUtil.getItem(
      LocalStorage.THEME,
      'basic'
    )
    const themeObj: ThemeObj = Themes.find(
      (theme: ThemeObj) => theme.name === currentTheme
    ) as ThemeObj

    for (let key in themeObj.colors) {
      document.body.style.setProperty(key, themeObj.colors[key] as any)
    }

    statusbarUtil.overlaysWebView(false)
    statusbarUtil.backgroundColorByHexString(
      themeObj.colors['--main-theme-color']
    )

    document.dispatchEvent(new CustomEvent('theme-adjusted'))
  }
}
