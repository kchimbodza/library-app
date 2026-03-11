import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Rating,
  Divider,
} from '@mui/material';

export default function BookForm({ onSubmit }) {
  const [title,   setTitle]   = useState('');
  const [author,  setAuthor]  = useState('');
  const [genre,   setGenre]   = useState('');
  const [rating,  setRating]  = useState(0);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !author || !genre || rating === 0) {
      setError('Please fill in all fields and select a rating');
      return;
    }

    await onSubmit({ title, author, genre, rating });

    setSuccess(`"${title}" has been added!`);
    setTitle('');
    setAuthor('');
    setGenre('');
    setRating(0);
  }

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 600 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Add New Book
      </Typography>

      {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
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
          sx={{ mb: 3 }}
        />

        <Typography component="legend" color="text.secondary" mb={0.5}>
          Rating
        </Typography>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          size="large"
          sx={{ mb: 3 }}
        />

        <Divider sx={{ mb: 3 }} />

        <Button type="submit" variant="contained" size="large">
          Add Book
        </Button>
      </Box>
    </Paper>
  );
}
