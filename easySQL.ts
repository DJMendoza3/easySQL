import * as sqlite3 from 'sqlite3';

//extrapolate this into initializer if  you want to make it more modular for future use
import { UserModel, ItemModel, WarehouseModel, JobModel, TruckModel } from '@/models/db.model';

export default function easySQL() {
  const database = new DB();
  database.initialize();
  return database;
}

class DB {
  public database: sqlite3.Database;

  constructor() {
    this.database = new sqlite3.Database('tracker.db');
  }

  public initialize() {
    this.database.serialize(() => {
      this.database.run(`CREATE TABLE IF NOT EXISTS ${UserModel.tableName} (${UserModel.getTableStructure()})`);
      this.database.run(`CREATE TABLE IF NOT EXISTS ${TruckModel.tableName} (${TruckModel.getTableStructure()})`);
      this.database.run(`CREATE TABLE IF NOT EXISTS ${WarehouseModel.tableName} (${WarehouseModel.getTableStructure()})`);
      this.database.run(`CREATE TABLE IF NOT EXISTS ${ItemModel.tableName} (${ItemModel.getTableStructure()})`);
      this.database.run(`CREATE TABLE IF NOT EXISTS ${JobModel.tableName} (${JobModel.getTableStructure()})`);
    });
  }

  public addEntry(table: string, entry: any) {
    const keys = Object.keys(entry);
    const values = Object.values(entry);
    for (let i = 0; i < values.length; i++) {
      if (typeof values[i] === 'object') {
        values[i] = JSON.stringify(values[i]);
      }
    }
    const placeholders = values.map(() => '?').join(',');
    const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;

    return new Promise((resolve, reject) => {
      this.database.run(sql, values, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }
}
