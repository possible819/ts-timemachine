export class PageUtil {
  private entryPoint: string = ''
  private pages: HTMLElement[] = []
  private previousPage: string = ''
  private currentPage: string = ''

  public initialSetup(entryPoint: string, pages: HTMLElement[]): void {
    this.entryPoint = entryPoint
    this.pages = pages
    this.hideAllViews()
    window.addEventListener('hashchange', this.showCurrentPage.bind(this))
    location.hash = this.entryPoint
    this.showCurrentPage()
  }

  public hideAllViews(): void {
    this.pages.forEach((page) => {
      page.style.display = 'none'
    })
  }

  public showCurrentPage(event?: HashChangeEvent): void {
    if (event) {
      this.previousPage = event.oldURL
        .replace(location.origin, '')
        .replace(location.pathname, '')
        .replace('#', '')
    }
    this.currentPage = location.hash.replace('#', '')

    if (this.previousPage) {
      const previousPage = this.pages.find((page) => {
        return page.getAttribute('page') === this.previousPage
      })

      if (previousPage) {
        previousPage.style.display = 'none'
      }
    }

    const currentPage = this.pages.find((page) => {
      return page.getAttribute('page') === this.currentPage
    })

    if (currentPage) {
      currentPage.style.display = 'flex'
    }

    document.dispatchEvent(
      new CustomEvent(`page-changed`, {
        detail: {
          previousPage: this.previousPage,
          currentPage: this.currentPage,
        },
      })
    )
  }

  public getCurrentPage(): string {
    return location.hash.replace('#', '')
  }
}
