import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_TEST_DB, ENV } =
    process.env;

console.log('ENV -> ', ENV);
console.log('POSTGRES_HOST -> ', POSTGRES_HOST);
console.log('POSTGRES_DB -> ', POSTGRES_DB);
console.log('POSTGRES_USER -> ', POSTGRES_USER);
console.log('POSTGRES_PASSWORD -> ', POSTGRES_PASSWORD);
console.log('POSTGRES_TEST_DB -> ', POSTGRES_TEST_DB);

let client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
});

if (ENV === 'test') {
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_TEST_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    });
}

export default client;
