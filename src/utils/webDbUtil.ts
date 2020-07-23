import { DEFAULT_DB_CONFIG } from '../constants'
import { DatabaseConfInterface, DiaryInterface } from '../interfaces'

/**
 * @author Jay Lee <jaylee.possible@gmail.com>
 * @description  Mobile, PC 환경의 File System 관리를 위한 Util
 */
export class WebDBUtil {
  private webSQL: Database | undefined
  /**
   * @description WebSQL initialize 데이터베이스 및 테이블 생성을 수행
   */
  public initialize(dbConf: DatabaseConfInterface = DEFAULT_DB_CONFIG): void {
    this.createDatabase(dbConf)
    this.createTables(dbConf)
  }

  /**
   * @description window 객체의 CONST 정보를 바탕으로 데이터베이스를 initialize
   */
  private createDatabase(dbConf: DatabaseConfInterface): void {
    this.webSQL = window.openDatabase(
      dbConf.DB_NAME,
      dbConf.DB_VERSION,
      dbConf.DB_DESC,
      dbConf.DB_SIZE
    )
  }

  /**
   * @description window 객체의 CONST 정보를 바탕으로 데이터베이스의 테이블들을 initialize
   */
  private async createTables(dbConf: DatabaseConfInterface): Promise<void> {
    const { TABLES: tables } = dbConf

    for (let tableName in tables) {
      if (tables[tableName]) {
        let table = tables[tableName]
        let createTableSql = `CREATE TABLE IF NOT EXISTS ${tableName} (`

        for (let columnName in table) {
          if (table[columnName]) {
            let column = table[columnName]
            createTableSql += `${columnName} `
            createTableSql += `${column.type} `
            createTableSql += column.notNull ? 'NOT NULL' : ''
            createTableSql += column.idField ? 'PRIMARY KEY ASC' : ''
            createTableSql += ','
          }
        }

        createTableSql = createTableSql.slice(0, -1)
        createTableSql += ')'

        try {
          await this.doTransaction(createTableSql)
          this.createTablesSuccessCallback()
        } catch (e) {
          throw e
        }
      }
    }
  }

  /**
   * @description 테이블 생성 success callback
   */
  private createTablesSuccessCallback(): void {
    document.dispatchEvent(new CustomEvent('web-db-initialized'))
  }

  public async selectDiary(condition: { [key: string]: any }): Promise<void> {
    let sql = `SELECT * FROM tm_diaries WHERE 1=1`

    if (condition) {
      for (const key in condition) {
        if (condition[key]) {
          sql += ` AND ${key} = '${condition[key]}'`
        }
      }
    }

    try {
      await this.doTransaction(sql, [])
    } catch (e) {
      throw e
    }
  }

  public async replaceDiary(diary: DiaryInterface): Promise<void> {
    const sql = `REPLACE INTO tm_diaries
                  (id, fileName, year, month, date, preview, content)
                VALUES
                  (?, ?, ?, ?, ?, ?, ?)`
    const args = [
      diary.id,
      diary.fileName,
      diary.year,
      diary.month,
      diary.date,
      diary.preview,
      diary.content,
    ]
    await this.doTransaction(sql, args)
  }

  public async insertDiary(diary: DiaryInterface): Promise<void> {
    const sql = `INSERT INTO tm_diaries
                  (fileName, year, month, date, preview, content)
                VALUES
                  (?, ?, ?, ?, ?, ?)`
    const args = [
      diary.fileName,
      diary.year,
      diary.month,
      diary.date,
      diary.preview,
      diary.content,
    ]
    await this.doTransaction(sql, args)
  }

  public async deleteDiary(fileName: string): Promise<void> {
    const sql = 'DELETE FROM tm_diaries WHERE fileName = ?'
    const args = [fileName]
    await this.doTransaction(sql, args)
  }

  public async insertPwd(pwd: string): Promise<void> {
    const sql = `INSERT INTO tm_auth
                  (encrypted_pwd)
                VALUES 
                  (?)`
    const args = [pwd]
    await this.doTransaction(sql, args)
  }

  public async deletePwd(): Promise<void> {
    const sql = `DELETE FROM tm_auth`
    await this.doTransaction(sql, [])
  }

  public async checkAuth(pwd: string): Promise<boolean> {
    const sql = `SELECT encrypted_pwd FROM tm_auth LIMIT 1`

    try {
      const result: any[] = (await this.doTransaction(sql, [])) as any[]
      return pwd === result[0].encrypted_pwd
    } catch (e) {
      throw e
    }
  }

  private async doTransaction(sql: string, args: any[] = []): Promise<unknown> {
    return new Promise(
      (resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
        if (this.webSQL && this.webSQL.transaction) {
          this.webSQL.transaction((trx: SQLTransaction) => {
            trx.executeSql(
              sql,
              args,
              (_trx, result) => {
                resolve(this.getResultFromRows(result.rows))
              },
              (_trx, error): any => {
                reject(error)
              }
            )
          })
        }
      }
    )
  }

  private getResultFromRows(rows: SQLResultSetRowList): any[] {
    const resultList = []
    for (let i = 0; i < rows.length; i++) {
      resultList.push(rows.item(i))
    }
    return resultList
  }
}
