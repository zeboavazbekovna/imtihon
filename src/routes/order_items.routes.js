import { Router } from "express";
import { 
    fetchAllOrderItems, 
    fetchOrderItemById, 
    addOrderItem, 
    removeOrderItem, 
    modifyOrderItem 
} from "../controllers/order_item.controller.js";

export const orderItemsRoutes = Router();

// Route to get all order items
orderItemsRoutes.get('/order-items', fetchAllOrderItems);

// Route to get an order item by ID
orderItemsRoutes.get('/order-items/:id', fetchOrderItemById);

// Route to create a new order item
orderItemsRoutes.post('/order-items', addOrderItem);

// Route to delete an order item
orderItemsRoutes.delete('/order-items/:id', removeOrderItem);

// Route to update an existing order item
orderItemsRoutes.put('/order-items/:id', modifyOrderItem);
