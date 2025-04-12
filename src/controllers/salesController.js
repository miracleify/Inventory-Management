// src/controllers/salesController.js

// In-memory store for demonstration
let sales = [
  { id: 1, productId: 1, quantity: 2, date: '2025-03-18' },
  { id: 2, productId: 2, quantity: 1, date: '2025-03-19' }
];

exports.getAllSales = (req, res) => {
  res.json(sales);
};

exports.getSaleById = (req, res) => {
  const id = parseInt(req.params.id);
  const sale = sales.find(s => s.id === id);
  if (sale) {
    res.json(sale);
  } else {
    res.status(404).json({ message: 'Sale not found' });
  }
};

exports.createSale = (req, res) => {
  const newSale = {
    id: sales.length + 1,
    productId: req.body.productId,
    quantity: req.body.quantity,
    date: new Date().toISOString().split('T')[0]
  };
  sales.push(newSale);
  // OPTIONAL: Reduce product stock here if integrated with productController logic.
  res.status(201).json(newSale);
};

exports.updateSale = (req, res) => {
  const id = parseInt(req.params.id);
  const index = sales.findIndex(s => s.id === id);
  if (index > -1) {
    sales[index] = { ...sales[index], ...req.body };
    res.json(sales[index]);
  } else {
    res.status(404).json({ message: 'Sale not found' });
  }
};

exports.deleteSale = (req, res) => {
  const id = parseInt(req.params.id);
  sales = sales.filter(s => s.id !== id);
  res.status(204).send();
};
