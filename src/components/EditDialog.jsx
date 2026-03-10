// EditDialog.jsx
// A pop-up dialog for editing an existing book.
// It receives the book to edit as a prop. When book is null, the dialog is hidden.

import { useState, useEffect } from 'react';
import {
  Dialog,         // The pop-up overlay
  DialogTitle,    // The title bar of the dialog
  DialogContent,  // The body of the dialog
  DialogActions,  // The footer where action buttons go
  TextField,      // Text input
  Button,         // Cancel and Save buttons
  Typography,     // Text for the Rating label
  Rating,         // Star rating input
  Alert,          // Error message
} from '@mui/material';

export default function EditDialog({ book, onClose, onSave }) {
  // Form state — one variable per field
  const [title,  setTitle]  = useState('');
  const [author, setAuthor] = useState('');
  const [genre,  setGenre]  = useState('');
  const [rating, setRating] = useState(0);
  const [error,  setError]  = useState(''); // Error message if Save is clicked with empty fields

  // useEffect watches the 'book' prop
  // Whenever a new book is passed in (dialog opens), fill the form with that book's data
  useEffect(() => {
    if (book) {
      setTitle(book.title);   // Pre-fill title
      setAuthor(book.author); // Pre-fill author
      setGenre(book.genre);   // Pre-fill genre
      setRating(book.rating); // Pre-fill rating
      setError('');           // Clear any previous error
    }
  }, [book]); // Run this effect every time the 'book' prop changes

  // Called when the Save button is clicked
  function handleSave() {
    // Check all fields are filled
    if (!title || !author || !genre || rating === 0) {
      setError('Please fill in all fields');
      return; // Stop here
    }
    // Call onSave with the updated values
    onSave({ title, author, genre, rating });
  }

  return (
    // open={book !== null} means the dialog is visible only when a book is selected
    <Dialog open={book !== null} onClose={onClose} fullWidth maxWidth="sm">

      <DialogTitle>Edit Book</DialogTitle>

      {/* DialogContent is the main body of the pop-up */}
      <DialogContent sx={{ pt: 2 }}>

        {/* Show error if validation fails */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* sx={{ mt: 1 }} adds a small top margin so the field doesn't touch DialogTitle */}
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          sx={{ mb: 2, mt: 1 }}
        />

        <TextField
          label="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Rating label and star input */}
        <Typography color="text.secondary" mb={0.5}>Rating</Typography>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          size="large"
        />

      </DialogContent>

      {/* DialogActions holds the Cancel and Save buttons at the bottom */}
      <DialogActions sx={{ px: 3, pb: 2 }}>

        {/* Cancel closes the dialog without saving */}
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>

        {/* Save validates and calls onSave */}
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>

      </DialogActions>
    </Dialog>
  );
}
