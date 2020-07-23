enum Axis {
  x = 'x',
  y = 'y',
}

export interface ScrollOption {
  axis: Axis
  to: number
  duration: number
  callback: () => void
}

interface Scroller {
  targetElement?: HTMLElement
  unitValue?: number
  axis?: string
  to?: number
  duration?: number
  direction?: string
  callback?: () => void
  scrollAnimate: (targetElement: HTMLElement, options: ScrollOption) => void
  animateScrollX: () => void
  animateScrollY: () => void
  animateScrollLeft: () => void
  animateScrollRight: () => void
  animateScrollUp: () => void
  animateScrollDown: () => void
}

export const scroller: Scroller = {
  scrollAnimate: function (
    targetElement: HTMLElement,
    option: ScrollOption
  ): void {
    'use strict'
    this.targetElement = targetElement
    this.axis = option.axis.toLowerCase() === 'y' ? 'y' : 'x'
    this.to = option.to
    this.duration = option.duration
    this.callback = option.callback

    if (this.axis === 'x') {
      this.unitValue = Math.ceil(
        Math.abs(this.targetElement.scrollLeft - this.to) / this.duration
      )
      this.animateScrollX()
    } else {
      this.unitValue = Math.ceil(
        Math.abs(this.targetElement.scrollTop - this.to) / this.duration
      )
      this.animateScrollY()
    }
  },

  animateScrollX: function (): void {
    if (this.targetElement && this.to) {
      if (this.targetElement.scrollLeft > this.to) {
        this.direction = 'left'
      } else if (this.targetElement.scrollLeft < this.to) {
        this.direction = 'right'
      }

      if (this.direction === 'left') {
        this.animateScrollLeft()
      } else {
        this.animateScrollRight()
      }
    }
  },

  animateScrollLeft: function (): void {
    if (this.targetElement && this.to && this.unitValue) {
      if (this.targetElement.scrollLeft <= this.to) {
        this.targetElement.scrollLeft = this.to
        if (this.callback && typeof this.callback === 'function') {
          this.callback()
        }
      } else {
        this.targetElement.scrollLeft =
          this.targetElement.scrollLeft - this.unitValue
        requestAnimationFrame(this.animateScrollLeft.bind(this))
      }
    }
  },

  animateScrollRight: function (): void {
    if (this.targetElement && this.to && this.unitValue) {
      if (this.targetElement.scrollLeft >= this.to) {
        this.targetElement.scrollLeft = this.to
        if (this.callback && typeof this.callback === 'function') {
          this.callback()
        }
      } else {
        this.targetElement.scrollLeft =
          this.targetElement.scrollLeft + this.unitValue
        requestAnimationFrame(this.animateScrollRight.bind(this))
      }
    }
  },

  animateScrollY: function (): void {
    if (this.targetElement && this.to) {
      if (this.targetElement.scrollTop > this.to) {
        this.direction = 'up'
      } else if (this.targetElement.scrollTop < this.to) {
        this.direction = 'down'
      }

      if (this.direction === 'up') {
        this.animateScrollUp()
      } else {
        this.animateScrollDown()
      }
    }
  },

  animateScrollUp: function (): void {
    if (this.targetElement && this.to && this.unitValue) {
      if (this.targetElement.scrollTop <= this.to) {
        this.targetElement.scrollTop = this.to
        if (this.callback && typeof this.callback === 'function') {
          this.callback()
        }
      } else {
        this.targetElement.scrollTop =
          this.targetElement.scrollTop - this.unitValue
        requestAnimationFrame(this.animateScrollUp.bind(this))
      }
    }
  },

  animateScrollDown: function (): void {
    if (this.targetElement && this.to && this.unitValue) {
      if (this.targetElement.scrollTop >= this.to) {
        this.targetElement.scrollTop = this.to
        if (this.callback && typeof this.callback === 'function') {
          this.callback()
        }
      } else {
        this.targetElement.scrollTop =
          this.targetElement.scrollTop + this.unitValue
        requestAnimationFrame(this.animateScrollDown.bind(this))
      }
    }
  },
}
