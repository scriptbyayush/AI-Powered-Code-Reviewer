// App.tsx (500 lines, full UI/UX enhancements, no language select)
import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  IconButton,
  Fab,
  Tooltip,
  Drawer,
  Switch,
  FormControlLabel,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CodeEditor from "./components/CodeEditor";
import CodeOutput from "./components/CodeOutput";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { analyzeCode } from "./services/api";
import { motion, AnimatePresence } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PaletteIcon from "@mui/icons-material/Palette";
import CloseIcon from "@mui/icons-material/Close";
import ExampleIcon from "@mui/icons-material/AutoAwesome";
import "./App.css";

// Example code presets for quick loading
const EXAMPLES = [
  {
    label: "Hello World (JS)",
    code: `// Hello World in JavaScript
console.log("Hello, world!");`,
  },
  {
    label: "Factorial (Python)",
    code: `# Factorial in Python
def factorial(n):
    return 1 if n==0 else n*factorial(n-1)
print(factorial(5))`,
  },
  {
    label: "FizzBuzz (JS)",
    code: `// FizzBuzz in JavaScript
for(let i=1;i<=15;i++){
  let out="";
  if(i%3===0)out+="Fizz";
  if(i%5===0)out+="Buzz";
  console.log(out||i);
}`,
  },
];

// Theme customizer defaults
const defaultThemeSettings = {
  mode: "dark",
  primary: "#7e57c2",
  secondary: "#4db6ac",
  font: "Roboto",
  editorTheme: "dracula",
};

function getInitialTheme() {
  const saved = localStorage.getItem("themeSettings");
  return saved ? JSON.parse(saved) : defaultThemeSettings;
}

function getInitialCode() {
  const params = new URLSearchParams(window.location.search);
  const codeParam = params.get("code");
  if (codeParam) {
    try {
      return decodeURIComponent(codeParam);
    } catch (e) {
      console.error("Malformed code param in URL", e);
      return "// Paste your code here to analyze...";
    }
  }
  const saved = localStorage.getItem("lastCode");
  return saved || "// Paste your code here to analyze...";
}


