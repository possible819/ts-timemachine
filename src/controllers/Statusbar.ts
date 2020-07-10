declare global {
  interface Window {
    Statusbar: {
      overlayWebview: (active: boolean) => void
      backgroundColorByHexString: (color: string) => void
    }
  }
}

export const StatusbarUtil = {
  overlayWebView(active: boolean): void {
    window.Statusbar.overlayWebview(active)
  },

  backgroundColorByHexString(color: string) {
    window.Statusbar.backgroundColorByHexString(color)
  },
} as const
