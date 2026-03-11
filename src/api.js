const API = 'http://localhost:3000';

export async function loginUser(username, password) {
  const response = await fetch(`${API}/users`);
  const users = await response.json();
  const match = users.find(
    (user) => user.username === username && user.password === password
  );
  if (match) {
    return { success: true, user: match };
  } else {
    return { success: false, error: 'Invalid username or password' };
  }
}

export async function registerUser(username, password, role) {
  const checkResponse = await fetch(`${API}/users?username=${username}`);
  const existing = await checkResponse.json();
  if (existing.length > 0) {
    return { success: false, error: 'Username already taken' };
  }
  const response = await fetch(`${API}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role })
  });
  if (response.ok) {
    return { success: true };
  } else {
    return { success: false, error: 'Registration failed' };
  }
}

export async function fetchBooks() {
  const response = await fetch(`${API}/books`);
  return response.json();
}

export async function addBook(title, author, genre, rating) {
  const response = await fetch(`${API}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, author, genre, rating: Number(rating), status: 'Available' })
  });
  return response.json();
}

export async function updateBook(id, bookData) {
  const response = await fetch(`${API}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  return response.json();
}

export async function patchBook(id, changes) {
  const response = await fetch(`${API}/books/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes)
  });
  return response.json();
}

export async function deleteBook(id) {
  await fetch(`${API}/books/${id}`, { method: 'DELETE' });
}

export async function fetchTransactions() {
  const response = await fetch(`${API}/transactions`);
  return response.json();
}

export async function addTransaction(bookId, bookTitle, username, action) {
  const response = await fetch(`${API}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookId: Number(bookId),
      bookTitle,
      username,
      action,
      timestamp: new Date().toISOString()
    })
  });
  return response.json();
}
