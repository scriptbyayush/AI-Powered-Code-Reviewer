import React from "react";
import {
  Box,
  Typography,
  Link,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Grid,
  useTheme,
  Button,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CodeIcon from "@mui/icons-material/Code";
import JavaScriptIcon from "@mui/icons-material/IntegrationInstructions"; // substitute icon for JS
import ReactIcon from "@mui/icons-material/Sync"; // placeholder for React logo
import NodeIcon from "@mui/icons-material/SettingsEthernet"; // substitute icon for Node

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 3,
        mt: "auto",
        backgroundColor: "#121212",
        color: "#fff",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* Branding */}
        <Grid item xs={12} sm={4} textAlign="center">
          <Typography variant="h5" fontWeight={700}>
            Codify<span style={{ color: "#7e57c2" }}>AI</span>
          </Typography>
          <Typography variant="body2" color="gray" mt={1}>
            Smart Code Feedback in Seconds
          </Typography>
        </Grid>

        {/* Navigation */}
        <Grid item xs={12} sm={4} textAlign="center">
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Navigate
          </Typography>
          <Stack direction="column" spacing={1}>
            
            <Link href="https://github.com/scriptbyayush/AI-Powered-Code-Reviewer/blob/main/README.md"  target="_blank" underline="hover" color="inherit">
              About
            </Link>
            <Link href="https://www.linkedin.com/in/ayush-vaidya-7521b9319/" target="_blank" underline="hover" color="inherit">
              Contact
            </Link>
            <Link
              href="https://github.com/scriptbyayush/AI-Powered-Code-Reviewer/blob/main/README.md"
              underline="hover"
              color="inherit"
              target="_blank"
            >
              Docs / API
            </Link>
          </Stack>
        </Grid>

        {/* Social Icons */}
        <Grid item xs={12} sm={4} textAlign="center">
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Connect
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Tooltip title="GitHub">
              <IconButton
                color="inherit"
                href="https://github.com/scriptbyayush"
                target="_blank"
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="LinkedIn">
              <IconButton
                color="inherit"
                href="https://linkedin.com/in/scriptbyayush"
                target="_blank"
              >
                <LinkedInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Email">
  <IconButton
    color="inherit"
    component="a"
    href="mailto:ayush.pict@gmail.com"
  >
    <EmailIcon />
  </IconButton>
</Tooltip>

            
          </Stack>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider
        sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)", width: "100%" }}
      />

      {/* Credits + Stack */}
      <Stack spacing={1} alignItems="center">
        <Typography variant="caption" color="gray">
          Built with{" "}
          <FavoriteIcon
            fontSize="inherit"
            sx={{ color: "#e57373", verticalAlign: "middle" }}
          />{" "}
          using React, Node.js, and Gemini API
        </Typography>
        <Typography variant="caption" color="gray">
          Version 1.0.0 – Last updated: June 2025
        </Typography>
        <Typography variant="caption" color="gray">
          ⭐ Available on GitHub
        </Typography>
      </Stack>

      {/* Stack Icons */}
      <Stack
        direction="row"
        spacing={3}
        justifyContent="center"
        alignItems="center"
        mt={3}
      >
        <Tooltip title="JavaScript">
          <JavaScriptIcon sx={{ color: "#f7df1e" }} />
        </Tooltip>
        <Tooltip title="React">
          <ReactIcon sx={{ color: "#61dafb" }} />
        </Tooltip>
        <Tooltip title="Node.js">
          <NodeIcon sx={{ color: "#68a063" }} />
        </Tooltip>
      </Stack>

      {/* Optional Quote */}
      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        display="block"
        mt={3}
        fontStyle="italic"
      >
        // May your semicolons always be at the right place.
      </Typography>

      {/* Made By */}
      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        display="block"
        mt={1}
      >
        © {new Date().getFullYear()} CodifyAI — Powered by Gemini 🚀 by{" "}
        <Link
          href="https://github.com/scriptbyayush"
          color="inherit"
          underline="hover"
        >
          Ayush Vaidya
        </Link>
        . All rights reserved.
      </Typography>

      {/* Policy Links */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
        <Link href="#privacy" underline="hover" color="inherit">
          Privacy Policy
        </Link>
        <Link href="#terms" underline="hover" color="inherit">
          Terms of Service
        </Link>
      </Stack>
    </Box>
  );
};

export default Footer;
