
import { Grid } from '@mui/material';
import { Typography}from '@mui/material'
import SkeletonCard from './SkeletonCard';
import BookCard from './BookCard';
import { Book } from './Book';

interface TeacherFavoritesProps {
  teacherFavorites: Book[];
  loading: boolean;
  handleAddToReadingList: (book: Book) => void;
  isBookInReadingList: (book: Book) => boolean;
}

const TeacherFavorites = ({ teacherFavorites, loading, handleAddToReadingList, isBookInReadingList }: TeacherFavoritesProps) => {
  return (
    <>
    <Typography variant="h6" sx={{ color: '#335E6C' }} gutterBottom textAlign="left">Teacher Favorites</Typography>
    <Grid container spacing={3} justifyContent="center" sx={{ marginBottom: '20px' }}>
      {loading ? (
        Array.from(new Array(4)).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <SkeletonCard />
          </Grid>
        ))
      ) : (
        teacherFavorites.map((book, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <BookCard book={book} handleAddToReadingList={handleAddToReadingList} isBookInReadingList={isBookInReadingList(book)} />
          </Grid>
        ))
      )}
    </Grid>
    </>
  );
};

export default TeacherFavorites;
