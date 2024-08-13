import { Router } from "express";
import { 
    fetchAllCustomers, 
    fetchCustomerById, 
    addCustomer, 
    removeCustomer, 
    modifyCustomer 
} from "../controllers/customers.controller.js";

export const customerRoutes = Router();

// Route to get all customers
customerRoutes.get('/customers', fetchAllCustomers);

// Route to get a customer by ID
customerRoutes.get('/customers/:id', fetchCustomerById);

// Route to create a new customer
customerRoutes.post('/customers', addCustomer);

// Route to delete a customer
customerRoutes.delete('/customers/:id', removeCustomer);

// Route to update an existing customer
customerRoutes.put('/customers/:id', modifyCustomer);
