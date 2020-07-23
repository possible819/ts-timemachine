/**
 * @author Jay Lee <jaylee.possible@gmail.com>
 * @description  Date 객체를 핸들링하기 위한 util class
 */

export interface DateObj {
  year: number
  month: number
  date: number
  day: string
}

export class DateUtil {
  private _date: Date = new Date()

  constructor(date: number) {
    this.date = date ? new Date(date) : new Date()
    this.date.setHours(0, 0, 0, 0)
  }

  get date(): Date {
    return this._date
  }

  set date(date) {
    if (this._date !== date) {
      this._date = date
    }
  }

  public setYearMonth(year: number, month: number) {
    this.date = new Date(this.date.setFullYear(year, month - 1))
  }

  public getDate(): number {
    return this.date.getDate()
  }

  public setDate(date: number): void {
    let newDate = new Date(this.date)
    this.date = new Date(newDate.setDate(date))
  }

  /**
   * @description date의 연, 월, 일, 요일을 객체 형태로 리턴함
   * @returns {Object} date 연, 월, 일, 요일 정보
   */
  public getDateObj(): DateObj {
    const days = [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ]
    return {
      year: this.date.getFullYear(),
      month: this.date.getMonth() + 1,
      date: this.date.getDate(),
      day: days[this.date.getDay()],
    }
  }

  public getPrevYearMonthStr(): string {
    const dateObj: DateObj = this.getDateObj()
    return `${dateObj.year}년 ${
      dateObj.month - 1 === 0 ? 12 : dateObj.month - 1
    }월`
  }

  public getYearMonthStr(): string {
    const dateObj: DateObj = this.getDateObj()
    return `${dateObj.year}년 ${dateObj.month}월`
  }

  public getNextYearMonthStr(): string {
    const dateObj: DateObj = this.getDateObj()
    return `${dateObj.year}년 ${
      dateObj.month + 1 === 13 ? 1 : dateObj.month + 1
    }월`
  }

  /**
   * @description date의 연 월 일 포멧의 문자열을 리턴함
   * @return {String} 날짜 문자열 xxxx년 x월 x일
   */
  public getFullDateStr(): string {
    const dateObj: DateObj = this.getDateObj()
    return `${dateObj.year}년 ${dateObj.month}월 ${dateObj.date}일 ${dateObj.day}`
  }

  public getPrevMonthFirstDay(): number {
    let date: Date = new Date(this.date)
    date.setMonth(date.getMonth() - 1)
    date.setDate(1)
    return date.getDay()
  }

  /**
   * @description date의 해당 월 1일의 요일을 index를 리턴함
   * @returns {Integer} date의 해당월 1일의 요일 index
   */
  public getFirstDay(): number {
    let date: Date = new Date(this.date)
    date.setDate(1)
    return date.getDay()
  }

  public getNextMonthFirstDay(): number {
    let date = new Date(this.date)
    date.setMonth(date.getMonth() + 1)
    date.setDate(1)
    return date.getDay()
  }

  public getPrevMonthLastDate(): number {
    let date: Date = new Date(this.date)
    date.setDate(0)
    return date.getDate()
  }

  /**
   * @description date의 해당 월 마지막 일을 리턴함
   * @returns {Integer} date의 해당 월 마지막 일
   */
  public getLastDate(): number {
    let date = new Date(this.date)
    date.setMonth(date.getMonth() + 1)
    date.setDate(0)
    return date.getDate()
  }

  public getNextMonthLastDate(): number {
    let date = new Date(this.date)
    date.setMonth(date.getMonth() + 2)
    date.setDate(0)
    return date.getDate()
  }

  /**
   * @description date의 해당 월 첫번째 일 부터 마지막 일 까지를 리턴함 일요일 부터 시작하여 토요일로 끝나며
   * 첫번째 일이 일요일이 아닐 경우 첫번째 일의 요일 까지 공백을 집어 넣어 리턴함 (calendar용도)
   * @returns {Array} date의 해당 월 첫번째 일 부터 마지막 일 배열
   */
  public getDateRange(): (string | number)[] {
    let dateRange: (string | number)[] = []
    if (this.getFirstDay() > 0) {
      for (let emptyDate = 0; emptyDate < this.getFirstDay(); emptyDate++) {
        dateRange.push('')
      }
    }

    for (let date = 1; date <= this.getLastDate(); date++) {
      dateRange.push(date)
    }
    return dateRange
  }

  public getYearStr(): string {
    let dateObj = this.getDateObj()
    return dateObj.year.toString()
  }

  public getMonthStr(): string {
    let dateObj = this.getDateObj()
    return dateObj.month.toString()
  }

  public getDateStr(): string {
    let dateObj = this.getDateObj()
    return dateObj.date.toString()
  }

  public getDateFileNameFormat(): string {
    return `${this.getYearStr()}-${this.getMonthStr()}-${this.getDateStr()}`
  }

  public isToday(): boolean {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    return this.date.getTime() === currentDate.getTime()
  }
}
