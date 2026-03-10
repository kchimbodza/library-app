// BookForm.jsx
// A form for librarians to add a new book to the library.
// Uses individual useState variables for each field — simple to follow.

import { useState } from 'react';
import {
  Box,        // Layout container
  Typography, // Styled text
  TextField,  // Text input
  Button,     // Submit button
  Paper,      // White card surface
  Alert,      // Success or error message
  Rating,     // Interactive star rating input
  Divider,    // A horizontal line
} from '@mui/material';

export default function BookForm({ onSubmit }) {
  // One state variable per form field
  const [title,  setTitle]  = useState(''); // Book title input
  const [author, setAuthor] = useState(''); // Book author input
  const [genre,  setGenre]  = useState(''); // Book genre input
  const [rating, setRating] = useState(0);  // Star rating (0 = none selected)

  // Messages to show above the form
  const [error,   setError]   = useState(''); // Shown in red if something is wrong
  const [success, setSuccess] = useState(''); // Shown in green after successful add

  // Called when the form is submitted
  async function handleSubmit(e) {
    e.preventDefault(); // Prevent the page from reloading
    setError('');        // Clear any previous error
    setSuccess('');      // Clear any previous success message

    // Validate: make sure all fields have values
    if (!title || !author || !genre || rating === 0) {
      setError('Please fill in all fields and select a rating');
      return; // Stop here — don't call onSubmit
    }

    // Call the onSubmit function passed in from LibraryPage
    await onSubmit({ title, author, genre, rating });

    // Show success message and clear the form
    setSuccess(`"${title}" has been added!`);
    setTitle('');
    setAuthor('');
    setGenre('');
    setRating(0);
  }

  return (
    // Paper gives the form a white card background with a shadow
    <Paper elevation={2} sx={{ p: 4, maxWidth: 600 }}>

      <Typography variant="h5" fontWeight="bold" mb={3}>
        Add New Book
      </Typography>

      {/* Show error alert if error state has text */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Show success alert if success state has text */}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* The form — onSubmit is triggered by the Submit button below */}
      <Box component="form" onSubmit={handleSubmit}>

        {/* Title input */}
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Update state on every keystroke
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Author input */}
        <TextField
          label="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Genre input */}
        <TextField
          label="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
        />

        {/* Rating — MUI Rating component lets the user click stars */}
        <Typography component="legend" color="text.secondary" mb={0.5}>
          Rating
        </Typography>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)} // newValue is the number of stars clicked
          size="large"
          sx={{ mb: 3 }}
        />

        {/* A horizontal line before the button */}
        <Divider sx={{ mb: 3 }} />

        {/* Submit button — type="submit" triggers the form's onSubmit handler */}
        <Button type="submit" variant="contained" size="large">
          Add Book
        </Button>

      </Box>
    </Paper>
  );
}
