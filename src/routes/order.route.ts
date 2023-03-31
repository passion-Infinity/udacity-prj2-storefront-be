import { Application } from "express";
import { orderHandler } from "../handles/order.handler";
import { verifyToken } from "../utils/helper";

export default function orderRoutes(app: Application) {
    app.get('/orders', verifyToken, orderHandler.index);
    app.post('/orders', verifyToken, orderHandler.create);
    app.get('/orders/:id', verifyToken, orderHandler.read);
    app.put('/orders/:id', verifyToken, orderHandler.update);
    app.delete('/orders/:id', verifyToken, orderHandler.delete);
    app.get('/orders/current/:user_id', verifyToken, orderHandler.getOrderByUser);
    app.get('/orders/completed/:user_id', verifyToken, orderHandler.getCompletedOrderByUser);
    app.get('/orders/actived/:user_id', verifyToken, orderHandler.getActivedOrderByUser);
}