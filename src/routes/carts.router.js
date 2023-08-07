const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataFilePath = path.join(__dirname, '../data/carrito.json'); // Ruta al archivo carrito.json

// Leer el contenido del archivo carrito.json
const readDataFromFile = () => {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

// Escribir los datos en el archivo carrito.json
const writeDataToFile = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Rutas para carritos...

// Lista todos los carritos
router.get('/api/carts', (req, res) => {
  const carts = readDataFromFile();
  res.json({ carts });
});


router.post('/api/carts', (req, res) => {
  // Obtener los datos actuales del archivo
  const carts = readDataFromFile();

  // Crear un nuevo carrito
  const newCart = {
    id: generateUniqueId(), // Generar nuevo id único
    products: [],
  };
  carts.push(newCart);

  // Guardar los datos actualizados en el archivo
  writeDataToFile(carts);

  res.status(201).json(newCart);
});

router.get('/api/carts/:cid', (req, res) => {
  const { cid } = req.params;
  const carts = readDataFromFile();
  const cart = carts.find((c) => c.id === cid);
  if (!cart) {
    res.status(404).json({ error: 'Carrito no encontrado' });
  } else {
    res.json(cart.products);
  }
});

router.post('/api/carts/:cid/product/:pid', (req, res) => {
  // Obtener los datos actuales del archivo
  const carts = readDataFromFile();
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = carts.find((c) => c.id === cid);
  if (!cart) {
    res.status(404).json({ error: 'Carrito no encontrado' });
  } else {
    const existingProduct = cart.products.find((p) => p.product === pid);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    // Guardar los datos actualizados en el archivo
    writeDataToFile(carts);

    res.status(201).json(cart.products);
  }
});

// Rutas para carritos...

module.exports = router;
