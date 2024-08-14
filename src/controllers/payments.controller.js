import { fetchData } from '../database/postgres.js';


// paymentlarni olish

export async function fetchAllPayments(req, res) {
    try {
        const payments = await fetchData("SELECT * FROM payments;");
        res.send({
            message: "Success",
            data: payments
        });
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving payments",
            error: error.message
        });
    }
}

export async function fetchPaymentById(req, res) {
    try {
        const { id } = req.params;
        const payment = await fetchData("SELECT * FROM payments WHERE id = $1;", id);

        if (payment.length === 0) {
            return res.status(404).send({
                message: "Payment not found"
            });
        }

        res.send({
            message: "Success",
            data: payment
        });
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving payment",
            error: error.message
        });
    }
}

export async function addPayment(req, res) {
    try {
        const { order_id, amount, payment_method } = req.body;

        const newPayment = await fetchData(
            "INSERT INTO payments (order_id, amount, payment_method) VALUES ($1, $2, $3) RETURNING *;",
            order_id, amount, payment_method
        );

        res.status(201).send({
            message: "Payment created",
            data: newPayment
        });
    } catch (error) {
        res.status(500).send({
            message: "Error creating payment",
            error: error.message
        });
    }
}

export async function modifyPayment(req, res) {
    try {
        const { order_id, amount, payment_method } = req.body;
        const { id } = req.params;

        const updatedPayment = await fetchData(
            "UPDATE payments SET order_id = $1, amount = $2, payment_method = $3 WHERE id = $4 RETURNING *;",
            order_id, amount, payment_method, id
        );

        if (updatedPayment.length === 0) {
            return res.status(404).send({
                message: "Payment not found"
            });
        }

        res.send({
            message: "Payment updated",
            data: updatedPayment
        });
    } catch (error) {
        res.status(500).send({
            message: "Error updating payment",
            error: error.message
        });
    }
}

export async function removePayment(req, res) {
    try {
        const { id } = req.params;

        const deletedPayment = await fetchData(
            "DELETE FROM payments WHERE id = $1 RETURNING *;",
            id
        );

        if (deletedPayment.length === 0) {
            return res.status(404).send({
                message: "Payment not found"
            });
        }

        res.send({
            message: "Payment deleted",
            data: deletedPayment
        });
    } catch (error) {
        res.status(500).send({
            message: "Error deleting payment",
            error: error.message
        });
    }
}
