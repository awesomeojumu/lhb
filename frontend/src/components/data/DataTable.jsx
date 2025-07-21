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

const DataTable = ({ columns = [], rows = [] }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.field}>
                <Typography fontWeight="bold">{col.headerName}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((col) => (
                  <TableCell key={col.field}>
                    {col.renderCell ? col.renderCell(row[col.field], row) : row[col.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
