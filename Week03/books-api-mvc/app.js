const express = require("express");
const bodyParser = require("body-parser");
const booksController = require("./controllers/booksControllers");
const validateBook = require('./middlewares/validatebook');
const app = express();

app.use(bodyParser.json()); //Parse the incoming json data in request body
app.use(bodyParser.urlencoded({extended:true})); //For form data handling

app.get("/books", booksController.getAllBooks);
app.get("/books/:id", booksController.getBookById);
app.post("/books", validateBook, booksController.createBook); // Add validateBook before createBook
app.put("/books/:id", validateBook, booksController.updateBook); // Add validateBook before updateBook
app.delete("/books", booksController.deleteBook);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


