import { gql, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { TextField, Grid, Box, Card, CardActionArea, CardContent, Typography, CardActions, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Define the Books query
const BOOKS_QUERY = gql`
  query Books {
    books {
      author
      coverPhotoURL
      readingLevel
      title
    }
  }
`;

// Define the Book interface
interface Book {
  author: string;
  coverPhotoURL: string;
  readingLevel: string;
  title: string;
}

// Main component
const Books = () => {
  const { loading, error, data } = useQuery<{ books: Book[] }>(BOOKS_QUERY);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [readingList, setReadingList] = useState<Book[]>([]);
  const [randomBooks, setRandomBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (data) {
      // Select a random subset of 9 books from the fetched data
      const randomIndexes = Array.from({ length: 9 }, () => Math.floor(Math.random() * data.books.length));
      const randomSubset = randomIndexes.map(index => data.books[index]);
      setRandomBooks(randomSubset);
    }
  }, [data]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (data) {
      setFilteredBooks(
        data.books.filter(book =>
          book.title.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  const addToReadingList = (book: Book) => {
    setReadingList(prevList => [...prevList, book]);
  };

  const removeFromReadingList = (book: Book) => {
    setReadingList(prevList => prevList.filter(item => item.title !== book.title));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>Books List</h2>
      <TextField
        label="Search Books"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={e => handleSearch(e.target.value)}
      />
      {searchTerm ? (
        <Box maxHeight={400} overflow="auto">
          {filteredBooks.map((book, index) => (
            <BookCard key={index} book={book} onAdd={addToReadingList} />
          ))}
        </Box>
      ) : (
        <Grid container spacing={2}>
          {randomBooks.map((book, index) => (
            <Grid item key={index} xs={4}>
              <BookCard book={book} onAdd={addToReadingList} />
            </Grid>
          ))}
        </Grid>
      )}
      <h2>Reading List</h2>
      <List>
        {readingList.map((book, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemText
              primary={book.title}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary">
                    {book.author}
                  </Typography>
                  {" — " + book.readingLevel}
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => removeFromReadingList(book)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

// BookCard component
const BookCard = ({ book, onAdd }: { book: Book; onAdd: (book: Book) => void; }) => (
  <Card style={{ maxWidth: 200 }}>
    <CardActionArea>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {book.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Author: {book.author}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Reading Level: {book.readingLevel}
        </Typography>
      </CardContent>
    </CardActionArea>
    <CardActions>
      <Button size="small" color="primary" onClick={() => onAdd(book)}>
        Add to Reading List
      </Button>
    </CardActions>
  </Card>
);

export default Books;
