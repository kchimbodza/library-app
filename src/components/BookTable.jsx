import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Rating,
} from '@mui/material';

export default function BookTable({ books, currentUser, onCheckout, onReturn, onEdit, onDelete }) {
  const [search, setSearch]           = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  const isLibrarian = currentUser.role === 'librarian';
  const genres = [...new Set(books.map((b) => b.genre))];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter === '' || book.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Book Catalogue
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ width: 300 }}
        />
        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={genreFilter}
            label="Genre"
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <MenuItem value="">All Genres</MenuItem>
            {genres.map((g) => (
              <MenuItem key={g} value={g}>{g}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Author</strong></TableCell>
              <TableCell><strong>Genre</strong></TableCell>
              <TableCell><strong>Rating</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No books found
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow key={book.id} hover>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <Chip label={book.genre} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Rating value={book.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={book.status}
                      color={book.status === 'Available' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {book.status === 'Available' ? (
                        <Button variant="contained" size="small" onClick={() => onCheckout(book.id)}>
                          Checkout
                        </Button>
                      ) : (
                        <Button variant="outlined" color="success" size="small" onClick={() => onReturn(book.id)}>
                          Return
                        </Button>
                      )}
                      {isLibrarian && (
                        <>
                          <Button variant="outlined" color="warning" size="small" onClick={() => onEdit(book)}>
                            Edit
                          </Button>
                          <Button variant="outlined" color="error" size="small" onClick={() => onDelete(book.id)}>
                            Delete
                          </Button>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
