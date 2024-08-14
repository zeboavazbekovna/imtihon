import { fetchData } from '../database/postgres.js';


// productlar uchun krudlar 
export async function fetchAllProducts(req, res) {
    try {
        const products = await fetchData("SELECT * FROM products ORDER BY ID;");
        res.send({
            message: "Success",
            data: products
        });
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving products",
            error: error.message
        });
    }
}

export async function fetchProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await fetchData("SELECT * FROM products WHERE id = $1;", id);

        if (product.length === 0) {
            return res.status(404).send({
                message: "Product not found"
            });
        }

        res.send({
            message: "Success",
            data: product
        });
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving product",
            error: error.message
        });
    }
}

export async function addProduct(req, res) {
    try {
        const { title, description, price, rating, category_id, count, image_url } = req.body;

        const newProduct = await fetchData(
            "INSERT INTO products (title, description, price, rating, category_id, count, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
            title, description, price, rating, category_id, count, image_url
        );

        res.status(201).send({
            message: "Product created",
            data: newProduct
        });
    } catch (error) {
        res.status(500).send({
            message: "Error creating product",
            error: error.message
        });
    }
}
export async function modifyProduct(req, res) {
    try {
        const { title, description, price, rating, category_id, count, image_url } = req.body;
        const { id } = req.params;

        const updatedProduct = await fetchData(
            "UPDATE products SET title = $1, description = $2, price = $3, rating = $4, category_id = $5, count = $6, image_url = $7 WHERE id = $8 RETURNING *;",
            title, description, price, rating, category_id, count, image_url, id
        );

        if (updatedProduct.length === 0) {
            return res.status(404).send({
                message: "Product not found"
            });
        }

        res.send({
            message: "Product updated",
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).send({
            message: "Error updating product",
            error: error.message
        });
    }
}

export async function removeProduct(req, res) {
    try {
        const { id } = req.params;

        const deletedProduct = await fetchData(
            "DELETE FROM products WHERE id = $1 RETURNING *;",
            id
        );

        if (deletedProduct.length === 0) {
            return res.status(404).send({
                message: "Product not found"
            });
        }

        res.send({
            message: "Product deleted",
            data: deletedProduct
        });
    } catch (error) {
        res.status(500).send({
            message: "Error deleting product",
            error: error.message
        });
    }
}
