import { Router } from "express";
import { 
    fetchAllOrders, 
    fetchOrderById, 
    addOrder, 
    removeOrder, 
    modifyOrder 
} from "../controllers/orders.controller.js";

export const orderRoutes = Router();

// Route to get all orders
orderRoutes.get('/orders', fetchAllOrders);

// Route to get an order by ID
orderRoutes.get('/orders/:id', fetchOrderById);

// Route to create a new order
orderRoutes.post('/orders', addOrder);

// Route to delete an order
orderRoutes.delete('/orders/:id', removeOrder);

// Route to update an existing order
orderRoutes.put('/orders/:id', modifyOrder);
