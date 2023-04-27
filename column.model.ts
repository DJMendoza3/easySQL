export enum ColumnType {
  Number = 'INTEGER',
  String = 'TEXT',
  Boolean = 'BOOLEAN',
  Blob = 'BLOB',
  Date = 'DATE',
}

export default class ColumnModel {
  columnType: ColumnType;
  nullable?: boolean;
  defaultValue?: any;
  columnName: string;
  primaryKey?: boolean;
  autoIncrement?: boolean;

  constructor(columnType: ColumnType, columnName: string, nullable?: boolean, defaultValue?: any, primaryKey?: boolean, autoIncrement?: boolean) {
    this.columnType = columnType;
    this.nullable = nullable;
    this.defaultValue = defaultValue;
    this.columnName = columnName;
    this.primaryKey = primaryKey;
    this.autoIncrement = autoIncrement;
  }
}
