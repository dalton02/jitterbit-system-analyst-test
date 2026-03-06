import { PoolClient, QueryResult } from "pg";
import db from "./dbcon";

export class Repository {
  private client?: PoolClient;

  constructor(transaction?: PoolClient) {
    this.client = transaction;
  }

  protected async query(text: string, params?: any[]): Promise<QueryResult> {
    if (this.client) {
      return this.client.query(text, params);
    }

    return db.query(text, params);
  }
}
