import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Tabs,
  Tab,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import BookTable from './BookTable';
import BookForm from './BookForm';
import EditDialog from './EditDialog';
import TransactionHistory from './TransactionHistory';
import {
  fetchBooks,
  fetchTransactions,
  addBook,
  updateBook,
  patchBook,
  deleteBook,
  addTransaction,
} from '../api';

export default function LibraryPage({ currentUser, onLogout }) {
  const [books, setBooks]               = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState(0);
  const [bookToEdit, setBookToEdit]     = useState(null);
  const [snackMessage, setSnackMessage] = useState('');

  const isLibrarian = currentUser.role === 'librarian';

  useEffect(() => {
    async function loadData() {
      const booksData = await fetchBooks();
      const txData    = await fetchTransactions();
      setBooks(booksData);
      setTransactions(txData);
      setLoading(false);
    }
    loadData();
  }, []);

  async function handleCheckout(bookId) {
    const book = books.find((b) => b.id === bookId);
    await patchBook(bookId, { status: 'Checked Out' });
    const newTx = await addTransaction(bookId, book.title, currentUser.username, 'Checkout');
    setBooks(books.map((b) => (b.id === bookId ? { ...b, status: 'Checked Out' } : b)));
    setTransactions([...transactions, newTx]);
    setSnackMessage(`"${book.title}" checked out!`);
  }

  async function handleReturn(bookId) {
    const book = books.find((b) => b.id === bookId);
    await patchBook(bookId, { status: 'Available' });
    const newTx = await addTransaction(bookId, book.title, currentUser.username, 'Return');
    setBooks(books.map((b) => (b.id === bookId ? { ...b, status: 'Available' } : b)));
    setTransactions([...transactions, newTx]);
    setSnackMessage(`"${book.title}" returned!`);
  }

  async function handleDelete(bookId) {
    const book = books.find((b) => b.id === bookId);
    await deleteBook(bookId);
    setBooks(books.filter((b) => b.id !== bookId));
    setSnackMessage(`"${book.title}" deleted.`);
  }

  async function handleAddBook(formData) {
    const newBook = await addBook(formData.title, formData.author, formData.genre, formData.rating);
    setBooks([...books, newBook]);
    setSnackMessage(`"${formData.title}" added!`);
  }

  async function handleEditSave(formData) {
    const updated = { ...bookToEdit, ...formData };
    await updateBook(bookToEdit.id, updated);
    setBooks(books.map((b) => (b.id === bookToEdit.id ? updated : b)));
    setBookToEdit(null);
    setSnackMessage(`"${formData.title}" updated!`);
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            📚 Library App
          </Typography>
          <Chip
            label={currentUser.username}
            sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
          <Chip
            label={currentUser.role}
            color="secondary"
            sx={{ mr: 2, fontWeight: 'bold', textTransform: 'capitalize' }}
          />
          <Button color="inherit" onClick={onLogout} startIcon={<Logout />}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Books" />
          {isLibrarian && <Tab label="Add Book" />}
          <Tab label="History" />
        </Tabs>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {activeTab === 0 && (
          <BookTable
            books={books}
            currentUser={currentUser}
            onCheckout={handleCheckout}
            onReturn={handleReturn}
            onEdit={(book) => setBookToEdit(book)}
            onDelete={handleDelete}
          />
        )}

        {activeTab === 1 && isLibrarian && (
          <BookForm onSubmit={handleAddBook} />
        )}

        {/* History tab index is 2 for librarians (who have the Add Book tab) and 1 for regular users */}
        {((isLibrarian && activeTab === 2) || (!isLibrarian && activeTab === 1)) && (
          <TransactionHistory transactions={transactions} />
        )}
      </Container>

      <EditDialog
        book={bookToEdit}
        onClose={() => setBookToEdit(null)}
        onSave={handleEditSave}
      />

      <Snackbar
        open={snackMessage !== ''}
        autoHideDuration={3000}
        onClose={() => setSnackMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackMessage('')}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
