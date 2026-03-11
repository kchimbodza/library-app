import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';

export default function TransactionHistory({ transactions }) {
  const sorted = [...transactions].reverse();

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Transaction History
      </Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
            <TableRow>
              <TableCell><strong>Action</strong></TableCell>
              <TableCell><strong>Book</strong></TableCell>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>Time</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No transactions yet
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((t, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Chip
                      label={t.action}
                      color={t.action === 'Checkout' ? 'primary' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{t.bookTitle}</TableCell>
                  <TableCell>{t.username}</TableCell>
                  <TableCell>{new Date(t.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
