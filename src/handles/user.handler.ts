import { Request, Response } from 'express';
import { getTokenByUser } from '../utils/helper';
import { User, userStore } from '../models/user';


class UserHandler {
    async index(req: Request, res: Response) {
        try {
            const users: User[] = await userStore.getAllUsers();
            res.json(users);
        } catch (err) {
            res.status(400).json(err);
        }
    };

    async create(req: Request, res: Response) {

        console.log(req.body.username)
        try {
            const firstname = req.body.firstname as unknown as string;
            const lastname = req.body.lastname as unknown as string;
            const username = req.body.username as unknown as string;
            const password = req.body.password as unknown as string;



            if (!firstname || !lastname || !username || !password) {
                res.status(400);
                res.send(
                    'Some required parameters are missing! eg. :firstName, :lastName, :userName, :password'
                );
                return false;
            }
            const user: User = await userStore.createUser({
                firstname,
                lastname,
                username,
                password,
            });

            res.json(getTokenByUser(user));
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    };

    async read(req: Request, res: Response) {
        try {
            const id = req.params.id as unknown as number;
            if (!id) {
                return res.status(400).send('Missing required parameter :id.');
            }
            const user: User = await userStore.getUserById(id);
            res.json(user);
        } catch (e) {
            res.status(400);
            res.json(e);
        }
    };

    async update(req: Request, res: Response) {
        try {
            const id = req.params.id as unknown as number;
            const firstname = req.body.firstname as unknown as string;
            const lastname = req.body.lastname as unknown as string;
            if (!firstname || !lastname || !id) {
                res.status(400);
                res.send(
                    'Some required parameters are missing! eg. :firstName, :lastName, :id'
                );
                return false;
            }
            const user: User = await userStore.updateUser(id, {
                firstname,
                lastname,
            });
            res.json(user);
        } catch (err) {
            res.status(400).json(err);
        }
    };

    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as unknown as number;
            if (!id) {
                res.status(400).send('Missing required parameter :id.');
                return false;
            }
            await userStore.deleteUser(id);
            res.send(`User with id ${id} successfully deleted.`);
        } catch (err) {
            res.status(400).json(err);
        }
    };

    async authenticate(req: Request, res: Response) {
        try {
            const username = (req.body.username as unknown as string) || 'passionInfinity';
            const password = (req.body.password as unknown as string) || 'password123@';
            if (!username || !password) {
                res.status(400);
                res.send(
                    'Some required parameters are missing! eg. :username, :password'
                );
                return false;
            }
            const user: User | null = await userStore.authenticate(username, password);
            if (!user) {
                return res.status(401).send(`Wrong password for user ${username}.`);
            }
            res.json(getTokenByUser(user));
        } catch (err) {
            res.status(400).json(err);
        }
    };
}

export const userHandler = new UserHandler();
