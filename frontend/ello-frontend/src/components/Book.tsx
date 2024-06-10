
import { useState, useRef, useEffect } from 'react';
import { TextField, Box, Typography, Grid, Container, IconButton, Card, CardActionArea, CardContent, Skeleton, Badge, AppBar, Toolbar, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { AddCircleOutline, MenuBook } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { addBook, removeBook } from './slices/readingList';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import { Close as CloseIcon } from '@mui/icons-material';
import { RemoveCircleOutline as RemoveCircleOutlineIcon } from '@mui/icons-material';
import { RootState } from '../store';



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

interface Book {

  author: string;
  coverPhotoURL: string;
  readingLevel: string;
  title: string;
}

// Utility function to get random books
const getRandomBooks = (books: Book[], num: number): Book[] => {
  const shuffled = [...books].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const Books = () => {
  const { loading, error, data } = useQuery<{ books: Book[] }>(BOOKS_QUERY);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [randomBooks, setRandomBooks] = useState<Book[]>([]);
  const dispatch = useAppDispatch();
  const readingListCount = useAppSelector((state :RootState) => state.readingList.books.length);
  const readingList = useAppSelector(state => state.readingList.books);
  const searchRef = useRef<HTMLDivElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (data) {
      setRandomBooks(getRandomBooks(data.books, 9));
    }
  }, [data]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (data) {
      const filtered = data.books.filter(book => book.title.toLowerCase().includes(term.toLowerCase()));
      setFilteredBooks(filtered);
    }
  };
console.log(data)
  const handleAddToReadingList = (book: Book) => {
    dispatch(addBook(book));
  };

  const handleRemoveFromReadingList = (book: string)=>  {
    dispatch(removeBook(book))
  }

  if (error) return <p>Error :(</p>;

  return (
    <>
      <CssBaseline />
      <GlobalStyles styles={{ body: { backgroundColor: '#FFFFF' } }} />
      <AppBar position="static">
      <Toolbar sx={{ backgroundColor: '#28B8B8' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, color:"#FFFFF",'&:hover': {
      color: '#CCFAFA', 
    },
    transition: 'color 0.3s ease', }}>
            Books List
          </Typography>
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
  <Badge
    badgeContent={readingListCount}
    sx={{
      '& .MuiBadge-badge': {
        backgroundColor: '#FABD33',
        color: '#000', 
      },
    }}
  >
    <MenuBook />
  </Badge>
</IconButton>

        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
  <List>
    <ListItem>
      <Typography variant="h6" sx={{ color: '#5ACCCC' }}>Student Reading List</Typography>
    </ListItem>
    <ListItem>
      <IconButton onClick={() => setDrawerOpen(false)}>
        <CloseIcon />
      </IconButton>
    </ListItem>
    {readingList.map((book:Book, index: number) => (
      <ListItem key={index}>
        <ListItemText 
          primary={
            <Typography variant="subtitle1" sx={{ color: '#FACCC', marginRight: '10px' }}>{index + 1}. {book.title}</Typography>
          } 
          secondary={
            <Typography variant="caption" sx={{ color: '#28B8B8' }}>Author: <span style={{ color: '#53C2C2' }}>{book.author}</span></Typography>
          } 
        />
        <IconButton onClick={() => handleRemoveFromReadingList(book.title)} size="small">
          <RemoveCircleOutlineIcon sx={{ color: '#FABD33' }} />
        </IconButton>
      </ListItem>
    ))}
  </List>
</Drawer>


      <Container sx={{ textAlign: 'center', marginTop: '50px', width: '80%', margin: 'auto', fontFamily: 'Mulish, sans-serif' }}>
        <Box sx={{ marginBottom: '20px', position: 'relative', display: 'inline-block' }}>
        <TextField
  label="Search Books"
  variant="outlined"
  margin="normal"
  value={searchTerm}
  onChange={e => handleSearch(e.target.value)}
  sx={{
    width: { xs: '100%', sm: '320px' },
    borderRadius: '6px',
    '& .MuiOutlinedInput-root': {
     
     
      '&.Mui-focused fieldset': {
        borderColor: '#335C6E', 
      },
     
    },
    '& .MuiInputLabel-root': {
      color: '#4AA088', // Label color
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#28B8B8', // Label color when focused
    },
  }}
/>

          {searchTerm && (
            <Box
              ref={searchRef}
              sx={{
                maxHeight: '300px',
                width: { xs: '100%', sm: '320px' },
                overflowY: 'auto',
                zIndex: 1,
                border: '1px solid #ccc',
                borderRadius: '4px',
                textAlign: 'left',
                margin: '0 auto',
                position: 'absolute',
                top: '100%', 
                left: 0,
                backgroundColor: '#CFFAFA'
              }}
            >
              {loading ? (
                Array.from(new Array(3)).map((_, index) => (
                  <Box key={index} sx={{ marginBottom: '10px', display: 'flex', alignItems: 'center', padding: '10px' }}>
                    <Skeleton variant="rectangular" width={80} height={80} animation="pulse" style={{ marginRight: '10px' }} />
                    <div>
                      <Typography variant="subtitle1"><Skeleton variant="text" animation="pulse" /></Typography>
                      <Typography variant="caption"><Skeleton variant="text" animation="pulse" /></Typography>
                    </div>
                    <IconButton size="small" sx={{ marginLeft: 'auto' }}>
                      <AddCircleOutline />
                    </IconButton>
                  </Box>
                ))
              ) : (
                filteredBooks.map((book, index) => (
                  <Box key={index} sx={{ marginBottom: '10px', display: 'flex', alignItems: 'center', padding: '10px' }}>
                    <img src={book.coverPhotoURL} alt={book.title} width={80} height={80} style={{ marginRight: '10px' }} />
                    <div>
                      <Typography variant="subtitle1">{book.title}</Typography>
                      <Typography variant="caption">Author: {book.author}</Typography>
                    </div>
                    <IconButton size="small" sx={{ marginLeft: 'auto', color:'#FABD33' }} onClick={() => handleAddToReadingList(book)}>
                      <AddCircleOutline />
                    </IconButton>
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>
        <Grid container spacing={1} justifyContent="center">
          {loading ? (
            Array.from(new Array(9)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <SkeletonCard />
              </Grid>
            ))
          ) : (
            randomBooks.map((book, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <BookCard book={book} handleAddToReadingList={handleAddToReadingList} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </>
  );
};

// SkeletonCard component for displaying skeletons
const SkeletonCard = () => (
  <Card sx={{ maxWidth: 220, margin: '10px auto'}}>
    <CardActionArea>
      <Skeleton variant="rectangular" width={220} height={320} animation="pulse" />
      <CardContent>
        <Typography gutterBottom variant="subtitle1" component="h2">
          <Skeleton variant="text" animation="pulse" />
        </Typography>
        <Typography variant="caption" color="textSecondary" component="p">
          <Skeleton variant="text" animation="pulse" />
        </Typography>
        <IconButton size="small" sx={{ marginLeft: 'auto' }}>
          <AddCircleOutline />
        </IconButton>
      </CardContent>
    </CardActionArea>
  </Card>
);

// BookCard component for displaying books
const BookCard = ({ book, handleAddToReadingList }: { book: Book, handleAddToReadingList: (book: Book) => void }) => (
  <Card sx={{ maxWidth: 220, margin: '10px auto', backgroundColor: '#CFFAFA', display: 'flex', flexDirection: 'column' }}>
  <CardActionArea style={{ flexGrow: 1 }}>
    <img src={book.coverPhotoURL} alt={book.title} style={{ width: '100%' }} />
    <CardContent style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Typography gutterBottom variant="subtitle1" component="h2" sx={{ color: '#335C6E', flex: '1' }}>
        {book.title}
      </Typography>
      <Typography variant="caption" color="textSecondary" component="p" sx={{ color: '#4AA088' }}>
        Author: {book.author}
      </Typography>
    </CardContent>
  </CardActionArea>
  <IconButton onClick={() => handleAddToReadingList(book)} size="small" sx={{ marginLeft: 'auto', color: '#FABD33' }}>
    <AddCircleOutline />
  </IconButton>
</Card>

);

export default Books;
