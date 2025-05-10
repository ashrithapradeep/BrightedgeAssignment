import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function MultiResultsTable({ results }) {
  if (!results || Object.keys(results).length === 0) return null;

  // Step 1: Collect all unique metric names
  const metricSet = new Set();
  Object.values(results).forEach((res) => {
    const metrics = res?.record?.metrics;
    if (!metrics) return;
    Object.keys(metrics).forEach((metric) => metricSet.add(metric));
  });

  const metricList = Array.from(metricSet);

  const rows = metricList.map((metric) => {
    const row = { metric };
    let sum = 0;
    let count = 0;

    for (const [url, res] of Object.entries(results)) {
      const p75 = +res?.record?.metrics?.[metric]?.percentiles?.p75;
      if (typeof p75 === "number") {
        row[url] = p75;
        sum += p75;
        count += 1;
      } else {
        row[url] = "—";
      }
    }

    row.sum = sum;
    row.avg = sum / count;
    return row;
  });

  const urls = Object.keys(results);

  return (
    <Paper sx={{ p: 1 }}>
      <Typography variant="h6" gutterBottom>
        CrUX Metrics (All URLs)
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Metric</strong></TableCell>
            {urls.map((url) => (
              <TableCell key={url}><strong>{new URL(url).hostname}</strong></TableCell>
            ))}
            <TableCell>
              <strong>Sum</strong>
            </TableCell>
            <TableCell>
              <strong>Avg</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.metric}>
              <TableCell>{row.metric}</TableCell>
              {urls.map((url) => (
                <TableCell key={url}>{row[url]}</TableCell>
              ))}

              <TableCell>
                {Math.round(row.sum)}
              </TableCell>
              <TableCell>
                {Math.round(row.avg)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
