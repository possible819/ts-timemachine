export const selectorUtil = {
  byId<T>(id: string, src: Document | HTMLElement = document): T {
    const foundElement: T | null = src.querySelector(`#${id}`) as T | null
    if (!foundElement) throw new Error(`Failed to find element by id (${id})`)
    return foundElement
  },

  byTag<T>(tag: string, src: Document | HTMLElement = document): T {
    const foundElement: T | null = src.querySelector(`${tag}`) as T | null
    if (!foundElement) throw new Error(`Failed to find element by tag (${tag})`)
    return foundElement
  },
} as const
