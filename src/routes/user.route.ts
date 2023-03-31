import { Application } from "express";
import { userHandler } from "../handles/user.handler";
import { verifyToken } from "../utils/helper";

export default function userRoutes(app: Application) {
    app.get('/users', verifyToken, userHandler.index);
    app.post('/users', userHandler.create);
    app.get('/users/:id', verifyToken, userHandler.read);
    app.put('/users/:id', verifyToken, userHandler.update);
    app.delete('/users/:id', verifyToken, userHandler.delete);
    app.post('/users/auth', userHandler.authenticate);
}