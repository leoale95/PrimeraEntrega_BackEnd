const express = require('express');
const path = require('path');
const productsRouter = require('./src/routes/products.router');
const cartRouter = require('./src/routes/carts.router');
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', productsRouter);
app.use('/', cartRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});










