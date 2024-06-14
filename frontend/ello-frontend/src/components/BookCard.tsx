import { Typography, IconButton, Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import { CheckCircleOutline, AddCircleOutline } from '@mui/icons-material';

interface Book {
  author: string;
  coverPhotoURL: string;
  readingLevel: string;
  title: string;
}

interface BookCardProps {
  book: Book;
  handleAddToReadingList: (book: Book) => void;
  isBookInReadingList: boolean;
}

const BookCard = ({ book, handleAddToReadingList, isBookInReadingList }: BookCardProps) => (
  <Card sx={{ maxWidth: 220, margin: '10px auto', backgroundColor: '#CFFAFA', display: 'flex', flexDirection: 'column', height: '100%' }}>
    <CardActionArea style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={book.coverPhotoURL}
        alt={book.title}
        style={{ objectFit: 'cover' }}
      />
      <CardContent style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="subtitle1" component="h2" sx={{ color: '#335C6E', flexGrow: 1 }}>
          {book.title}
        </Typography>
        <Typography variant="caption" color="textSecondary" component="p" sx={{ color: '#4AA088' }}>
          Author: {book.author}
        </Typography>
      </CardContent>
    </CardActionArea>
    <IconButton size="small" sx={{ alignSelf: 'flex-end', color: isBookInReadingList ? '#4AA088' : '#FABD33' }} onClick={() => handleAddToReadingList(book)}>
      {isBookInReadingList ? (
        <CheckCircleOutline />
      ) : (
        <AddCircleOutline />
      )}
    </IconButton>
  </Card>
);

export default BookCard;
