import bcrypt from 'bcrypt';
import Client from '../db/database';
import { builderSql } from '../utils/builderSQL';
import dotenv from 'dotenv';

dotenv.config();

// Define Interface
export interface BaseUser {
    firstname: string;
    lastname: string;
}

export interface BaseAuthUser extends BaseUser {
    username: string;
    password: string;
}

export interface User extends BaseAuthUser {
    id: number;
}

class UserStore {
    async getAllUsers(): Promise<User[]> {
        try {
            return await builderSql.getAll('users');
        } catch (err) {
            throw new Error(`Can not get users. ERROR: ${err}`);
        }
    }

    async createUser(user: BaseAuthUser): Promise<User> {
        const { firstname, lastname, username, password } = user;

        try {
            const fields = ['firstname', 'lastname', 'username', 'password_hash'];
            const hash = bcrypt.hashSync(
                password + process.env.BCRYPT_PASSWORD,
                parseInt(process.env.SALT_ROUNDS as string, 10)
            );
            const values = [firstname, lastname, username, hash];

            return await builderSql.insert(fields, values, 'users');
        } catch (err) {
            throw new Error(`Could not add new user ${firstname} ${lastname}. ${err}`);
        }
    }

    async getUserById(id: number): Promise<User> {
        try {
            return await builderSql.getById(id, 'users');
        } catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`);
        }
    }

    async updateUser(id: number, newUserData: BaseUser): Promise<User> {
        try {
            const fields = ["firstname", "lastname"];
            return await builderSql.updateById(id, fields, [newUserData.firstname, newUserData.lastname], 'users');
        } catch (err) {
            throw new Error(
                `Could not update user ${newUserData.firstname} ${newUserData.lastname}. ERROR: ${err}`
            );
        }
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            return builderSql.deleteById(id, 'users');
        } catch (err) {
            throw new Error(`Could not delete user ${id}. Error: ${err}`);
        }
    }

    async authenticate(username: string, password: string): Promise<User | null> {
        try {
            const sql = 'SELECT * FROM users WHERE username=($1)';
            const conn = await Client.connect();
            const { rows } = await conn.query(sql, [username]);

            if (rows.length > 0) {
                const user = rows[0];
                if (bcrypt.compareSync(password + process.env.BCRYPT_PASSWORD, user.password_hash)) {
                    return user;
                }
            }
            conn.release();
            return null;
        } catch (err) {
            throw new Error(`Could not find user ${username}. ERROR: ${err}`);
        }
    }
}

export const userStore = new UserStore();
