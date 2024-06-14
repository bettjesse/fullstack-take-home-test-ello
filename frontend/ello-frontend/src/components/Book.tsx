import { useState, useRef, useEffect } from 'react';
import SkeletonCard from './SkeletonCard';
import BookCard from './BookCard';
import TeacherFavorites from './TeacherFavorites';
import { TextField, Box, Typography, Grid, Container, IconButton, Skeleton, Badge, AppBar, Toolbar, Snackbar, Button } from '@mui/material';
import ReadingListDrawer from './ReadingListDrawer';
import { AddCircleOutline, MenuBook, CheckCircleOutline } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { addBook, removeBook } from '../slices/readingList';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
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

export interface Book {
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
  const [hasError, setHasError] = useState(false); 
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [teacherFavorites, setTeacherFavorites] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const readingListCount = useAppSelector((state: RootState) => state.readingList.books.length);
  const readingList = useAppSelector(state => state.readingList.books);
  const searchRef = useRef<HTMLDivElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const booksPerPage = 8; // Total books to show

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
      const shuffledBooks = getRandomBooks(data.books, booksPerPage); // Get 8 random books
      setTeacherFavorites(shuffledBooks.slice(0, 8)); // Show 4 on desktop
      setAllBooks(shuffledBooks); // Show all books initially
    }
  }, [data]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (data) {
      const filtered = data.books.filter(book => book.title.toLowerCase().includes(term.toLowerCase()));
      setFilteredBooks(filtered);
      setHasError(filtered.length === 0); 
    }
  };

  const handleAddToReadingList = (book: Book) => {
    dispatch(addBook(book));
    setSnackbarOpen(true);
  };

  const handleRemoveFromReadingList = (book: string) => {
    dispatch(removeBook(book));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const isBookInReadingList = (book: Book) => {
    return readingList.some(item => item.title === book.title);
  };

  const loadMoreBooks = () => {
    if (data) {
      const nextPage = page + 1;
      const newBooks = data.books.slice(0, nextPage * booksPerPage);
      setAllBooks(newBooks);
      setPage(nextPage);
    }
  };

  if (error) return <p>Error :(</p>;

  return (
    <>
      <CssBaseline />
      <GlobalStyles styles={{ body: { backgroundColor: '#FFFFF' } }} />
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#FFFF' }}>
        <Box
            component="img"
            sx={{ height: 40 }}
            alt="Ello Logo"
            src="assets/logo.svg"
            
          />
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#FFFFF", '&:hover': { color: '#FFFFF' }, transition: 'color 0.3s ease', }}>
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
              <MenuBook sx={{ color: '#28B8B8' }} />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <ReadingListDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        readingList={readingList}
        handleRemoveFromReadingList={handleRemoveFromReadingList}
      />
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
                color: '#4AA088',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#28B8B8',
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
                backgroundColor: '#CFFAFA',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#555',
                },
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
                      <Typography variant="subtitle1" sx={{ fontSize: '0.9rem' }}>{book.title}</Typography>
                      <Typography variant="caption">Author: {book.author}</Typography>
                    </div>
                    <IconButton size="small" onClick={() => handleAddToReadingList(book)} disabled={isBookInReadingList(book)} sx={{ marginLeft: 'auto' }}>
                      {isBookInReadingList(book) ? (
                        <CheckCircleOutline sx={{ color: '#335C6E' }} />
                      ) : (
                        <AddCircleOutline sx={{ color: '#FABD33' }} />
                      )}
                    </IconButton>
                  </Box>
                ))
              )}
               {hasError && (
                <Typography variant="body1" sx={{ padding: '10px', color: '#FF0000' }}>
                  No books found for "{searchTerm}"
                </Typography>
              )}
            </Box>
          )}
        </Box>
        <TeacherFavorites teacherFavorites={teacherFavorites}  loading={loading} handleAddToReadingList={handleAddToReadingList} isBookInReadingList={isBookInReadingList} />


        <Box sx={{ marginTop: '40px',  }}>
        <Typography variant="h5" sx={{ color: '#335E6C' }} gutterBottom textAlign="left">All Books</Typography>
        
<Grid container spacing={3} justifyContent="center">
  {loading ? (
    Array.from(new Array(6)).map((_, index) => (
      <Grid item xs={12} sm={6} md={3} key={index} style={{ display: 'flex' }}>
        <SkeletonCard />
      </Grid>
    ))
  ) : (
    allBooks.map((book, index) => (
      <Grid item xs={12} sm={6} md= {3} key={index} style={{ display: 'flex' }}>
        <BookCard
          book={book}
          handleAddToReadingList={handleAddToReadingList}
          isBookInReadingList={isBookInReadingList(book)}
        />
      </Grid>
    ))
  )}
</Grid>

{!loading && data?.books && allBooks.length < data.books.length && (
  <Button
    variant="contained"
    onClick={loadMoreBooks}
    sx={{
      marginTop: '20px', 
      marginBottom: '20px', 
      backgroundColor: '#FADB33',
      color: '#335C6E',
      '&:hover': {
        backgroundColor: '#FAAD00'
      }
    }}
  >
    Load More
  </Button>
)}


        </Box>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Added to Reading List"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ bottom: '70px' }}
      />
    </>
  );
};

export default Books;

