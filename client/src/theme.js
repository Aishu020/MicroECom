import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#131921"
    },
    secondary: {
      main: "#f9a825"
    },
    background: {
      default: "#f2f4f7",
      paper: "#ffffff"
    }
  },
  typography: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    h4: {
      fontWeight: 700
    }
  }
});

export default theme;
