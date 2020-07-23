import { DatabaseConfInterface, FieldTypes } from '../interfaces'

export const DEFAULT_DB_CONFIG: DatabaseConfInterface = {
  DB_NAME: 'tm_db',
  DB_VERSION: '1.0.0',
  DB_DESC: 'tm_db',
  DB_SIZE: 1024 * 1024,
  TABLES: {
    tm_auth: {
      encrypted_pwd: {
        type: FieldTypes.text,
        notNull: true,
      },
    },
    tm_diaries: {
      id: {
        type: FieldTypes.integer,
        idField: true,
      },
      fileName: {
        type: FieldTypes.text,
        notNull: true,
      },
      year: {
        type: FieldTypes.text,
        notNull: true,
      },
      month: {
        type: FieldTypes.text,
        notNull: true,
      },
      date: {
        type: FieldTypes.text,
        notNull: true,
      },
      preview: {
        type: FieldTypes.text,
        notNull: true,
      },
      content: {
        type: FieldTypes.text,
        notNull: true,
      },
    },
  },
}
