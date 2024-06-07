import { InMemoryCache,ApolloClient, ApolloProvider}from "@apollo/client"
import Books from "./components/Book"

function App() {

const client = new ApolloClient({
  uri : "http://localhost:4000",
  cache : new InMemoryCache()
})
  return (
 <>
 <ApolloProvider client={ client}>

<Books/>


 </ApolloProvider>
 </>
  )
}

export default App