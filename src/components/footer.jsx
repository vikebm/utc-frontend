import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() {
  return (
    <Typography variant="body2">
      {'Copyright © '}
      {new Date().getFullYear()}

      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    zIndex: 2,
    width: '100%',
    bottom: 0,
    textAlign:'center',
    padding: theme.spacing(3, 2),
    minHeight: '15vh',
    backgroundColor: '#3f51b5',
    color: 'white'
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Typography variant="body1">Virgilio La Rosa</Typography>
          <Copyright />
        </Container>
      </footer>
    </div>
  );
}