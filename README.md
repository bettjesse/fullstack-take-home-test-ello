# Book assignment view

This application fetches and displays a list of books. It initially shows 9 random books, with more books fetched based on user search. It includes features like a reading list, skeleton loaders during data fetch, mobile responsiveness, and notifications for adding books to the reading list. The application uses TypeScript for type safety and React with Material UI, integrating Apollo Client to manage GraphQL queries with a GraphQL server.





## Key Features

1. Random Books Display: This feature fetches and displays a random selection of books, providing users with diverse and engaging content each time they visit the application.

2. Skeleton Design for Loading States: To enhance user experience during data fetching, skeleton loaders are employed. These placeholders mimic the layout of content being loaded, offering users visual feedback while they wait for the actual content.

3. Mobile Responsiveness: The application is optimized for mobile devices, ensuring a seamless and intuitive experience across various screen sizes and orientations.

4. Notifications: Users are notified when  they add new books to the reading list.


5. Redux for State Management: Redux is employed for state management, providing a predictable and centralized way to manage application state. The reading list state, including added and removed books, is stored and managed using Redux.

6. Close Search Result by Clicking Anywhere Outside: Enhancing user interaction, the application allows users to close the search results by clicking anywhere outside the search input or the search results, providing a seamless browsing experience.

7. Load More Pagination: Users can load more books by clicking a "Load More" button, which fetches additional books and adds them to the displayed list.

8. Teacher Favorites: Displays a set of favorite books for teachers, showcasing a curated list of books that are popular or recommended for educators.

9. Reading List: A feature that allows teachers to add books to a reading list, view the list of added books, and remove books from the list. This helps teachers manage the books they plan to share with their students effectively.
   
# Deployment note
Please note that the live demo of this project is hosted on a free tier Render server. Due to the limitations of this hosting plan, you might experience some slowness when accessing the application. If you encounter any performance issues, you can follow the instructions below to set up and run the project locally for a smoother experience


### Clone the Repository:
```shell
git clone https://github.com/bettjesse/fullstack-take-home-test-ello
 ```

### Install Dependencies: frontend
```shell
 cd frontend
```
```shell
 cd  ello-frontend
```
```shell
 npm install
```
```shell
 npm run dev 
```

### Install Dependencies: Backend
```shell
 cd backend
```

```shell
 npm install
```
```shell
 npm start
```

# React Hooks Usage

The application utilizes various React hooks for state management and component lifecycle handling:

1. useState: Used to manage local component state variables such as searchTerm, filteredBooks, randomBooks, and snackbarOpen.
2. useRef: Utilized to create a reference for the search input element, enabling detection of clicks outside the search area.
3. useEffect: Employed for handling side effects such as fetching data, subscribing to document events, and cleaning up event listeners.
4. Custom Redux Hooks (useAppDispatch and useAppSelector): These custom hooks provided by Redux Toolkit are used to interact with the Redux store, dispatching actions, and selecting state slices from the store

 # Libraries and Components
The application utilizes various libraries and components, including:

1. Material-UI: Material-UI components are used for building the user interface, providing a rich set of pre-designed components and styles for faster and consistent UI development.
2. @apollo/client: Apollo Client is utilized for GraphQL data fetching, enabling efficient communication with the backend GraphQL server.
3. @reduxjs/toolkit: Redux Toolkit is employed for efficient Redux state management, offering utilities like createSlice for defining reducers and actions.
4. Snackbar: Material-UI Snackbar component is used for displaying notifications to users, providing unobtrusive feedback on actions such as adding a book to the reading list.
6. GlobalStyles and CssBaseline: Material-UI's GlobalStyles and CssBaseline components are used for global styling and ensuring consistent baseline styles across different browsers  and devices.

## Additionally, the application includes the following custom components:

1. Books: The main component where data fetching happens. It serves as the primary view and includes other components to display and manage books.
2. BookCard: This component displays 9 books fetched randomly, showcasing their details such as title, author, and cover photo.
3. SkeletonCard: A component used to display placeholders while data is being fetched, providing a better user experience during loading times.
4. ReadingListDrawer: A component that displays the books added to the reading list. It includes functionality for removing books from the list and provides a drawer UI element for easy access.
5. TeacherFavorites: A component that displays a set of favorite books for teachers, showcasing a curated list of books that are popular or recommended for educators.
  

# Books Query
This query fetches a list of books with their author, cover photo URL, reading level, and title.

```typescript
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

```

# Fetching Random Books
The getRandomBooks utility function fetches a specified number of random books from the list:

```typescript
const getRandomBooks = (books: Book[], num: number): Book[] => {
  const shuffled = [...books].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

```

## ReadingList Slice
The readingList slice manages the state of a user's reading list, allowing them to add and remove books. It is implemented using Redux Toolkit's createSlice function.

The ReadingListState interface defines the structure of the reading list state:
```typescript
interface ReadingListState {
  books: Book[];
}
```

## Book Interface
Defines the structure of a Book object:
```typescript
interface Book {
  author: string;
  title: string;
  readingLevel: string;
  coverPhotoURL: string;
}
```

## Initial state
The initial state of the reading list slice:
```typescript
const initialState: ReadingListState = {
  books: [],
};


```

## addBook Reducer

Adds a book to the reading list if it doesn't already exist:
```typescript
addBook(state, action: PayloadAction<Book>) {
  const { title } = action.payload;
  // Check if the book with the same title already exists
  const existingBook = state.books.find(book => book.title === title);
  // If the book doesn't exist, add it to the list
  if (!existingBook) {
    state.books.push(action.payload);
  }
}


```

## removeBook Reducer

Removes a book from the reading list based on its title

```typescript
removeBook(state, action: PayloadAction<string>) {
  state.books = state.books.filter(book => book.title !== action.payload);
}
```
## ReadingList Components
Shows books added to the reading list with buttons to remove books from the reading lst
```typescript

import { Drawer, List, ListItem, ListItemText, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon, RemoveCircleOutline as RemoveCircleOutlineIcon } from '@mui/icons-material';
import { Book } from './Book';

interface ReadingListDrawerProps {
  open: boolean;
  onClose: () => void;
  readingList: Book[];
  handleRemoveFromReadingList: (title: string) => void;
}

const ReadingListDrawer = ({ open, onClose, readingList, handleRemoveFromReadingList }: ReadingListDrawerProps) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
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

```
# SkeletonCard Component
Displays a skeleton loading card during data fetching.

```typescript

const SkeletonCard = () => (
  <Card sx={{ maxWidth: 220, margin: '10px auto' }}>
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

```





