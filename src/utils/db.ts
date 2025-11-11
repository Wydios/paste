import { createPool, Pool } from "mariadb";
import { config } from "../config";

class database {
    public pool: Pool;

    constructor() {
        this.pool = createPool({
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database
        });
    };

    async query<T = any>(queryParam: string, params: any[] = []): Promise<T[]> {
        let connection;
        let result;

        try {
            connection = await this.pool.getConnection();
            result = await connection.query(queryParam, params);
        } catch (error: any) {
            console.error("Past & Database | Query failed", error);
            return [];
        } finally {
            connection?.release();
        } 

        return result || [];
    };

    async queryOne<T = any>(queryStr: string, params: any[] = [], addLimit = true): Promise<T | null> {
        return (await this.query(`${queryStr}${addLimit ? " LIMIT 1" : ""}`, params))?.[0] ?? null;
    };

    async entryExists(queryStr: string, params: any[] = [], addLimit = true): Promise<boolean> {
        return !!(await this.query(`${queryStr}${addLimit ? " LIMIT 1" : ""}`, params)).length;
    };
};

export default new database();