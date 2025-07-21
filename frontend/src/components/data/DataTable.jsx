import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const DataTable = ({
  columns = [],
  rows = [],
  onRowClick, // ✅ optional row click handler
  dense = false, // ✅ compact mode option
  noDataMessage = "No data available",
}) => {
  return (
    <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
      <Table size={dense ? "small" : "medium"}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.field} sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                <Typography variant="body2" fontWeight="bold">
                  {col.headerName}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <TableRow
                key={row._id || rowIndex}
                hover
                onClick={() => onRowClick && onRowClick(row)}
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col.field} sx={{ whiteSpace: "nowrap" }}>
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
                <Typography variant="body2" color="text.secondary">
                  {noDataMessage}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
