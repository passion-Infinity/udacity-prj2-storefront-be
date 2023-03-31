import { Request, Response } from 'express';
import { Order, OrderDetails, orderStore } from '../models/order';
import jwt_decode from 'jwt-decode';
import { User } from '../models/user';
import { builderSql } from '../utils/builderSQL';



class OrderHandler {
    async index(req: Request, res: Response) {
        try {
            const sql =
                `SELECT ord.*, to_json (od) AS product
                FROM orders ord 
                JOIN orderDetails od on ord.id = od.order_id
                JOIN products p on od.product_id = p.id`;
            const orders = await builderSql.getByDrawSQL(sql);
            res.json(orders);
        } catch (err) {
            res.status(400).json(err);
        }
    };

    async create(req: Request, res: Response) {
        try {
            const products = req.body.products as unknown as OrderDetails[];
            const token = req.headers.authorization || "";
            const user: User = JSON.parse(JSON.stringify(jwt_decode(token))).user;

            if (!products.length) {
                res.status(400);
                res.send(
                    'Some required parameters are missing! eg. :products'
                );
                return false;
            }

            const order: Order = await orderStore.createOrder({
                products,
                user_id: user.id,
                status: 'active'
            });

            res.json(order);
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
            const order: Order = await orderStore.getOrderById(id);
            res.json(order);
        } catch (e) {
            res.status(400);
            res.json(e);
        }
    };

    async update(req: Request, res: Response) {
        try {
            const id = req.params.id as unknown as number;
            const status = req.body.status as unknown as string;
            if (!id || !status) {
                return res.status(400).send('Missing required parameter :id, :status.');
            }
            const order: Order = await orderStore.updateOrder(id, status);
            res.json(order);
        } catch (e) {
            res.status(400);
            res.json(e);
        }
    };

    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as unknown as number;
            if (!id) {
                res.status(400).send('Missing required parameter :id.');
                return false;
            }
            await orderStore.deleteOrder(id);
            res.send(`Order with id ${id} successfully deleted.`);
        } catch (err) {
            res.status(400).json(err);
        }
    };

    async getOrderByUser(req: Request, res: Response) {
        try {
            const user_id = req.params.user_id as unknown as number;
            if (!user_id) {
                return res.status(400).send('Missing required parameter :id.');
            }
            const order: Order[] = await orderStore.getOrderByUserId(user_id);
            res.json(order);
        } catch (e) {
            res.status(400);
            res.json(e);
        }
    };

    async getCompletedOrderByUser(req: Request, res: Response) {
        try {
            const user_id = req.params.user_id as unknown as number;
            if (!user_id) {
                return res.status(400).send('Missing required parameter :id.');
            }
            const order: Order[] = await orderStore.getCompletedOrderByUserId(user_id);
            res.json(order);
        } catch (e) {
            res.status(400);
            res.json(e);
        }
    };

    async getActivedOrderByUser(req: Request, res: Response) {
        try {
            const user_id = req.params.user_id as unknown as number;
            if (!user_id) {
                return res.status(400).send('Missing required parameter :id.');
            }
            const order: Order[] = await orderStore.getActivedOrderByUserId(user_id);
            res.json(order);
        } catch (e) {
            res.status(400);
            res.json(e);
        }
    };
}

export const orderHandler = new OrderHandler();
