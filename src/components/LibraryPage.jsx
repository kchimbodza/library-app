// LibraryPage.jsx
// The main screen after login.
// Shows an AppBar at the top, Tabs to switch sections, and loads books + transactions from the server.

import { useState, useEffect } from 'react';
import {
  AppBar,       // The blue bar at the top of the page
  Toolbar,      // Provides padding and layout inside AppBar
  Typography,   // Styled text
  Button,       // Clickable button
  Box,          // General layout container
  Container,    // A centred, max-width wrapper for page content
  Tabs,         // Tab bar
  Tab,          // One tab
  Chip,         // A small pill-shaped label (used to show username and role)
  Snackbar,     // A pop-up notification at the bottom of the screen
  Alert,        // The coloured message inside the Snackbar
  CircularProgress, // A spinning loading indicator
} from '@mui/material';
import { Logout } from '@mui/icons-material'; // Logout icon from MUI icons
import BookTable from './BookTable';           // Component that shows the list of books
import BookForm from './BookForm';             // Component with the Add Book form
import EditDialog from './EditDialog';         // Pop-up dialog for editing a book
import TransactionHistory from './TransactionHistory'; // Component that shows checkout history
import {
  fetchBooks,
  fetchTransactions,
  addBook,
  updateBook,
  patchBook,
  deleteBook,
  addTransaction,
} from '../api'; // All our API functions

export default function LibraryPage({ currentUser, onLogout }) {
  const [books, setBooks]             = useState([]);    // Array of all books from the server
  const [transactions, setTransactions] = useState([]); // Array of all transactions
  const [loading, setLoading]         = useState(true);  // true while data is being fetched
  const [activeTab, setActiveTab]     = useState(0);     // Which tab is currently selected
  const [bookToEdit, setBookToEdit]   = useState(null);  // The book being edited (null = dialog closed)
  const [snackMessage, setSnackMessage] = useState('');  // Message to show in the Snackbar

  // true if the logged-in user is a librarian (librarians can add, edit, delete)
  const isLibrarian = currentUser.role === 'librarian';

  // useEffect runs once when this component first appears on screen
  // It loads books and transactions from the server
  useEffect(() => {
    async function loadData() {
      const booksData = await fetchBooks();        // Get books from server
      const txData    = await fetchTransactions(); // Get transactions from server
      setBooks(booksData);                         // Save books into state
      setTransactions(txData);                     // Save transactions into state
      setLoading(false);                           // Hide the loading spinner
    }
    loadData(); // Call the function immediately
  }, []); // [] = run only once on mount

  // Called when the user clicks "Checkout" on a book
  async function handleCheckout(bookId) {
    const book = books.find((b) => b.id === bookId);           // Find the book by id
    await patchBook(bookId, { status: 'Checked Out' });        // Update status on server
    const newTx = await addTransaction(bookId, book.title, currentUser.username, 'Checkout'); // Save transaction
    setBooks(books.map((b) => b.id === bookId ? { ...b, status: 'Checked Out' } : b)); // Update local state
    setTransactions([...transactions, newTx]);                 // Add transaction to local list
    setSnackMessage(`"${book.title}" checked out!`);           // Show toast notification
  }

  // Called when the user clicks "Return" on a book
  async function handleReturn(bookId) {
    const book = books.find((b) => b.id === bookId);
    await patchBook(bookId, { status: 'Available' });          // Set status back to Available
    const newTx = await addTransaction(bookId, book.title, currentUser.username, 'Return');
    setBooks(books.map((b) => b.id === bookId ? { ...b, status: 'Available' } : b));
    setTransactions([...transactions, newTx]);
    setSnackMessage(`"${book.title}" returned!`);
  }

  // Called when a librarian clicks "Delete" on a book
  async function handleDelete(bookId) {
    const book = books.find((b) => b.id === bookId);
    await deleteBook(bookId);                                  // Delete from server
    setBooks(books.filter((b) => b.id !== bookId));            // Remove from local list
    setSnackMessage(`"${book.title}" deleted.`);
  }

  // Called when the Add Book form is submitted
  async function handleAddBook(formData) {
    const newBook = await addBook(formData.title, formData.author, formData.genre, formData.rating);
    setBooks([...books, newBook]);                             // Add new book to local list
    setSnackMessage(`"${formData.title}" added!`);
  }

  // Called when the Edit dialog's Save button is clicked
  async function handleEditSave(formData) {
    const updated = { ...bookToEdit, ...formData };            // Merge old data with new form data
    await updateBook(bookToEdit.id, updated);                  // Save to server
    setBooks(books.map((b) => b.id === bookToEdit.id ? updated : b)); // Update local list
    setBookToEdit(null);                                       // Close the dialog
    setSnackMessage(`"${formData.title}" updated!`);
  }

  // Show a spinner while data is loading
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress /> {/* Spinning circle */}
      </Box>
    );
  }

  return (
    <Box>
      {/* ── TOP NAVIGATION BAR ── */}
      <AppBar position="static">
        <Toolbar>
          {/* App name on the left. flexGrow: 1 pushes everything else to the right */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            📚 Library App
          </Typography>

          {/* Show the logged-in username as a Chip */}
          <Chip
            label={currentUser.username}
            sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />

          {/* Show the user's role as a coloured Chip */}
          <Chip
            label={currentUser.role}
            color="secondary"
            sx={{ mr: 2, fontWeight: 'bold', textTransform: 'capitalize' }}
          />

          {/* Sign Out button — calls onLogout which clears the user in App.jsx */}
          <Button color="inherit" onClick={onLogout} startIcon={<Logout />}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      {/* ── TAB BAR ── switches between sections */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Books" />
          {/* Only show "Add Book" tab if the user is a librarian */}
          {isLibrarian && <Tab label="Add Book" />}
          <Tab label="History" />
        </Tabs>
      </Box>

      {/* ── PAGE CONTENT ── changes based on the active tab */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>

        {/* Tab 0: Books table */}
        {activeTab === 0 && (
          <BookTable
            books={books}
            currentUser={currentUser}
            onCheckout={handleCheckout}
            onReturn={handleReturn}
            onEdit={(book) => setBookToEdit(book)} // Open the edit dialog with this book
            onDelete={handleDelete}
          />
        )}

        {/* Tab 1 (librarian only): Add Book form */}
        {activeTab === 1 && isLibrarian && (
          <BookForm onSubmit={handleAddBook} />
        )}

        {/* History tab — index is 2 for librarians (who have the Add tab), 1 for regular users */}
        {((isLibrarian && activeTab === 2) || (!isLibrarian && activeTab === 1)) && (
          <TransactionHistory transactions={transactions} />
        )}

      </Container>

      {/* ── EDIT DIALOG ── pops up when bookToEdit is not null */}
      <EditDialog
        book={bookToEdit}
        onClose={() => setBookToEdit(null)} // Close by setting bookToEdit back to null
        onSave={handleEditSave}
      />

      {/* ── SNACKBAR ── toast notification at the bottom of the screen */}
      <Snackbar
        open={snackMessage !== ''}           // Show when there is a message
        autoHideDuration={3000}              // Automatically hide after 3 seconds
        onClose={() => setSnackMessage('')}  // Clear the message when it closes
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackMessage('')}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
