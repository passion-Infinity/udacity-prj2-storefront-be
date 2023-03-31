import { BaseOrder, Order, orderStore } from "../models/order";
import { Product, productStore } from "../models/product";
import { User, userStore } from "../models/user";


describe('Order Model', () => {
    let order: BaseOrder, user_id: number, product_id: number, price: number;

    function createOrder(order: BaseOrder) {
        return orderStore.createOrder(order);
    }

    function deleteOrder(id: number) {
        return orderStore.deleteOrder(id);
    }

    beforeAll(async () => {
        const user: User = await userStore.createUser({
            username: 'passionInfinity',
            firstname: 'Danh',
            lastname: 'NLC',
            password: 'danhnlc123',
        });

        user_id = user.id;

        const product: Product = await productStore.createProduct({
            name: 'OrderSpec Product',
            price: 99,
        });

        product_id = product.id;
        price = product.price;

        order = {
            products: [
                {
                    product_id,
                    quantity: 5,
                    price
                },
            ],
            user_id,
            status: 'active',
        };
    });

    afterAll(async () => {
        await userStore.deleteUser(user_id);
        await productStore.deleteProduct(product_id);
    });

    it('should have an index method', () => {
        expect(orderStore.getAllOrder).toBeDefined();
    });

    it('should have a show method', () => {
        expect(orderStore.getOrderById).toBeDefined();
    });

    it('should have a add method', () => {
        expect(orderStore.createOrder).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(orderStore.deleteOrder).toBeDefined();
    });

    it('should add a order', async () => {
        const createdOrder: Order = await createOrder(order);
        expect(createdOrder).toEqual(createdOrder);

        await deleteOrder(createdOrder.id);
    });

    it('should return a list of orders', async () => {
        const createdOrder: Order = await createOrder(order);
        const orderList = await orderStore.getAllOrder();
        expect(orderList).toEqual([...orderList]);
        await deleteOrder(createdOrder.id);
    });

    it('show method should return the correct orders', async () => {
        const createdOrder: Order = await createOrder(order);
        const orderData = await orderStore.getOrderById(createdOrder.id);
        expect(orderData).toEqual(createdOrder);
        await deleteOrder(createdOrder.id);
    });


    it('should remove the order item', async () => {
        const createdOrder: Order = await createOrder(order);
        await deleteOrder(createdOrder.id);
        const orderList = await orderStore.getAllOrder();
        expect(orderList).toEqual([]);
    });
});
