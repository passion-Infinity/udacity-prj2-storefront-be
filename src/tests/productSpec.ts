import { create } from 'domain';
import { BaseProduct, Product, productStore } from '../models/product';

describe('Product Model', () => {
    const product: BaseProduct = {
        name: 'chocolate',
        price: 50.8,
        category: 'sweet',
    };

    async function createProduct(product: BaseProduct) {
        return productStore.createProduct(product);
    }

    async function deleteProduct(id: number) {
        return productStore.deleteProduct(id);
    }

    it('should have getProducts method', () => {
        expect(productStore.getAllProducts).toBeDefined();
    });

    it('should have a show method', () => {
        expect(productStore.getProductById).toBeDefined();
    });

    it('should have a create method', () => {
        expect(productStore.createProduct).toBeDefined();
    });

    it('should have a remove method', () => {
        expect(productStore.deleteProduct).toBeDefined();
    });

    it('should create a product', async () => {
        const createdProduct = await createProduct(product);
        if (createdProduct) {
            expect(createdProduct.name).toBe(product.name);
            expect(createdProduct.price.toString()).toBe(product.price.toString());
            expect(createdProduct.category).toBe(product.category);
        }
    });

    it('should return a list of products', async () => {
        const result: any = await productStore.getAllProducts();
        expect(result[0].name).toEqual('chocolate');
        expect(result[0].price).toEqual('50.8');
        expect(result[0].category).toEqual('sweet');

        await deleteProduct(result[0].id);
    });

    it(' should return the correct product', async () => {
        const createdProduct: Product = await createProduct(product);
        const products = await productStore.getProductById(createdProduct.id);
        expect(products).toEqual(createdProduct);
        await deleteProduct(createdProduct.id);
    });

    it('should remove the product', async () => {
        const createdProduct: Product = await createProduct(product);
        await deleteProduct(createdProduct.id);
        expect(createdProduct.name).toEqual('chocolate');
        expect(createdProduct.price.toString()).toEqual('50.8');
    });

    it('should update the product', async () => {
        const createdProduct: Product = await createProduct(product);
        const newProductData: BaseProduct = {
            name: 'ice-dream',
            price: 30,
        };

        const { name, price } = await productStore.updateProduct(createdProduct.id, newProductData);
        expect(name).toEqual(newProductData.name);
        expect(price.toString()).toEqual(newProductData.price.toString());

        await deleteProduct(createdProduct.id);
    });
});
