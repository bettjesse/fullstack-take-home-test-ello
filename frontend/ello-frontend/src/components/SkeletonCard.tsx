import {  Typography,  IconButton, Card, CardActionArea, CardContent, Skeleton } from '@mui/material';
import {AddCircleOutline} from  '@mui/icons-material'
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

  export default SkeletonCard