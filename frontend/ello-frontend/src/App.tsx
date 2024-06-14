

import { InMemoryCache, ApolloClient, ApolloProvider } from "@apollo/client";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Books from "./components/Book";
import { Providers } from "./Provider";


const theme = createTheme({
  typography: {
    fontFamily: 'Mulish, sans-serif',
  },
});

function App() {
  const client = new ApolloClient({
    uri: "http://localhost:4000",
    // uri: "https://fullstack-take-home-test-ello-backend.onrender.com",
    
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
