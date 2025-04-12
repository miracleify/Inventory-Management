// src/modules/sales.js

let sales = [
  { id: 1, productId: 1, quantity: 2, date: '2025-03-18' },
  { id: 2, productId: 2, quantity: 1, date: '2025-03-19' }
];

module.exports = {
  getSales: () => sales,
  getSaleById: id => sales.find(sale => sale.id === id),
  addSale: sale => {
    sale.id = sales.length + 1;
    sale.date = new Date().toISOString().split('T')[0];
    sales.push(sale);
    return sale;
  },
  updateSale: (id, update) => {
    const index = sales.findIndex(sale => sale.id === id);
    if (index > -1) {
      sales[index] = { ...sales[index], ...update };
      return sales[index];
    }
    return null;
  },
  deleteSale: id => {
    sales = sales.filter(sale => sale.id !== id);
    return true;
  }
};
