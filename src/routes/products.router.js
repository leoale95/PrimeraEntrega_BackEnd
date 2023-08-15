const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataFilePath = path.join(__dirname, '../data/productos.json'); // Ruta al archivo productos.json

// Leer el contenido del archivo productos.json
const readDataFromFile = () => {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

// Escribir los datos en el archivo productos.json
const writeDataToFile = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Rutas para productos...

router.get('/api/products', (req, res) => {
  const products = readDataFromFile();
  res.json({ products });
});

router.get('/api/products/:pid', (req, res) => {
  const { pid } = req.params;
  const products = readDataFromFile();
  const product = products.find((p) => p.id === parseInt(pid)); // Convertir pid a número
  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' });
  } else {
    res.json(product);
  }
});


router.post('/api/products', (req, res) => {
  // Obtener los datos actuales del archivo
  const products = readDataFromFile();

  // Agregar el nuevo producto a los datos actuales
  const newProduct = req.body;
  products.push(newProduct);

  // Guardar los datos actualizados en el archivo
  writeDataToFile(products);

  res.json({ message: 'Producto agregado correctamente' });
});

router.put('/api/products/:pid', (req, res) => {
  const { pid } = req.params;
  const updateFields = req.body;

  // Obtener los datos actuales del archivo
  const products = readDataFromFile();

  const productIndex = products.findIndex((p) => p.id === pid);
  if (productIndex === -1) {
    res.status(404).json({ error: 'Producto no encontrado' });
  } else {
    products[productIndex] = {
      ...products[productIndex],
      ...updateFields,
    };

    // Guardar los datos actualizados en el archivo
    writeDataToFile(products);

    res.json(products[productIndex]);
  }
});

router.delete('/api/products/:pid', (req, res) => {
  const { pid } = req.params;

  // Obtener los datos actuales del archivo
  const products = readDataFromFile();

  const productIndex = products.findIndex((p) => p.id === pid);
  if (productIndex === -1) {
    res.status(404).json({ error: 'Producto no encontrado' });
  } else {
    const deletedProduct = products.splice(productIndex, 1);

    // Guardar los datos actualizados en el archivo
    writeDataToFile(products);

    res.json(deletedProduct[0]);
  }
});


module.exports = router;
