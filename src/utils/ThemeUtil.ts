import { localStorageUtil } from './localStorageUtil'
import { LocalStorageKeyTypes, EventTypes } from '../enums'
import { Themes, ThemeObj } from '../constants'

export const themeUtil = {
  /**
   * @description It will return current theme if there's no passed themeName
   * If passed themeName is exists but it's not proper name of themes, it will return
   * default theme (very first item of Thems constants) color set.
   *
   * @param {String} themeName
   * @returns {ThemeObj} theme color set
   */
  getThemeColorSet(themeName?: string): ThemeObj {
    if (!themeName) localStorageUtil.getItem(LocalStorageKeyTypes.Theme)
    return Themes.find((t) => t.name === themeName) || Themes[0]
  },

  /**
   * @description Adjust application theme property inbody tag
   * @param {ThemeObj} themeObj
   */
  adjustTheme(themeObj: ThemeObj): void {
    for (const key in themeObj.colors) {
      document.body.style.setProperty(
        key,
        themeObj.colors[<keyof typeof themeObj.colors>key]
      )
    }

    document.dispatchEvent(new CustomEvent(EventTypes.ThemeAdjusted))
  },
}
