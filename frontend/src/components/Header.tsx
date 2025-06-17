import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";

const Header: React.FC = () => {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
    >
      <Toolbar>
        {/* Logo and Title */}
        <Box display="flex" alignItems="center">
          <CodeIcon sx={{ color: "#7e57c2", mr: 1, fontSize: 32 }} />
          <Box>
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: 700, color: "white", lineHeight: 1 }}
            >
              Codify<span style={{ color: "#7e57c2" }}>AI</span>
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary }}
            >
              Your Smart Code Reviewer
            </Typography>
          </Box>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation and Tagline */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            AI-Powered Code Analysis
          </Typography>
          <Button
  color="inherit"
  sx={{ textTransform: "none" }}
  component="a"
  href="https://github.com/scriptbyayush/AI-Powered-Code-Reviewer/blob/main/README.md"
  target="_blank"  // opens in new tab
  rel="noopener noreferrer"
>
  Docs
</Button>
         <Button
  color="inherit"
  sx={{ textTransform: "none" }}
  component="a"
  href="https://github.com/scriptbyayush"
  target="_blank"  // opens in new tab
  rel="noopener noreferrer"
>
  GitHub
</Button>
          
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
