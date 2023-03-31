import { Application } from "express";
import { productHandler } from "../handles/product.handler";
import { verifyToken } from "../utils/helper";

export default function productRoutes(app: Application) {
    app.get('/products', productHandler.index);
    app.post('/products', verifyToken, productHandler.create);
    app.get('/products/:id', productHandler.read);
    app.put('/products/:id', verifyToken, productHandler.update);
    app.delete('/products/:id', verifyToken, productHandler.delete);
}