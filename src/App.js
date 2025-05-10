import { useState } from "react";
import { Container, Typography, CircularProgress } from "@mui/material";
import UrlForm from "./UrlForm";
import ResultsTable from "./ResultsTable";
import MultiResultsTable from "./MultiResultsTable";
import { fetchCruxData } from "./api";

export default function App() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSearch = async (urls) => {
    setLoading(true);
    setResults({});
    const allResults = {};
    for (const url of urls) {
      try {
        const res = await fetchCruxData(url);
        allResults[url] = res;
      } catch (e) {
        allResults[url] = { error: "Failed to fetch data" };
      }
    }
    setResults(allResults);
    setLoading(false);
  };

  const urlCount = Object.keys(results).length;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        CrUX Report Viewer
      </Typography>
      <UrlForm onSubmit={handleSearch} />
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {urlCount === 1 ? (
            <ResultsTable data={Object.values(results)[0]} />
          ) : urlCount > 1 ? (
            <MultiResultsTable results={results} />
          ) : null}
        </>
      )}
    </Container>
  );
}
