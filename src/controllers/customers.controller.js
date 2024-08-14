import { fetchData } from '../database/postgres.js';


// customerlar uchun krudlar 

export async function fetchAllCustomers(req, res) {
    try {
        const customers = await fetchData("SELECT * FROM customers;");
        res.send({
            message: "Success",
            data: customers
        });
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving customers",
            error: error.message
        });
    }
}

export async function fetchCustomerById(req, res) {
    try {
        const { id } = req.params;
        const customer = await fetchData("SELECT * FROM customers WHERE id = $1;", id);

        if (customer.length === 0) {
            return res.status(404).send({
                message: "Customer not found"
            });
        }

        res.send({
            message: "Success",
            data: customer
        });
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving customer",
            error: error.message
        });
    }
}

// To create a new customer
export async function addCustomer(req, res) {
    try {
        const { full_name, email, phone_number, password, image_url } = req.body;

        const newCustomer = await fetchData(
            "INSERT INTO customers (full_name, email, phone_number, password, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
            full_name, email, phone_number, password, image_url
        );

        res.status(201).send({
            message: "Customer created",
            data: newCustomer
        });
    } catch (error) {
        res.status(500).send({
            message: "Error creating customer",
            error: error.message
        });
    }
}

export async function modifyCustomer(req, res) {
    try {
        const { full_name, email, phone_number, password, image_url } = req.body;
        const { id } = req.params;

        const updatedCustomer = await fetchData(
            "UPDATE customers SET full_name = $1, email = $2, phone_number = $3, password = $4, image_url = $5 WHERE id = $6 RETURNING *;",
            full_name, email, phone_number, password, image_url, id
        );

        if (updatedCustomer.length === 0) {
            return res.status(404).send({
                message: "Customer not found"
            });
        }

        res.send({
            message: "Customer updated",
            data: updatedCustomer
        });
    } catch (error) {
        res.status(500).send({
            message: "Error updating customer",
            error: error.message
        });
    }
}


export async function removeCustomer(req, res) {
    try {
        const { id } = req.params;

        const deletedCustomer = await fetchData(
            "DELETE FROM customers WHERE id = $1 RETURNING *;",
            id
        );

        if (deletedCustomer.length === 0) {
            return res.status(404).send({
                message: "Customer not found"
            });
        }

        res.send({
            message: "Customer deleted",
            data: deletedCustomer
        });
    } catch (error) {
        res.status(500).send({
            message: "Error deleting customer",
            error: error.message
        });
    }
}
