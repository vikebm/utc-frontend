import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from "@material-ui/core/Grid";
import { Toast } from "../components"
import { LoaderContext } from "../context";
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Container from '@material-ui/core/Container';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '81vh',
    width: '100%'
  },
  table: {
    minWidth: 500,
  },
  button: {
    margin: theme.spacing(3, 0, 2),
  }
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#757575',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const OPERATIONS = [
  {
    operation: "Like",
    ref: "="
  },
  {
    operation: "Mayor igual",
    ref: ">="
  },
  {
    operation: "Menor igual",
    ref: "<="
  }
]

export default function Bookings() {
  const classes = useStyles();
  const [dataSource, setDataSource] = useState([]);
  const [allData, setAllData] = useState([]);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { loadingActive, loadingDisabled } = useContext(LoaderContext);
  const [operation, setOperation] = useState('');
  const [filter, setFilter] = useState('');
  const [data, setData] = useState('');

  const getBookings = async () => {
    loadingActive();
    let request;
    try {
      request = await fetch(`https://dev.tuten.cl/TutenREST/rest/user/contacto%40tuten.cl/bookings?current=true`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "adminemail": "testapis@tuten.cl",
          "email": "testapis@tuten.cl",
          "token": localStorage.getItem("token"),
          "app": "APP_BCK"
        }
      });

      const response = await request.json();
      loadingDisabled();
      if (request.status === 200) {
        if (response.length > 0) {
          setDataSource(response);
          setAllData(response);
        }
      } else {
        setToast(true);
        setToastMessage("Error al procesar su solicitud!");
      }

    } catch (error) {
      setToast(true);
      setToastMessage("Error al procesar su solicitud!");
      loadingDisabled();
    }

  }

  useEffect(() => {
    getBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterData = (inputValue) => {
    const filterData = [];
    if (!inputValue || inputValue === "") {
      setDataSource(allData);
    } else {
      allData.forEach(element => {
        if (operation === '=') {
          if (element[filter].toString().includes(inputValue.toString())) {
            filterData.push(element);
          }
        } else if (operation === '>=') {
          if (element[filter] >= inputValue) {
            filterData.push(element);
          }
        } else if (operation === '<=') {
          if (element[filter] <= inputValue) {
            filterData.push(element);
          }
        }
      });
      setDataSource(filterData);
    }
  }

  return (
    <Container component="main" maxWidth="lg" className={classes.root}>
      <Toast message={toastMessage} open={toast} close={() => { setToast(false); }} />
      <Box mt={3}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3} lg={3}>
                <FormControl fullWidth required margin="normal" variant="outlined">
                  <InputLabel id="filter-label">Filtro</InputLabel>
                  <Select
                    name="filter"
                    label="Filtro *"
                    value={filter}
                    onChange={(e) => { setFilter(e.target.value); setDataSource(allData); setData('') }}
                  >
                    <MenuItem value="bookingId">BookingId</MenuItem>
                    <MenuItem value="bookingPrice">BookingPrice</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <FormControl fullWidth required margin="normal" variant="outlined">
                  <InputLabel id="filter-operation">Operación</InputLabel>
                  <Select
                    label="Operación *"
                    value={operation}
                    onChange={(e) => { setOperation(e.target.value); setDataSource(allData); setData('') }}
                  >
                    {OPERATIONS.map((name) => (
                      <MenuItem key={name.operation} value={name.ref}>
                        {name.operation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <TextField
                  margin="normal"
                  fullWidth
                  placeholder="Dato a buscar..."
                  variant="outlined"
                  value={data}
                  onChange={(e) => { filterData(e.target.value); setData(e.target.value) }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      <Grid container
        justify="flex-end">
      </Grid>
      <Grid>
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell>BookingId</StyledTableCell>
                <StyledTableCell>Cliente</StyledTableCell>
                <StyledTableCell>Fecha de Creación</StyledTableCell>
                <StyledTableCell>Dirección</StyledTableCell>
                <StyledTableCell>Precio</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataSource.map((row) => (
                <StyledTableRow key={row.bookingId}>
                  <TableCell component="th" scope="row">
                    {row.bookingId}
                  </TableCell>
                  <TableCell>{row.tutenUserClient.firstName} {row.tutenUserClient.lastName}</TableCell>
                  <TableCell>{new Date(row.bookingCreatedTime).toDateString()}</TableCell>
                  <TableCell>{row.locationId.streetAddress}</TableCell>
                  <TableCell>{row.bookingPrice}</TableCell>
                </StyledTableRow >
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
  );
}

