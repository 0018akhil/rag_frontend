import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Button, Typography, Paper, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import api from "../utils/api";

interface ChatMessage {
  id: number;
  content: string;
  sender: "user" | "ai";
}

interface ChatBoxProps {
  document: { id: number; title: string };
}

const ChatBox: React.FC<ChatBoxProps> = ({ document }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
  }, [document]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (input.trim()) {
      setIsLoading(true);
      const userMessage: ChatMessage = {
        id: Date.now(),
        content: input,
        sender: "user",
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      try {
        const response = await api.post("/chat", {
          document_id: document.id,
          message: input,
        });
        const aiMessage: ChatMessage = {
          id: Date.now() + 1,
          content: response.data.reply,
          sender: "ai",
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Failed to get AI response", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" gutterBottom>
        Chat with: {document.title}
      </Typography>
      <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2 }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: "flex",
              justifyContent:
                message.sender === "user" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Paper
              key={message.id}
              elevation={1}
              sx={{
                p: 1,
                mb: 1,
                maxWidth: "70%",
                color: "white",
                backgroundColor:
                  message.sender === "user"
                    ? "primary.light"
                    : "secondary.light",
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={isLoading}
          sx={{ ml: 1, minWidth: "90px", height: "56px" }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <>
              Send
              <SendIcon sx={{ ml: 1 }} />
            </>
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
