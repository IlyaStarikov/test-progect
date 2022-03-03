import { Pool, PoolConfig, QueryResult } from 'pg';

const pgConfig: PoolConfig = {
  user: 'ilyastarikov',
  database: 'ilyastarikov',
  password: 'postgres',
  port: 5432,
};

const pool = new Pool(pgConfig);
const query = async (text: string, args?: any[]): Promise<QueryResult> => {
  return await pool
    .query(text, args)
    .then((res) => res)
    .catch((err) => err);
};

export default query;