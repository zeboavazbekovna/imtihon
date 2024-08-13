import express from 'express';
import { fetchData } from './database/postgres.js';
import bodyParser from 'body-parser';
import { appConfig } from './config/app.config.js';
import { categoryRoutes } from './routes/category.routes.js';
import { productRoutes } from './routes/products.routes.js';
import { customerRoutes } from './routes/customers.routes.js';
import { orderRoutes } from './routes/orders.routes.js';
import { orderItemsRoutes } from './routes/order_items.routes.js';
import { paymentsRoutes } from './routes/payments.routes.js';
import { contractRoutes} from './routes/contract.routes.js';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

 
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', customerRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', orderItemsRoutes);
app.use('/api/v1', paymentsRoutes);
app.use('/api/v1', contractRoutes); 

app.get('/', (req, res) => {
    res.send('Serverdan salom hammaga!');
});

app.get('/overdue-payments', async (req, res) => {
    try {
        const overduePayments = await fetchData('SELECT * FROM overdue_payments');
        res.send({
            message: "Success",
            data: overduePayments
        });
    } catch (error) {
        res.status(500).send({
            message: "Xatolik yuzaga keldi",
            error: error.message
        });
    }
});

app.listen(appConfig.port, () => {
    console.log(`Server running on port ${appConfig.port}`);
});
