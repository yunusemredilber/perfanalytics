import React, {useState} from 'react';
import Container from '@material-ui/core/Container';
import Dashboard from "./components/Dashboard";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import {deepPurple} from "@material-ui/core/colors";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = createMuiTheme({
    palette: {
      type: isDarkMode ? 'dark' : 'light',
      primary: deepPurple
    },
  });
  const darkMode = { isDarkMode, toggle() { setIsDarkMode(!isDarkMode) } }
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Container>
        <Dashboard darkMode={darkMode} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
