export const localStorageUtil = {
  getItem(key: string, defaultValue: any = ''): any {
    return localStorage.getItem(key) || defaultValue
  },

  setItem(key: string, value: any) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value)
    }

    localStorage.setItem(key, value)
  },
} as const
