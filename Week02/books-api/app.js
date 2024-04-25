//1. Import Express: Add the following line at the top of your app.js file.
const express = require('express');
const bodyParser = require('body-parser');

//2. Instantiate the Express app: Create an instance of the Express app using express().
const app = express();
//3. Define the Port: Specify the port on which your server will listen for requests.
const port = 3000;

//4. In-memory Book Data: Create an array to store book data.
let books = [
   { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
   { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen' },
];
//Important! While this practical used an in-memory array for simplicity, a real-world scenario would likely use a database to store book data persistently.

//5. Middleware:
// Parse incoming JSON data in requests:
app.use(express.json());
//Parse URL-encoded Form data:
// to configure body-parser to handle URL-encoded form data.
// Setting extended: true allows parsing of nested objects within the form data.
app.use(bodyParser.urlencoded({ extended: true }));     // Set extended: true for nested objects


//6. Let's create the Route for Getting All Books (GET /books):
app.get('/books', (req, res) => {
   res.json(books); // Send the array of books as JSON response
});

//Explanation:
// We use the GET method (app.get) to define a route for retrieving all books.
// When a GET request is made to /books, the provided function is executed.
// The function sends the books array as a JSON response using res.json.



// 1. Add the Route for Creating a Book (POST /books):
app.post('/books', (req, res) => {
    const newBook = req.body; // Get the new book data from the request body
    newBook.id = books.length + 1; // Assign a unique ID
    books.push(newBook); // Add the new book to the array
    res.status(201).json(newBook); // Send created book with status code 201
});

//2. Route for Getting a Single Book (GET /books/:id):**
app.get('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id); // Get book ID from URL parameter
    const book = books.find(book => book.id === bookId);
  
    if (book) {
      res.json(book); // Send the book data if found
    } else {
      res.status(404).send('Book not found'); // Send error for non-existent book
    }
});


//**3. Route for Updating a Book (PUT /books/:id):**

app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id); // Get book ID from URL parameter
  const updatedBook = req.body; // Get updated book data from request body

  const bookIndex = books.findIndex(book => book.id === bookId);

  if (bookIndex !== -1) {
    updatedBook.id = bookId;
    books[bookIndex] = updatedBook; // Update book data in the array
    res.json(updatedBook); // Send updated book data
  } else {
    res.status(404).send('Book not found'); // Send error for non-existent book
  }
});

//4. Route for Deleting a Book (DELETE /books/:id):**
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id); // Get book ID from URL parameter

  const bookIndex = books.findIndex(book => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1); // Remove book from the array
    res.status(204).send(); // Send empty response with status code 204 (No Content)
  } else {
    res.status(404).send('Book not found'); // Send error for non-existent book
  }
});


// Part 4: Starting the Server (10 mins)

//1. Start the server:** In your app.js file, add the following code to start the server.

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});