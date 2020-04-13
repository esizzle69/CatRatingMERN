import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import PetsIcon from '@material-ui/icons/Pets';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { sortCards } from "../../actions/sortCats";
import api from '../../api/api'

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    opacity: '0.9',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    //paddingRight: theme.spacing(8)
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));



export default function Album(props) {

  const classes = useStyles();
  
  return (
    <React.Fragment>
      {/* <CssBaseline /> */}
      <AppBar position="relative">
        <Toolbar>
          <PetsIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            10 Highest Ranking Cats
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {props.sorted.map(card => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={card.photos}
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.name}
                    </Typography>
                    <Typography gutterBottom>
                      Upvotes: {card.likes}
                    </Typography>
                    <Typography gutterBottom>
                      Owner:  {card.owner}
                    </Typography>
                    <Typography gutterBottom>
                      Bio: {card.bio}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" href={"/" + props.username + "/CatProfiles/" + card._id}>
                      View
                    </Button>
                    {/*<Button size="small" color="primary">
                      Edit
                    </Button>*/}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}