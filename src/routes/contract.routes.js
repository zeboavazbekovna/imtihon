import express from 'express';
import { 
    fetchAllContracts, 
    fetchContractById, 
    addContract, 
    modifyContract, 
    removeContract 
} from '../controllers/contract.controller.js';

export const contractRoutes = express.Router();

// Route to get all contracts
contractRoutes.get('/contracts', fetchAllContracts);

// Route to get a contract by ID
contractRoutes.get('/contracts/:id', fetchContractById);

// Route to create a new contract
contractRoutes.post('/contracts', addContract);

// Route to update an existing contract
contractRoutes.put('/contracts/:id', modifyContract);

// Route to delete a contract
contractRoutes.delete('/contracts/:id', removeContract);
