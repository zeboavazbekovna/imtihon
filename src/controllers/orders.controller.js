import { fetchData } from '../database/postgres.js';


// order uchun krudlar 

export async function fetchAllOrders(req, res) {
    try {
        const orders = await fetchData("SELECT * FROM orders ORDER BY id;");
        res.send({
            message: "Success",
            data: orders
        });
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving orders",
            error: error.message
        });
    }
}

export async function fetchOrderById(req, res) {
    try {
        const { id } = req.params;
        const order = await fetchData("SELECT * FROM orders WHERE id = $1;", id);

        if (order.length === 0) {
            return res.status(404).send({
                message: "Order not found"
            });
        }

        res.send({
            message: "Success",
            data: order
        });
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving order",
            error: error.message
        });
    }
}

export async function addOrder(req, res) {
    try {
        const { created_at, customer_id, order_status } = req.body;

        const newOrder = await fetchData(
            "INSERT INTO orders (created_at, customer_id, order_status) VALUES ($1, $2, $3) RETURNING *;",
            created_at, customer_id, order_status
        );

        res.status(201).send({
            message: "Order created",
            data: newOrder
        });
    } catch (error) {
        res.status(500).send({
            message: "Error creating order",
            error: error.message
        });
    }
}

export async function modifyOrder(req, res) {
    try {
        const { created_at, customer_id, order_status } = req.body;
        const { id } = req.params;

        const updatedOrder = await fetchData(
            "UPDATE orders SET created_at = $1, customer_id = $2, order_status = $3 WHERE id = $4 RETURNING *;",
            created_at, customer_id, order_status, id
        );

        if (updatedOrder.length === 0) {
            return res.status(404).send({
                message: "Order not found"
            });
        }

        res.send({
            message: "Order updated",
            data: updatedOrder
        });
    } catch (error) {
        res.status(500).send({
            message: "Error updating order",
            error: error.message
        });
    }
}

export async function removeOrder(req, res) {
    try {
        const { id } = req.params;

        const deletedOrder = await fetchData(
            "DELETE FROM orders WHERE id = $1 RETURNING *;",
            id
        );

        if (deletedOrder.length === 0) {
            return res.status(404).send({
                message: "Order not found"
            });
        }

        res.send({
            message: "Order deleted",
            data: deletedOrder
        });
    } catch (error) {
        res.status(500).send({
            message: "Error deleting order",
            error: error.message
        });
    }
}
