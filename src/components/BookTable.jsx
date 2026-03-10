// BookTable.jsx
// Displays all books in a table with search and genre filter controls.
// Each row has action buttons: Checkout / Return, and Edit / Delete for librarians.

import { useState } from 'react';
import {
  Box,              // Layout container
  Typography,       // Styled text
  TextField,        // Search input
  Select,           // Genre dropdown
  MenuItem,         // One option in the dropdown
  FormControl,      // Wrapper for Select + label
  InputLabel,       // Floating label for the Select
  Table,            // The table element
  TableBody,        // The rows section of the table
  TableCell,        // One cell in a row
  TableContainer,   // Scrollable wrapper around the table
  TableHead,        // The header row section
  TableRow,         // One row in the table
  Paper,            // White surface with shadow (used as TableContainer wrapper)
  Button,           // Clickable button
  Chip,             // Small pill label
  Rating,           // Star rating display
} from '@mui/material';

export default function BookTable({ books, currentUser, onCheckout, onReturn, onEdit, onDelete }) {
  const [search, setSearch]           = useState(''); // Tracks text typed in the search box
  const [genreFilter, setGenreFilter] = useState(''); // Tracks the selected genre (''' = All)

  const isLibrarian = currentUser.role === 'librarian'; // true if user can edit/delete

  // Build a list of unique genres from the books array (so we can populate the dropdown)
  const genres = [...new Set(books.map((b) => b.genre))];

  // Filter the books array based on the current search text and genre selection
  const filteredBooks = books.filter((book) => {
    // Check if book title or author contains the search text (case-insensitive)
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    // Check if book matches the selected genre (or all genres if '' is selected)
    const matchesGenre = genreFilter === '' || book.genre === genreFilter;

    // Only include the book if BOTH conditions pass
    return matchesSearch && matchesGenre;
  });

  return (
    <Box>
      {/* Section heading */}
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Book Catalogue
      </Typography>

      {/* ── SEARCH AND FILTER CONTROLS ── */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>

        {/* Search box — updates 'search' state on every keystroke */}
        <TextField
          label="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ width: 300 }}
        />

        {/* Genre filter dropdown */}
        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={genreFilter}
            label="Genre"
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <MenuItem value="">All Genres</MenuItem> {/* Empty string = no filter */}
            {genres.map((g) => (
              <MenuItem key={g} value={g}>{g}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* ── BOOKS TABLE ── */}
      <TableContainer component={Paper} elevation={2}>
        <Table>

          {/* Table header row */}
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

          {/* Table body — one row per book */}
          <TableBody>

            {/* If no books match the filter, show a message instead of rows */}
            {filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No books found
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow key={book.id} hover> {/* hover highlights the row on mouse-over */}

                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>

                  {/* Genre shown as a small outlined chip */}
                  <TableCell>
                    <Chip label={book.genre} size="small" variant="outlined" />
                  </TableCell>

                  {/* Star rating — readOnly means the user cannot change it here */}
                  <TableCell>
                    <Rating value={book.rating} readOnly size="small" />
                  </TableCell>

                  {/* Status chip — green for Available, orange for Checked Out */}
                  <TableCell>
                    <Chip
                      label={book.status}
                      color={book.status === 'Available' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>

                  {/* Action buttons */}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>

                      {/* Show Checkout if available, Return if already checked out */}
                      {book.status === 'Available' ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => onCheckout(book.id)}
                        >
                          Checkout
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="success"
                          size="small"
                          onClick={() => onReturn(book.id)}
                        >
                          Return
                        </Button>
                      )}

                      {/* Edit and Delete are only shown to librarians */}
                      {isLibrarian && (
                        <>
                          <Button
                            variant="outlined"
                            color="warning"
                            size="small"
                            onClick={() => onEdit(book)} // Pass the full book object to the parent
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => onDelete(book.id)}
                          >
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
