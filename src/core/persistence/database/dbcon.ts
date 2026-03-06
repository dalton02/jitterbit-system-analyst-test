import { Pool, PoolClient, QueryResult, QueryConfig } from "pg";
import { niceEnv } from "../utils/env";
import Postgrator from "postgrator";
import path, { dirname } from "node:path";

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
      ssl: false,
    });

    this.pool.on("connect", async () => {
      console.log("Conectado ao banco");
    });

    this.pool.on("error", (err) => {
      console.error("Erro inesperado no pool de conexões:", err);
    });
    this.process();
  }

  private async process() {
    const migrationsPath = path.resolve(__dirname, "../../../migrations");

    const postgrator = new Postgrator({
      migrationPattern: path.join(migrationsPath, "*"),
      driver: "pg",
      database: niceEnv.DATABASE_NAME,
      execQuery: (query) => this.pool.query(query),
    });

    const migrations = await postgrator.migrate();

    if (migrations.length === 0) {
      console.log("Nenhuma migração pendente");
    } else {
      console.log(
        `${migrations.length} migração(ões) aplicada(s) com sucesso:`,
      );
      migrations.forEach((m) => {
        console.log(`   - ${m.name}`);
      });
    }
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
  }
}

const db = DatabaseConnection.getInstance();
export default db;
