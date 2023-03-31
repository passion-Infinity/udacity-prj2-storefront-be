import { Request, Response } from 'express';
import { Product, productStore } from '../models/product';

class ProductHandler {
    async index(req: Request, res: Response) {
        try {
            const users: Product[] = await productStore.getAllProducts();
            res.json(users);
        } catch (err) {
            res.status(400).json(err);
        }
    };

    async create(req: Request, res: Response) {
        try {
            const name = req.body.name as unknown as string;
            const price = req.body.price as unknown as number;
            const category = req.body.category as unknown as string;

            if (!name || !price) {
                res.status(400);
                res.send(
                    'Some required parameters are missing! eg. :name, :price'
                );
                return false;
            }
            const product: Product = await productStore.createProduct({
                name,
                price,
                category,
            });

            res.json(product);
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
            const product: Product = await productStore.getProductById(id);
            res.json(product);
        } catch (e) {
            res.status(400);
            res.json(e);
        }
    };

    async update(req: Request, res: Response) {
        try {
            const id = req.params.id as unknown as number;
            const name = req.body.name as unknown as string;
            const price = req.body.price as unknown as number;
            const category = req.body.category as unknown as string || '';
            if (!name || !price || !id) {
                res.status(400);
                res.send(
                    'Some required parameters are missing! eg. :name, :price, :id'
                );
                return false;
            }
            const product: Product = await productStore.updateProduct(id, {
                name,
                price,
                category
            });
            res.json(product);
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
            await productStore.deleteProduct(id);
            res.send(`Product with id ${id} successfully deleted.`);
        } catch (err) {
            res.status(400).json(err);
        }
    };
}

export const productHandler = new ProductHandler();
