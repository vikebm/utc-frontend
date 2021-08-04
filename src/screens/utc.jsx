import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Toast } from "../components";
import { LoaderContext } from "../context";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CssBaseline,
    Typography,
    Button,
    Container
} from '@material-ui/core';
import timezones from "../helpers/timezones.json";
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from 'moment';


const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '75vh',
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column'
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Utc() {
    const classes = useStyles();
    const [toast, setToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const { loadingActive, loadingDisabled } = useContext(LoaderContext);
    const [time, setTime] = useState(new Date());
    const [timezone, setTimezone] = useState("");
    const [result, setResult] = useState("");

    const calcule = async (e) => {
        e.preventDefault();
        loadingActive();
        let request;
        try {
            request = await fetch(`https://api-utc-converter.herokuapp.com/api/v1/convert`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "time": moment(time).format("hh:mm"),
                    "timezone": timezones.find(x => x.text === timezone).offset.toString() > 0 ?
                        "+" + timezones.find(x => x.text === timezone).offset.toString() :
                        timezones.find(x => x.text === timezone).offset.toString()
                })
            });

            loadingDisabled();
            const response = await request.json();
            if (request.status === 200 && response !== null) {
                setResult(response.response)
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


    return (
        <Container component="main" maxWidth="xs" className={classes.root}>
            <Toast message={toastMessage} open={toast} close={() => { setToast(false); }} />
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5" color="primary" style={{ textAlign: 'center' }}>
                    UTC CONVERTER
                </Typography>
                <form className={classes.form} noValidate onSubmit={calcule}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <FormControl fullWidth margin="normal">
                            <KeyboardTimePicker
                                clearable
                                ampm={false}
                                name="time"
                                label="Hora"
                                value={time}
                                onChange={(date) => setTime(date)}
                                inputVariant="outlined"
                            />
                        </FormControl>
                    </MuiPickersUtilsProvider>
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel id="timezone-label">Zona horaria</InputLabel>
                        <Select
                            onChange={(e) => setTimezone(e.target.value)}
                            name="timezone"
                            label="Zona horaria"
                            value={timezone}
                        >
                            {
                                timezones.map((row) => (
                                    <MenuItem key={row.text} value={row.text}> {row.text}</MenuItem>
                                ))
                            }

                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Calcular
                    </Button>
                </form>
                <Typography component="h1" variant="h5" color="secondary" style={{ textAlign: 'center' }}>
                    {result ? "Resultado: " + result.time + "UTC" : ""}
                </Typography>
            </div>
        </Container>
    );
}
