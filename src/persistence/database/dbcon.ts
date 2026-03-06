import { Pool, PoolClient, QueryResult, QueryConfig } from "pg";
import { niceEnv } from "../utils/env";

class DatabaseConnection {
  private pool: Pool;
  private static instance: DatabaseConnection;

  constructor() {
    this.pool = new Pool({
      host: niceEnv.DATABASE_HOST,
      port: niceEnv.DATABASE_PORT,
      database: niceEnv.DATABASE_NAME,
      user: niceEnv.DATABASE_USER,
      password: niceEnv.DATABASE_PASS,
    });

    this.pool.on("connect", () => {
      console.log("✅ Conectado ao PostgreSQL");
    });

    this.pool.on("error", (err) => {
      console.error("❌ Erro inesperado no pool de conexões:", err);
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    try {
      const result = await this.pool.query(text, params);
      return result;
    } catch (error) {
      console.error("❌ Erro na query:", error);
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    const client = await this.pool.connect();
    return client;
  }

  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.getClient();

    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
    console.log("🔌 Conexões fechadas");
  }
}

const db = DatabaseConnection.getInstance();
export default db;
