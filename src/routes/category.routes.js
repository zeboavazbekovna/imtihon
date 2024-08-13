import { Router } from "express";
import { 
    fetchAllCategories, 
    addCategory, 
    removeCategory, 
    modifyCategory 
} from "../controllers/category.controller.js";

export const categoryRoutes = Router();

categoryRoutes.get('/categories', fetchAllCategories);
categoryRoutes.post('/categories/add', addCategory);
categoryRoutes.delete('/categories/delete/:id', removeCategory);
categoryRoutes.put('/categories/update/:id', modifyCategory);
