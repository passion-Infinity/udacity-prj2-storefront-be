import Client from '../db/database';
import { builderSql } from '../utils/builderSQL';

export interface BaseProduct {
    name: string;
    price: number;
    category?: string;
}

export interface Product extends BaseProduct {
    id: number;
}

class ProductStore {
    async getAllProducts(): Promise<Product[]> {
        try {
            return await builderSql.getAll('products');
        } catch (err) {
            throw new Error(`Could not get products. ${err}`);
        }
    }

    async createProduct(product: BaseProduct): Promise<Product> {
        const { name, price, category } = product;
        try {
            const fields = ['name', 'price', 'category'];
            const values = [name, price, category];
            return await builderSql.insert(fields, values, 'products');
        } catch (err) {
            throw new Error(`Could not add new product ${name}. ${err}`);
        }
    }

    async getProductById(id: number): Promise<Product> {
        try {
            return await builderSql.getById(id, 'products');
        } catch (err) {
            throw new Error(`Could not find product ${id}. ${err}`);
        }
    }

    async updateProduct(id: number, productData: BaseProduct): Promise<Product> {
        const { name: newName, price, category } = productData;
        try {
            const fields = ["name", "price", "category"];
            const values = [newName, price, category]
            return await builderSql.updateById(id, fields, values, 'products');
        } catch (err) {
            throw new Error(`Could not update product ${newName}. ${err}`);
        }
    }

    async deleteProduct(id: number): Promise<Boolean> {
        try {
            return await builderSql.deleteById(id, 'products');
        } catch (err) {
            throw new Error(`Could not delete product ${id}. ${err}`);
        }
    }
}

export const productStore = new ProductStore();
