import { BaseAuthUser, BaseUser, User, userStore } from '../models/user';

describe('User Model', () => {
    const user: BaseAuthUser = {
        username: 'passionInfinity',
        firstname: 'Danh',
        lastname: 'NLC',
        password: 'danhnlc123',
    };

    async function createUser(user: BaseAuthUser) {
        return userStore.createUser(user);
    }

    async function deleteUser(id: number) {
        return userStore.deleteUser(id);
    }

    it('should have getUser method', () => {
        expect(userStore.getAllUsers).toBeDefined();
    });

    it('should have a show method', () => {
        expect(userStore.getUserById).toBeDefined();
    });

    it('should have a create method', () => {
        expect(userStore.createUser).toBeDefined();
    });

    it('should have a remove method', () => {
        expect(userStore.deleteUser).toBeDefined();
    });

    it('should create a user', async () => {
        const createdUser = await createUser(user);
        if (createdUser) {
            expect(createdUser.username).toBe(user.username);
            expect(createdUser.firstname).toBe(user.firstname);
            expect(createdUser.lastname).toBe(user.lastname);
        }
    });

    it('should return a list of users', async () => {
        const result: any = await userStore.getAllUsers();
        expect(result[0].username).toEqual('passionInfinity');
        expect(result[0].firstname).toEqual('Danh');
        expect(result[0].lastname).toEqual('NLC');

        await deleteUser(result[0].id);
    });

    it(' should return the correct users', async () => {
        const createdUser: User = await createUser(user);
        const users = await userStore.getUserById(createdUser.id);
        expect(users).toEqual(createdUser);
        await deleteUser(createdUser.id);
    });

    it('should remove the user', async () => {
        const createdUser: User = await createUser(user);
        await deleteUser(createdUser.id);
        expect(createdUser.firstname).toEqual('Danh');
        expect(createdUser.lastname).toEqual('NLC');
    });

    it('should update the user', async () => {
        const createdUser: User = await createUser(user);
        const newUserData: BaseUser = {
            firstname: 'Kim',
            lastname: 'Hee',
        };

        const { firstname, lastname } = await userStore.updateUser(createdUser.id, newUserData);
        expect(firstname).toEqual(newUserData.firstname);
        expect(lastname).toEqual(newUserData.lastname);

        await deleteUser(createdUser.id);
    });
});
