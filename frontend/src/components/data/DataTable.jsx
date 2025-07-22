import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  Box,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const DataTable = ({
  columns = [],
  rows = [],
  onRowClick,
  dense = false,
  noDataMessage = "No data available",
  searchable = true,
  paginated = true,
}) => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // ✅ Auto-dense for mobile

  // ✅ Search filtering
  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return rows;
    return rows.filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }, [searchText, rows]);

  // ✅ Pagination
  const paginatedRows = paginated
    ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredRows;

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        p: { xs: 1, sm: 2 }, // ✅ Padding adjusts for small screens
      }}
    >
      {/* ✅ Global Search Bar */}
      {searchable && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: { xs: "flex-start", sm: "flex-end" },
            width: "100%",
          }}
        >
          <TextField
            size="small"
            fullWidth={isMobile}
            placeholder="Search..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(0);
            }}
            sx={{
              maxWidth: isMobile ? "100%" : 300,
            }}
          />
        </Box>
      )}

      {/* ✅ Table Container (Horizontal Scroll on Small Screens) */}
      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: 2,
          },
        }}
      >
        <Table
          stickyHeader
          size={isMobile || dense ? "small" : "medium"}
          sx={{
            minWidth: 600, // ✅ Ensures scroll appears naturally for small devices
            tableLayout: "auto",
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    minWidth: { xs: 100, sm: 120 }, // ✅ Responsive column width
                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                  >
                    {col.headerName}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, rowIndex) => (
                <TableRow
                  key={row._id || rowIndex}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.field}
                      sx={{
                        whiteSpace: "nowrap",
                        minWidth: { xs: 100, sm: 120 },
                        fontSize: { xs: "0.75rem", sm: "0.85rem" },
                      }}
                    >
                      {col.renderCell
                        ? col.renderCell(row[col.field], row)
                        : row[col.field] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.9rem" } }}
                  >
                    {noDataMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Pagination Controls */}
      {paginated && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{
            "& .MuiTablePagination-toolbar": {
              flexWrap: { xs: "wrap", sm: "nowrap" }, // ✅ Wraps on mobile
              justifyContent: "center",
            },
            "& .MuiTablePagination-displayedRows": {
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
            },
          }}
        />
      )}
    </Paper>
  );
};

export default DataTable;