function App() {
  // --- State ---
  const [code, setCode] = useState<string>(getInitialCode());
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; msg: string; type: "success" | "error" }>({
    open: false,
    msg: "",
    type: "success",
  });
  const [themeSettings, setThemeSettings] = useState(getInitialTheme());
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [editorHeight, setEditorHeight] = useState(350);
  const [outputHeight, setOutputHeight] = useState(350);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [exampleDrawerOpen, setExampleDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem("lastCode", code);
    window.history.replaceState(
      {},
      "",
      `?code=${encodeURIComponent(code)}`
    );
  }, [code]);

  useEffect(() => {
    localStorage.setItem("themeSettings", JSON.stringify(themeSettings));
  }, [themeSettings]);

  // --- Theme ---
  const theme = createTheme({
    palette: {
      mode: themeSettings.mode as "dark" | "light",
      primary: { main: themeSettings.primary },
      secondary: { main: themeSettings.secondary },
      background: {
        default: themeSettings.mode === "dark" ? "#121212" : "#f7f7fa",
        paper: themeSettings.mode === "dark" ? "rgba(30,30,30,0.7)" : "rgba(255,255,255,0.7)",
      },
    },
    typography: {
      fontFamily: themeSettings.font,
      h4: { fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
          },
        },
      },
    },
  });

  // --- Handlers ---
  const handleCodeChange = (newCode: string) => setCode(newCode);

  const handleAnalyzeClick = async () => {
    if (!code.trim() || code === "// Paste your code here to analyze...") {
      setError("Please enter some code to analyze");
      setSnackbar({ open: true, msg: "Please enter some code!", type: "error" });
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // Backend expects only one argument
      const result = await analyzeCode(code);
      setOutput(result);
      setSnackbar({ open: true, msg: "Code analyzed successfully!", type: "success" });
    } catch (err) {
      setError("Error analyzing code. Please try again.");
      setSnackbar({ open: true, msg: "Analysis failed. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // FAB Actions
  const handleFabAction = (action: string) => {
    if (action === "clear") setCode("");
    if (action === "upload") document.getElementById("file-upload")?.click();
    if (action === "example") setExampleDrawerOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setCode(ev.target?.result as string);
      reader.readAsText(file);
    }
  };

  // --- Render ---
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: themeSettings.mode === "dark"
            ? "linear-gradient(135deg,#1f1c2c 0%,#928dab 100%)"
            : "linear-gradient(135deg,#f7f7fa 0%,#e3e3e3 100%)",
          transition: "background 0.7s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <Header />
       <Typography variant="body2" sx={{ color: "#666", mb: 4 }}>
  <br />
  <br />
  <br />
  <br />
</Typography>


        {/* Floating Action Button */}
        <Box sx={{ position: "fixed", bottom: 32, right: 32, zIndex: 2000 }}>
          <Tooltip title="Quick Actions">
            <Fab color="primary" aria-label="actions" onClick={() => setDrawerOpen(true)}>
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>

        {/* FAB Drawer */}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 260, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Button
              startIcon={<ClearIcon />}
              fullWidth
              sx={{ mb: 1 }}
              onClick={() => { setCode(""); setDrawerOpen(false); }}
            >
              Clear Code
            </Button>
            <Button
              startIcon={<UploadFileIcon />}
              fullWidth
              component="label"
              sx={{ mb: 1 }}
            >
              Upload File
              <input
                id="file-upload"
                type="file"
                accept=".js,.py,.txt"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            <Button
              startIcon={<ExampleIcon />}
              fullWidth
              sx={{ mb: 1 }}
              onClick={() => { setExampleDrawerOpen(true); setDrawerOpen(false); }}
            >
              Load Example
            </Button>
            <Button
              startIcon={<PaletteIcon />}
              fullWidth
              sx={{ mb: 1 }}
              onClick={() => { setCustomizerOpen(true); setDrawerOpen(false); }}
            >
              Theme Customizer
            </Button>
          </Box>
        </Drawer>

        {/* Theme Customizer Panel */}
        <Drawer anchor="left" open={customizerOpen} onClose={() => setCustomizerOpen(false)}>
          <Box sx={{ width: 320, p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Theme Customizer</Typography>
              <IconButton onClick={() => setCustomizerOpen(false)}><CloseIcon /></IconButton>
            </Box>
            <Box mt={2}>
              <Typography gutterBottom>Primary Color</Typography>
              <input
                type="color"
                value={themeSettings.primary}
                onChange={e => setThemeSettings({ ...themeSettings, primary: e.target.value })}
                style={{ width: 40, height: 40, border: "none", background: "none" }}
              />
            </Box>
            <Box mt={2}>
              <Typography gutterBottom>Secondary Color</Typography>
              <input
                type="color"
                value={themeSettings.secondary}
                onChange={e => setThemeSettings({ ...themeSettings, secondary: e.target.value })}
                style={{ width: 40, height: 40, border: "none", background: "none" }}
              />
            </Box>
            <Box mt={2}>
              <Typography gutterBottom>Font</Typography>
              <select
                value={themeSettings.font}
                onChange={e => setThemeSettings({ ...themeSettings, font: e.target.value })}
                style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
              >
                <option value="Roboto">Roboto</option>
                <option value="Arial">Arial</option>
                <option value="Fira Code">Fira Code</option>
                <option value="JetBrains Mono">JetBrains Mono</option>
              </select>
            </Box>
            <Box mt={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={themeSettings.mode === "dark"}
                    onChange={e =>
                      setThemeSettings({ ...themeSettings, mode: e.target.checked ? "dark" : "light" })
                    }
                  />
                }
                label="Dark Mode"
              />
            </Box>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            px: isMobile ? 0.5 : 2,
            pt: 4,
            pb: 8,
            transition: "padding 0.4s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <Container maxWidth="xl">
            <Grid container spacing={3}>
              {/* Code Input Panel */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 80, damping: 12 }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      minHeight: isMobile ? 260 : editorHeight,
                      display: "flex",
                      flexDirection: "column",
                      mb: 2,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        background: "rgba(255,255,255,0.02)",
                        backdropFilter: "blur(3px)",
                      }}
                    >
                      <Typography variant="h6">Code Input</Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, overflow: "auto", p: 0 }}>
                    <CodeEditor
  code={code}
  onChange={handleCodeChange}
  theme={themeSettings.editorTheme}
  height={editorHeight - 100}
  aria-label="Code editor"
/>

                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        background: "rgba(255,255,255,0.02)",
                        minHeight: 56,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAnalyzeClick}
                        disabled={loading}
                        sx={{
                          ml: "auto",
                          px: 4,
                          boxShadow: loading ? "0 0 0 4px #7e57c220" : undefined,
                        }}
                        component={motion.button}
                        whileTap={{ scale: 0.95 }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Analyze Code"}
                      </Button>
                      <Tooltip title="Load Example">
                        <IconButton
                          onClick={() => setExampleDrawerOpen(true)}
                          aria-label="Load example code"
                        >
                          <ExampleIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    {/* Resizer */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: 6,
                        cursor: "row-resize",
                        zIndex: 2,
                        background: "rgba(255,255,255,0.06)",
                      }}
                      onMouseDown={e => {
                        const startY = e.clientY;
                        const startHeight = editorHeight;
                        const onMove = (ev: MouseEvent) => {
                          setEditorHeight(Math.max(200, startHeight + (ev.clientY - startY)));
                        };
                        const onUp = () => {
                          window.removeEventListener("mousemove", onMove);
                          window.removeEventListener("mouseup", onUp);
                        };
                        window.addEventListener("mousemove", onMove);
                        window.addEventListener("mouseup", onUp);
                      }}
                    />
                  </Paper>
                </motion.div>
              </Grid>
              {/* Output Panel */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.1 }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      minHeight: isMobile ? 260 : outputHeight,
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        background: "rgba(255,255,255,0.02)",
                        backdropFilter: "blur(3px)",
                      }}
                    >
                      <Typography variant="h6">Analysis Result</Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, overflow: "auto", p: 0 }}>
                      <AnimatePresence>
                        {loading ? (
                          <motion.div
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <Box sx={{ p: 4 }}>
                              <Box className="skeleton shimmer" sx={{ height: 120, mb: 2 }} />
                              <Box className="skeleton shimmer" sx={{ height: 80, width: "80%" }} />
                            </Box>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="output"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                          >
                            <CodeOutput output={output} loading={loading} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Box>
                    {/* Resizer */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: 6,
                        cursor: "row-resize",
                        zIndex: 2,
                        background: "rgba(255,255,255,0.06)",
                      }}
                      onMouseDown={e => {
                        const startY = e.clientY;
                        const startHeight = outputHeight;
                        const onMove = (ev: MouseEvent) => {
                          setOutputHeight(Math.max(200, startHeight + (ev.clientY - startY)));
                        };
                        const onUp = () => {
                          window.removeEventListener("mousemove", onMove);
                          window.removeEventListener("mouseup", onUp);
                        };
                        window.addEventListener("mousemove", onMove);
                        window.addEventListener("mouseup", onUp);
                      }}
                    />
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
            {/* Example Code Drawer */}
            <Drawer anchor="bottom" open={exampleDrawerOpen} onClose={() => setExampleDrawerOpen(false)}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Load Example Code</Typography>
                {EXAMPLES.map(ex => (
                  <Button
                    key={ex.label}
                    fullWidth
                    sx={{ mb: 1, textAlign: "left" }}
                    onClick={() => { setCode(ex.code); setExampleDrawerOpen(false); }}
                  >
                    {ex.label}
                  </Button>
                ))}
              </Box>
            </Drawer>
            {/* Padding & Footer */}
            <Box sx={{ height: "100px" }} />
            <Typography variant="body2" sx={{ color: "#666", mb: 4 }}>
              
            </Typography>
           
          </Container>
        </Box>
        <Footer />
        {/* Snackbar Toasts */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.msg}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          ContentProps={{
            sx: {
              background: snackbar.type === "success" ? "#4db6ac" : "#e57373",
              color: "#fff",
              fontWeight: 600,
            },
          }}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
