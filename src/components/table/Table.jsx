import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function GlobalTable({
  columns,
  rows = [],
  onScroll,
  isLoading,
  isFetchingNextPage,
  isError,
  emptyMessage = "No data found",
}) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ height: "calc(100vh - 300px)", overflowY: "auto" }}
      onScroll={onScroll}
    >
      <Table stickyHeader>
        <TableHead sx={{ bgcolor: "#dee1ec" }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key}>{col.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    py: 3,
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Typography color="error" textAlign="center" py={2}>
                  Error loading data
                </Typography>
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Typography textAlign="center" py={2}>
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow key={row.id ?? index} hover>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}

          {isFetchingNextPage && rows.length > 0 && (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    py: 2,
                  }}
                >
                  <CircularProgress size={20} />
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}