export const Database = {
  DB_NAME: 'tm_db',
  DB_VERSION: '1.0.0',
  DB_DESC: 'tm_db',
  DB_SIZE: 1024 * 1024,
  TABLES: {
    tm_auth: {
      encrypted_pwd: {
        type: 'text',
        notNull: true,
      },
    },
    tm_diaries: {
      id: {
        type: 'integer',
        idField: true,
      },
      fileName: {
        type: 'text',
        notNull: true,
      },
      year: {
        type: 'text',
        notNull: true,
      },
      month: {
        type: 'text',
        notNull: true,
      },
      date: {
        type: 'text',
        notNull: true,
      },
      preview: {
        type: 'text',
        notNull: true,
      },
      content: {
        type: 'text',
        notNull: true,
      },
    },
  },
} as const
