import { DEFAULT_DB_CONFIG } from '../constants'
import {
  DatabaseConfInterface,
  FieldInterface,
  TableInterface,
} from '../interfaces'

export class WebDatabase {
  private dbConf: DatabaseConfInterface
  private database: Database

  private defaultCallback: SQLStatementCallback = (
    _trx: SQLTransaction,
    resultSet: SQLResultSet
  ) => {
    return this.getResultFromRows(resultSet.rows)
  }

  private defaultErrorCallback: SQLStatementErrorCallback = (
    _trx: SQLTransaction,
    error: SQLError
  ): boolean => {
    throw error
  }

  constructor(databaseConf: DatabaseConfInterface = DEFAULT_DB_CONFIG) {
    try {
      this.dbConf = databaseConf
      this.database = this.createDatabase()
      this.createTables(this.dbConf.TABLES)
    } catch (e) {
      throw new Error(e)
    }
  }

  private createDatabase(): Database {
    return window.openDatabase(
      this.dbConf.DB_NAME,
      this.dbConf.DB_VERSION,
      this.dbConf.DB_DESC,
      this.dbConf.DB_SIZE
    )
  }

  private createTables(tables: TableInterface): void {
    try {
      for (const tableName in tables) {
        const createTableSql: string = this.getCreateTableSql(
          tableName,
          tables[tableName]
        )
        this.doTransaction(createTableSql)
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  private getCreateTableSql(
    tableName: string,
    table: { [field: string]: FieldInterface }
  ): string {
    return Object.keys(table).reduce(
      (sql: string, fieldName: string, idx: number, fieldNames: string[]) => {
        const field: FieldInterface = table[fieldName]

        sql += `
          ${fieldName}
          ${field.type}
          ${field.notNull ? `NOT NULL` : ''}
          ${field.idField ? `PRIMARY KEY ASC` : ''}
          ${idx === fieldNames.length - 1 ? ')' : ','}
        `

        return sql
      },
      `CREATE TABLE IF NOT EXISTS ${tableName}`
    )
  }

  private async doTransaction(
    sql: string,
    args: any[] = [],
    callback: SQLStatementCallback = this.defaultCallback,
    errorCallback: SQLStatementErrorCallback = this.defaultErrorCallback
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.database.transaction((trx: SQLTransaction) => {
        trx.executeSql(
          sql,
          args,
          (trx: SQLTransaction, resultSet: SQLResultSet) => {
            resolve(callback(trx, resultSet))
          },
          (trx: SQLTransaction, error: SQLError): any => {
            reject(errorCallback(trx, error))
          }
        )
      })
    })
  }

  private getResultFromRows(rows: SQLResultSetRowList): any[] {
    let resultList: any[] = []
    for (let i: number = 0; i < rows.length; i++) {
      resultList.push(rows.item(i))
    }

    return resultList
  }
}
