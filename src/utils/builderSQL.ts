import Client from '../db/database';

interface BaseQuerySQL {
    insertFullFields(fields: string[], tableName: string): Promise<any>;
    insert(fields: string[], values: any[], tableName: string, password: string): Promise<any>;
    updateById(id: string | number, field: string[], values: any[], tableName: string): Promise<any>;
    deleteById(id: string | number, tableName: string): Promise<boolean>;
    deleteByCustomQuery(conditionalFieldNames: string[], conditionalValues: any[], tableName: string): Promise<boolean>;
    getAll(tableName: string, fields: string[]): Promise<any[]>;
    getById(id: string | number, tableName: string, fields: string[]): Promise<any>;
    getByCustomQuery(conditionalFieldNames: string[], conditionalValues: any[], tableName: string, fields: string[]): Promise<any[]>;
    getByDrawSQL(sql: string, values: any[]): Promise<any[]>;
}

class BuilderSQL implements BaseQuerySQL {
    constructor() { }

    // insert full fields
    async insertFullFields(fields: string[], tableName: string) {
        let sql = `INSERT INTO ${tableName} VALUES (`;

        fields.forEach((item: string) => {
            sql = sql.concat(item);
        });

        sql = sql.concat(');');
        const connection = await Client.connect();
        const { rows } = await connection.query(sql, fields);
        connection.release();
        return rows[0];
    }

    // insert fields by sequence
    async insert(fields: string[], values: any[], tableName: string) {
        let sql = `INSERT INTO ${tableName} (`;
        let valueSql = `VALUES (`;

        fields.forEach((item: string, index: number) => {
            sql = sql.concat(`${item}`);
            valueSql = valueSql.concat(`$${index + 1}`);
            if (index !== fields.length - 1) {
                sql = sql.concat(', ');
                valueSql = valueSql.concat(', ');
            }
        });

        sql = sql.concat(') ');
        valueSql = valueSql.concat(') RETURNING *');
        sql = sql.concat(valueSql);
        const connection = await Client.connect();
        const { rows } = await connection.query(sql, values);
        connection.release();
        return rows[0];
    }

    // update
    async updateById(id: string | number, fields: string[], values: any[], tableName: string) {
        let sql = `UPDATE ${tableName} SET `;
        let idx = -1;

        fields.forEach((item: string, index: number) => {
            sql = sql.concat(`${item} = $${index + 1}`);
            if (index !== fields.length - 1) {
                sql = sql.concat(', ');
            }
            idx = index + 1;
        });

        sql = sql.concat(` WHERE id = $${idx + 1} RETURNING *`);
        console.log(sql);
        const connection = await Client.connect();
        const { rows } = await connection.query(sql, [...values, id]);
        connection.release();
        return rows[0];
    }

    // delete by Id
    async deleteById(id: string | number, tableName: string) {
        let sql = `DELETE FROM ${tableName} WHERE id=($1) RETURNING *`;
        const connection = await Client.connect();
        await connection.query(sql, [id]);
        connection.release();
        return true;
    }

    async deleteByCustomQuery(conditionalFieldNames: string[], conditionalValues: any[], tableName: string) {
        let sql = `DELETE FROM ${tableName} WHERE `;
        conditionalFieldNames.forEach((item, index) => {
            sql = sql.concat(`${item} = $${index + 1}`);
            if (index !== conditionalFieldNames.length - 1) {
                sql = sql.concat(', ');
            }
        });
        const connection = await Client.connect();
        await connection.query(sql, conditionalValues);
        connection.release();
        return true;
    }

    async getAll(tableName: string, fields: string[] = []) {
        let sql = `SELECT * FROM ${tableName}`;
        if (fields.length) {
            sql = `SELECT `;
            fields.forEach((item: string, index: number) => {
                sql = sql.concat(`${item}`);
                if (index !== fields.length - 1) {
                    sql = sql.concat(', ');
                }
            });

            sql = sql.concat(` ${tableName}`);
        }

        const connection = await Client.connect();
        const { rows } = await connection.query(sql);
        connection.release();

        return rows;
    }

    async getById(id: string | number, tableName: string, fields: string[] = []) {
        let sql = `SELECT * FROM ${tableName} WHERE id=($1)`;
        if (fields.length) {
            sql = `SELECT `;
            fields.forEach((item: string, index: number) => {
                sql = sql.concat(`${item}`);
                if (index !== fields.length - 1) {
                    sql = sql.concat(', ');
                }
            });

            sql = sql.concat(` ${tableName} WHERE id=($1)`);
        }

        const connection = await Client.connect();
        const { rows } = await connection.query(sql, [id]);
        connection.release();
        return rows[0];
    }

    // get by dynamic condition
    async getByCustomQuery(conditionalFieldNames: string[], conditionalValues: any[], tableName: string, fields: string[] = []): Promise<any[]> {
        let sql = 'SELECT * ';
        if (fields.length) {
            sql = `SELECT `;
            fields.forEach((item: string, index: number) => {
                sql = sql.concat(`${item}`);
                if (index !== fields.length - 1) {
                    sql = sql.concat(', ');
                }
            });
        }

        sql = sql.concat(` FROM ${tableName} WHERE `);
        conditionalFieldNames.forEach((item, index) => {
            sql = sql.concat(`${item} = $${index + 1}`);
            if (index !== conditionalFieldNames.length - 1) {
                sql = sql.concat(' and ');
            }
        });

        const connection = await Client.connect();
        const { rows } = await connection.query(sql, conditionalValues);
        connection.release();
        return rows;
    }

    async getByDrawSQL(sql: string, values: any[] = []) {
        const connection = await Client.connect();
        const { rows } = await connection.query(sql);
        connection.release();
        return rows;
    }
}

export const builderSql = new BuilderSQL();