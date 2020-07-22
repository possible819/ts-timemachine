export const enum FieldTypes {
  integer,
  text,
}

export interface FieldInterface {
  type: FieldTypes
  idField?: boolean
  notNull?: boolean
}

export interface TableInterface {
  [tableName: string]: {
    [fieldName: string]: FieldInterface
  }
}

export interface DatabaseConfInterface {
  DB_NAME: string
  DB_VERSION: string
  DB_SIZE: number
  DB_DESC: string
  TABLES: TableInterface
}
