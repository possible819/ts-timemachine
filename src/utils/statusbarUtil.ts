import { localStorageUtil } from './localStorageUtil'

declare global {
  interface Window {
    StatusBar: {
      overlaysWebView: (overlay: boolean) => void
      backgroundColorByHexString: (color: string) => void
    }
  }
}

export const statusbarUtil = {
  overlaysWebView(overlay: boolean): void {
    if ('StatusBar' in window) {
      window.StatusBar.overlaysWebView(overlay)
    } else {
      console.warn(
        `Couldn't find StatusBar from window object which is able to be found in mobile env.`
      )
    }
  },

  backgroundColorByHexString(color: string): void {
    window.StatusBar.backgroundColorByHexString(color)
  },
} as const
