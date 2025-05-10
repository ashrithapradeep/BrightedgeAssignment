import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

export default function UrlForm({ onSubmit }) {
  const [urls, setUrls] = useState("");

  const handleSubmit = () => {
    const urlList = urls
      .split(/\n|,/)
      .map((u) => u.trim())
      .filter(Boolean);

    if (urlList.length > 0) {
      onSubmit(urlList);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} mb={3}>
      <TextField
        label="Enter one or more URLs (newline or comma-separated)"
        variant="outlined"
        multiline
        rows={4}
        fullWidth
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Search
      </Button>
    </Box>
  );
}
