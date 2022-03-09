import { Pool, PoolConfig, QueryResult } from 'pg';

const pgConfig: PoolConfig = {
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const pool = new Pool(pgConfig);
const query = async (text: string, args?: any[]): Promise<QueryResult> => {
  return await pool
    .query(text, args)
    .then((res) => res)
    .catch((err) => err);
};

export default query;