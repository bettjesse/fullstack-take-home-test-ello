
import { Drawer, List, ListItem, ListItemText, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon, RemoveCircleOutline as RemoveCircleOutlineIcon } from '@mui/icons-material';
import { Book } from './Book';

interface ReadingListDrawerProps {
  open: boolean;
  onClose: () => void;
  readingList: Book[];
  handleRemoveFromReadingList: (title: string) => void;
}


const ReadingListDrawer = ({ open, onClose, readingList, handleRemoveFromReadingList }:ReadingListDrawerProps) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 1400 }}>
      <List>
        <ListItem>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </ListItem>
        <ListItem>
          <Typography variant="h6" sx={{ color: '#5ACCCC' }}>Student Reading List</Typography>
        </ListItem>
        {readingList.map((book, index) => (
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
  );
};

export default ReadingListDrawer;
