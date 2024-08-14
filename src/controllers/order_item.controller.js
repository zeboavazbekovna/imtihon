import { fetchData } from '../database/postgres.js';

// orderlar itemlar uchun krudlar 

export async function fetchAllOrderItems(req, res) {
    try {
        const orderItems = await fetchData("SELECT * FROM order_items;");
        res.send({
            message: "Success",
            data: orderItems
        });
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving order items",
            error: error.message
        });
    }
}

export async function fetchOrderItemById(req, res) {
    try {
        const { id } = req.params;
        const orderItem = await fetchData("SELECT * FROM order_items WHERE id = $1;", id);

        if (orderItem.length === 0) {
            return res.status(404).send({
                message: "Order item not found"
            });
        }

        res.send({
            message: "Success",
            data: orderItem
        });
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving order item",
            error: error.message
        });
    }
}
export async function addOrderItem(req, res) {
    try {
        const { order_id, product_id, quantity, price } = req.body;

        const newOrderItem = await fetchData(
            "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *;",
            order_id, product_id, quantity, price
        );

        res.status(201).send({
            message: "Order item created",
            data: newOrderItem
        });
    } catch (error) {
        res.status(500).send({
            message: "Error creating order item",
            error: error.message
        });
    }
}

export async function modifyOrderItem(req, res) {
    try {
        const { order_id, product_id, quantity, price } = req.body;
        const { id } = req.params;

        const updatedOrderItem = await fetchData(
            "UPDATE order_items SET order_id = $1, product_id = $2, quantity = $3, price = $4 WHERE id = $5 RETURNING *;",
            order_id, product_id, quantity, price, id
        );

        if (updatedOrderItem.length === 0) {
            return res.status(404).send({
                message: "Order item not found"
            });
        }

        res.send({
            message: "Order item updated",
            data: updatedOrderItem
        });
    } catch (error) {
        res.status(500).send({
            message: "Error updating order item",
            error: error.message
        });
    }
}

export async function removeOrderItem(req, res) {
    try {
        const { id } = req.params;

        const deletedOrderItem = await fetchData(
            "DELETE FROM order_items WHERE id = $1 RETURNING *;",
            id
        );

        if (deletedOrderItem.length === 0) {
            return res.status(404).send({
                message: "Order item not found"
            });
        }

        res.send({
            message: "Order item deleted",
            data: deletedOrderItem
        });
    } catch (error) {
        res.status(500).send({
            message: "Error deleting order item",
            error: error.message
        });
    }
}
