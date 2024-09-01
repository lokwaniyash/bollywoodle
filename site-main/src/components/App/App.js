import Game from '../Game';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
        <Game />
    </ThemeProvider>
  );
}

export default App;
