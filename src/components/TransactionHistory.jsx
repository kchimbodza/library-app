// TransactionHistory.jsx
// Displays a table of all checkout and return events.
// Newest transactions are shown first.

import {
  Box,          // Layout container
  Typography,   // Styled heading
  Table,        // Table element
  TableBody,    // The rows section
  TableCell,    // One cell in a row
  TableContainer, // Scrollable wrapper
  TableHead,    // Header row section
  TableRow,     // One row
  Paper,        // White card surface
  Chip,         // Coloured pill label for the action type
} from '@mui/material';

export default function TransactionHistory({ transactions }) {
  // Reverse the array so the newest transaction appears at the top
  // We use [...transactions] to make a copy first — we should not mutate the original array
  const sorted = [...transactions].reverse();

  return (
    <Box>
      {/* Section heading */}
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Transaction History
      </Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table>

          {/* Table header */}
          <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
            <TableRow>
              <TableCell><strong>Action</strong></TableCell>
              <TableCell><strong>Book</strong></TableCell>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>Time</strong></TableCell>
            </TableRow>
          </TableHead>

          {/* Table body */}
          <TableBody>

            {/* If no transactions exist yet, show a placeholder message */}
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No transactions yet
                </TableCell>
              </TableRow>
            ) : (
              // Loop through sorted transactions and create one row per transaction
              sorted.map((t, index) => (
                // We use the array index as the key because transactions have no unique id field
                <TableRow key={index} hover>

                  {/* Action chip — blue for Checkout, green for Return */}
                  <TableCell>
                    <Chip
                      label={t.action}
                      color={t.action === 'Checkout' ? 'primary' : 'success'}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>{t.bookTitle}</TableCell>  {/* Name of the book */}
                  <TableCell>{t.username}</TableCell>   {/* Who did the action */}

                  {/* Convert the ISO timestamp string to a readable local date/time */}
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
