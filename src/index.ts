import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route';
import productRoutes from './routes/product.route';
import orderRoutes from './routes/order.route';

// config env
dotenv.config();

const app = express();
let port = process.env.PORT || 3000;

if (process.env.ENV === 'test') {
    port = process.env.PORT_TEST || 3001;
}

// cors
app.use(cors());
app.options('*', cors());

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));