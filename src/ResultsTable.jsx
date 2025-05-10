import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  Box,
  TextField,
  Button
} from "@mui/material";

function descendingComparator(a, b, orderBy) {
  if (+b[orderBy] < +a[orderBy]) return -1;
  if (+b[orderBy] > +a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  return [...array].sort(comparator);
}

export default function ResultsTable({ data }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [nameFilter, setNameFilter] = useState("");
  const [minValueFilter, setMinValueFilter] = useState("");

  if (!data || !data.record?.metrics) return null;

  const metrics = data.record.metrics;
  const rows = Object.keys(metrics).map((key) => ({
    name: key,
    value: metrics[key].percentiles?.p75 ,
  }));

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleClearFilters = () => {
    setNameFilter('');
    setMinValueFilter('');
  };

  // Apply filters
  const filteredRows = rows.filter((row) => {
    const matchesName = row.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const aboveThreshold =
      minValueFilter === "" || row.value >= parseFloat(+minValueFilter);
    return matchesName && aboveThreshold;
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Performance Metrics
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Filter by Metric Name"
          variant="outlined"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <TextField
          label="Min P75 Threshold"
          variant="outlined"
          type="number"
          value={minValueFilter}
          onChange={(e) => setMinValueFilter(e.target.value)}
        />
        <Button variant="outlined" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleSort("name")}
              >
                Metric
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "value"}
                direction={orderBy === "value" ? order : "asc"}
                onClick={() => handleSort("value")}
              >
                P75 Value
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stableSort(filteredRows, getComparator(order, orderBy)).map(
            (row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

  