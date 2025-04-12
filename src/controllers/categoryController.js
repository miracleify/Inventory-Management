// src/controllers/categoryController.js
// In-memory store for categories (replace with DB in production)
let categories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Fashion' },
];

exports.getAllCategories = (req, res) => {
  res.json(categories);
};

exports.getCategoryById = (req, res) => {
  const id = parseInt(req.params.id);
  const category = categories.find(c => c.id === id);
  if (category) res.json(category);
  else res.status(404).json({ message: 'Category not found' });
};

exports.createCategory = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name is required' });
  const newCategory = { id: categories.length + 1, name };
  categories.push(newCategory);
  res.status(201).json(newCategory);
};

exports.updateCategory = (req, res) => {
  const id = parseInt(req.params.id);
  const categoryIndex = categories.findIndex(c => c.id === id);
  if (categoryIndex === -1) return res.status(404).json({ message: 'Category not found' });
  categories[categoryIndex] = { ...categories[categoryIndex], ...req.body };
  res.json(categories[categoryIndex]);
};

exports.deleteCategory = (req, res) => {
  const id = parseInt(req.params.id);
  categories = categories.filter(c => c.id !== id);
  res.status(204).send();
};
