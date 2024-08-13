import { Router } from "express";
import { 
    fetchAllProducts, 
    fetchProductById, 
    addProduct, 
    removeProduct, 
    modifyProduct 
} from "../controllers/products.controller.js";

export const productRoutes = Router();

// Route to get all products
productRoutes.get('/products', fetchAllProducts);

// Route to get a product by ID
productRoutes.get('/products/:id', fetchProductById);

// Route to create a new product
productRoutes.post('/products', addProduct);

// Route to delete a product
productRoutes.delete('/products/:id', removeProduct);

// Route to update an existing product
productRoutes.put('/products/:id', modifyProduct);
