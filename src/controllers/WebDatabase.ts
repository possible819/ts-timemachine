import { Database as DatabaseConf } from '../constants'

interface TableMeta {
  [tableName: string]: Table
}

interface Table {
  [fieldName: string]: Field
}

interface Field {
  type: string
  idField?: boolean
  notNull?: boolean
}

export class WebDatabase {
  private dbConf: typeof DatabaseConf
  private database: Database

  constructor() {
    try {
      this.dbConf = DatabaseConf
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

  private createTables(tables: TableMeta): void {
    try {
      for (const tableName in tables) {
        const createTableSql: string = this.getCreateTableSql(
          tableName,
          tables[tableName]
        )
        await doTransaction(createTableSql)
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  private getCreateTableSql(tableName: string, table: Table): string {
    return Object.keys(table).reduce(
      (sql: string, fieldName: string, idx: number, fieldNames: string[]) => {
        const field: Field = table[fieldName]

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

  private async doTransaction(sql: string, args: any[] = []): Promise<void> {
    this.database.transaction((trx: SQLTransaction) => {
      trx.executeSql(sql, args)
    })
  }
}
