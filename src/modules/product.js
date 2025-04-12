// src/modules/Product.js

// Example: Using a simple class to represent a Product.
// In a real app, you might use an ORM like Sequelize or TypeORM.

class Product {
  constructor(id, name, stock) {
    this.id = id;
    this.name = name;
    this.stock = stock;
  }
}

module.exports = Product;
