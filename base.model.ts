import { db } from '@/app';
import ColumnModel from './column.model';

export default class Model {
  static queryString: string;
  static tableName: string;
  static columns: ColumnModel[];

  static getTableStructure() {
    return this.columns
      .map(column => {
        return `${column.columnName} ${column.columnType} ${column.nullable ? 'NOT NULL' : ''} ${
          column.defaultValue ? `DEFAULT ${column.defaultValue}` : ''
        } ${column.primaryKey ? 'PRIMARY KEY' : ''} ${column.autoIncrement ? 'AUTOINCREMENT' : ''}`;
      })
      .join(', ');
  }

  static query() {
    this.queryString = `SELECT * FROM ${this.tableName}`;
    return this;
  }

  static filterBy(column: string) {
    this.queryString = `${this.queryString} ORDER BY ${column}`;
    return this;
  }

  static first() {
    this.queryString = `${this.queryString} LIMIT 1`;
    //search db with combined string
    return new Promise((resolve, reject) => {
      db.database.get(this.queryString, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.processQueryData(row));
        }
      });
    });
  }
  static all() {
    //search db with combined string
    return new Promise((resolve, reject) => {
      db.database.all(this.queryString, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.processQueryData(rows));
        }
      });
    });
  }
  static limit(limit: number) {
    this.queryString = `${this.queryString} LIMIT ${limit}`;
    return new Promise((resolve, reject) => {
      db.database.all(this.queryString, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.processQueryData(rows));
        }
      });
    });
  }
  static where(column: string, value: string) {
    this.queryString = `${this.queryString} WHERE ${column} = ?`;
    return new Promise((resolve, reject) => {
      db.database.all(this.queryString, value, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.processQueryData(rows));
        }
      });
    });
  }
  static delete(id: string) {
    this.queryString = `DELETE FROM ${this.tableName} WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      db.database.run(this.queryString, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /*
    format for data = {columnName: value, columnName: value}
    ex. {name: 'John', age: 20}
  */
  static update(id: string, data: any) {
    const temp = data;
    let entry = '';
    const keys = Object.keys(temp);
    const values = Object.values(temp);
    for (let i = 0; i < values.length; i++) {
      if (typeof values[i] === 'object') {
        values[i] = JSON.stringify(values[i]);
      }
    }
    for (let i = 0; i < keys.length; i++) {
      entry += `${keys[i]} = $${keys[i]}` + (i < keys.length - 1 ? ', ' : '');
    }
    this.queryString = `UPDATE ${this.tableName} SET ${entry} WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      db.database.run(this.queryString, values, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  private static processQueryData(data: any) {
    data.map(entry => {
      //use this.tablename to get the column properties and then json parse the data if the property if blob
      this.columns.forEach(column => {
        if (column.columnType === 'BLOB') {
          entry[column.columnName] = JSON.parse(entry[column.columnName]);
        }
      });
      //then return the data
    });
    return data;
  }
}
