export const deviceUtil = {
  /**
   * @description Check whether current device is mobile or not
   * @returns {boolean} If it's mobile env return true else false
   */
  isMobileDevice(): boolean {
    return location.protocol.indexOf('http') < 0
  },
}
