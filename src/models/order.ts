import Client from '../db/database';
import { builderSql } from '../utils/builderSQL';

export interface OrderDetails {
    product_id: number;
    quantity: number;
    price: number;
}

export interface BaseOrder {
    products: OrderDetails[];
    user_id: number;
    total?: number;
    status: string;
}

export interface Order extends BaseOrder {
    id: number;
}

class OrderStore {
    async getAllOrder(): Promise<Order[]> {
        try {
            const orders = await builderSql.getAll('orders');
            return orders;
        } catch (err) {
            throw new Error(`Could not get orders. ${err}`);
        }
    }

    async createOrder(order: BaseOrder): Promise<Order> {
        const { products, status, user_id } = order;

        try {
            // create order
            const orderFields = ['user_id', 'total', 'status'];
            const total = products.reduce((acc, value): number => {
                return acc + value.quantity * value.price;
            }, 0);
            const orderValues = [user_id, total, status];
            const order = await builderSql.insert(orderFields, orderValues, 'orders');

            // create order detail
            const OrderDetails = [];
            const orderDetailFields = ['order_id', 'product_id', 'quantity', 'price'];

            for (const product of products) {
                const { product_id, quantity, price } = product;
                const orderDetail = await builderSql.insert(orderDetailFields, [order.id, product_id, quantity, price], 'orderDetails')
                OrderDetails.push(orderDetail);
            }

            return {
                ...order,
                products: OrderDetails,
            };
        } catch (err) {
            throw new Error(`Could not add new order for user ${user_id}. ${err}`);
        }
    }

    async getOrderById(id: number): Promise<Order> {
        try {
            const order = await builderSql.getById(id, 'orders');
            const orderDetails = await builderSql.getByCustomQuery(['order_id'], [order.id], 'orderDetails');
            return {
                ...order,
                products: orderDetails,
            };
        } catch (err) {
            throw new Error(`Could not find order ${id}. ${err}`);
        }
    }

    async getOrderByUserId(user_id: number): Promise<Order[]> {
        try {
            const orders = await builderSql.getByCustomQuery(['user_id'], [user_id], 'orders');
            return orders
        } catch (err) {
            throw new Error(`Could not find order by user_id ${user_id}. ${err}`);
        }
    }

    async getCompletedOrderByUserId(user_id: number): Promise<Order[]> {
        try {
            const orders = await builderSql.getByCustomQuery(['user_id', 'status'], [user_id, 'complete'], 'orders');
            return orders
        } catch (err) {
            throw new Error(`Could not find order by user_id ${user_id}. ${err}`);
        }
    }

    async getActivedOrderByUserId(user_id: number): Promise<Order[]> {
        try {
            const orders = await builderSql.getByCustomQuery(['user_id', 'status'], [user_id, 'active'], 'orders');
            return orders
        } catch (err) {
            throw new Error(`Could not find order by user_id ${user_id}. ${err}`);
        }
    }

    async updateOrder(id: number, status: string): Promise<Order> {
        try {
            const fields = ["status"];
            const values = [status]
            return await builderSql.updateById(id, fields, values, 'orders');
        } catch (err) {
            throw new Error(`Could not update order status. ${err}`);
        }
    }

    async deleteOrder(id: number): Promise<boolean> {
        try {
            await builderSql.deleteByCustomQuery(['order_id'], [id], 'orderDetails');
            await builderSql.deleteById(id, 'orders');
            return true;
        } catch (err) {
            throw new Error(`Could not delete order ${id}. ${err}`);
        }
    }
}

export const orderStore = new OrderStore();
