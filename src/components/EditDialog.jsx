import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Rating,
  Alert,
} from '@mui/material';

export default function EditDialog({ book, onClose, onSave }) {
  const [title,  setTitle]  = useState('');
  const [author, setAuthor] = useState('');
  const [genre,  setGenre]  = useState('');
  const [rating, setRating] = useState(0);
  const [error,  setError]  = useState('');

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setGenre(book.genre);
      setRating(book.rating);
      setError('');
    }
  }, [book]);

  function handleSave() {
    if (!title || !author || !genre || rating === 0) {
      setError('Please fill in all fields');
      return;
    }
    onSave({ title, author, genre, rating });
  }

  return (
    <Dialog open={book !== null} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Book</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
        <Typography color="text.secondary" mb={0.5}>Rating</Typography>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          size="large"
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
