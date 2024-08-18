import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Grid,
  CircularProgress,
  Button,
} from "@mui/material";
import DocumentUpload from "./DocumentUpload";
import ChatBox from "./ChatBox";
import api from "../utils/api";

interface Document {
  id: number;
  title: string;
}

const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/documents/");
      if (Array.isArray(response.data)) {
        setDocuments(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Unexpected data format received from server");
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
      setError("Failed to fetch documents. Please try to logout.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        Document Dashboard
        <Button variant="contained" onClick={logout} sx={{ml: 2}} >
          Logout
        </Button>
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Documents
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : documents.length > 0 ? (
              <List>
                {documents.map((doc) => (
                  <ListItem
                    button
                    key={doc.id}
                    onClick={() => setSelectedDocument(doc)}
                    selected={selectedDocument?.id === doc.id}
                  >
                    <ListItemText primary={doc.title} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>
                No documents found. Upload one to get started!
              </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <DocumentUpload onUploadSuccess={fetchDocuments} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: "70vh" }}>
            {selectedDocument ? (
              <ChatBox document={selectedDocument} />
            ) : (
              <Typography variant="body1">
                Select a document to start chatting
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
