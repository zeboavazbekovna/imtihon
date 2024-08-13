import { Router } from "express";
import { 
    fetchAllPayments, 
    fetchPaymentById, 
    addPayment, 
    removePayment, 
    modifyPayment 
} from "../controllers/payments.controller.js";

export const paymentsRoutes = Router();

// Route to get all payments
paymentsRoutes.get('/payments', fetchAllPayments);

// Route to get a payment by ID
paymentsRoutes.get('/payments/:id', fetchPaymentById);

// Route to create a new payment
paymentsRoutes.post('/payments', addPayment);

// Route to delete a payment
paymentsRoutes.delete('/payments/:id', removePayment);

// Route to update an existing payment
paymentsRoutes.put('/payments/:id', modifyPayment);
