

// muddati otb ketgan tovarlarni chiqarish uchun

app.get('/overdue-payments', async (req, res) => {
    try {
        const overduePayments = await fetchData(`
            SELECT 
                c.name AS customer_name, 
                p.name AS product_name, 
                cn.id AS contract_id, 
                (cn.monthly_payment * (1 + ct.percentage / 100)) AS amount_due,
                (current_date - cn.contract_date - ct.duration) AS days_overdue
            FROM contracts cn
            JOIN customers c ON c.id = cn.customer_id
            JOIN contract_type ct ON ct.id = cn.contract_type_id
            JOIN orders o ON o.id = cn.order_id
            JOIN order_items oi ON oi.order_id = o.id
            JOIN products p ON p.id = oi.product_id
            WHERE current_date > cn.contract_date + ct.duration
        `);

        res.send({
            message: "Success",
            data: overduePayments
        });
    } catch (error) {
        res.status(500).send({
            message: "Error with overdue payments..",
            error: error.message
        });
    }
});
