

import { InMemoryCache, ApolloClient, ApolloProvider } from "@apollo/client";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Books from "./components/Book";
import { Providers } from "./Provider";

// Define your theme with Mulish font
const theme = createTheme({
  typography: {
    fontFamily: 'Mulish, sans-serif',
  },
});

function App() {
  const client = new ApolloClient({
    uri: "http://localhost:4000",
    cache: new InMemoryCache()
  });

  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <Providers>
          <Books />
        </Providers>
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default App;
