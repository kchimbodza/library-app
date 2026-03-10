// This file handles all communication with the backend (json-server on port 3000)
// Every function here sends a request to the server and returns the result

const API = 'http://localhost:3000'; // The base URL for our backend server

// ── USER FUNCTIONS ────────────────────────────────────────────────────────────

// Check if username and password match a user in the database
export async function loginUser(username, password) {
  const response = await fetch(`${API}/users`);        // Get all users from the server
  const users = await response.json();                 // Convert the response to a JavaScript array

  // Loop through users to find one that matches the username AND password
  const match = users.find(
    (user) => user.username === username && user.password === password
  );

  if (match) {
    return { success: true, user: match };             // Login worked, return the user object
  } else {
    return { success: false, error: 'Invalid username or password' }; // No match found
  }
}

// Create a new user account in the database
export async function registerUser(username, password, role) {
  // First check if this username is already taken
  const checkResponse = await fetch(`${API}/users?username=${username}`);
  const existing = await checkResponse.json();         // Will be an array (empty if username is free)

  if (existing.length > 0) {
    return { success: false, error: 'Username already taken' }; // Username is taken
  }

  // Username is free, so create the new user
  const response = await fetch(`${API}/users`, {
    method: 'POST',                                    // POST means we are creating something new
    headers: { 'Content-Type': 'application/json' },  // Tell the server we are sending JSON
    body: JSON.stringify({ username, password, role }) // Convert the user object to a JSON string
  });

  if (response.ok) {
    return { success: true };                          // Account created successfully
  } else {
    return { success: false, error: 'Registration failed' };
  }
}

// ── BOOK FUNCTIONS ────────────────────────────────────────────────────────────

// Get all books from the database
export async function fetchBooks() {
  const response = await fetch(`${API}/books`);        // Send GET request to /books
  return response.json();                              // Return the array of books
}

// Add a new book to the database
export async function addBook(title, author, genre, rating) {
  const response = await fetch(`${API}/books`, {
    method: 'POST',                                    // POST = create new
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({                             // The new book object
      title,
      author,
      genre,
      rating: Number(rating),                          // Make sure rating is a number, not a string
      status: 'Available'                              // All new books start as Available
    })
  });
  return response.json();                              // Return the newly created book (with its id)
}

// Replace a book's data completely (used when editing)
export async function updateBook(id, bookData) {
  const response = await fetch(`${API}/books/${id}`, { // Target the specific book by id
    method: 'PUT',                                     // PUT = replace the whole object
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)                     // Send the updated book data
  });
  return response.json();
}

// Update only one field of a book (used for checkout/return to change status)
export async function patchBook(id, changes) {
  const response = await fetch(`${API}/books/${id}`, {
    method: 'PATCH',                                   // PATCH = update only specific fields
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes)                      // e.g. { status: 'Checked Out' }
  });
  return response.json();
}

// Delete a book from the database
export async function deleteBook(id) {
  await fetch(`${API}/books/${id}`, {
    method: 'DELETE'                                   // DELETE = remove this book
  });
}

// ── TRANSACTION FUNCTIONS ─────────────────────────────────────────────────────

// Get all transactions from the database
export async function fetchTransactions() {
  const response = await fetch(`${API}/transactions`); // Send GET request to /transactions
  return response.json();                              // Return the array of transactions
}

// Save a new checkout or return transaction to the database
export async function addTransaction(bookId, bookTitle, username, action) {
  const response = await fetch(`${API}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookId: Number(bookId),                          // The id of the book
      bookTitle,                                       // The title (so we can display it later)
      username,                                        // Who did the action
      action,                                          // Either 'Checkout' or 'Return'
      timestamp: new Date().toISOString()              // Current date and time
    })
  });
  return response.json();                              // Return the saved transaction
}
