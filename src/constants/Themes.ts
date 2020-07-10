export const Themes: ThemeObj[] = [
  {
    name: 'basic',
    description: '기본',
    colors: {
      '--main-theme-color': '#BF004D',
      '--main-theme-light': '#DE463C',
      '--main-theme-dark': '#990440',
      '--main-theme-deep-dark': '#560022',
    },
  },
  {
    name: 'dark',
    description: '어두운',
    colors: {
      '--main-theme-color': '#242524',
      '--main-theme-light': '#4C4E4E',
      '--main-theme-dark': '#1D1E1E',
      '--main-theme-deep-dark': '#000000',
    },
  },
  {
    name: 'line',
    description: 'LINE',
    colors: {
      '--main-theme-color': '#00B900',
      '--main-theme-light': '#00F900',
      '--main-theme-dark': '#009900',
      '--main-theme-deep-dark': '#006900',
    },
  },
]

export type ThemeObj = {
  name: string
  description: string
  colors: ThemeColorSet
}

export type ThemeColorSet = {
  ['--main-theme-color']: string
  ['--main-theme-light']: string
  ['--main-theme-dark']: string
  ['--main-theme-deep-dark']: string
}
