export const localStorageUtil = {
  getItem(key: string, defaultValue: any): any {
    const value: any = window.localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    } else {
      return defaultValue || null
    }
  },
} as const
