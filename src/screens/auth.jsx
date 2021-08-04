import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { Toast } from "../components";
import { LoaderContext } from "../context";
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '75vh',
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const initialValues = {
    "email": "",
    "password": ""
};

export default function Auth() {
    const classes = useStyles();
    let history = useHistory();
    const [toast, setToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const { loadingActive, loadingDisabled } = useContext(LoaderContext);
    const [formValues, setFormValues] = useState(initialValues);

    const login = async (e) => {
        e.preventDefault();
        loadingActive();
        let request;
        try {
            request = await fetch(`https://dev.tuten.cl/TutenREST/rest/user/testapis%40tuten.cl`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "email": formValues.email,
                    "password": formValues.password,
                    "app": "APP_BCK"
                }
            });

        } catch (error) {
            setToast(true);
            setToastMessage("Error al procesar su solicitud!");
            loadingDisabled();
        }

        loadingDisabled();
        if (request.status === 200) {
            const response = await request.json();
            localStorage.setItem('token', response.sessionTokenBck)
            history.push("/bookings");
        } else {
            setToast(true);
            setToastMessage("Error al procesar su solicitud!");
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    return (
        <Container component="main" maxWidth="xs" className={classes.root}>
            <Toast message={toastMessage} open={toast} close={() => { setToast(false); }} />
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5" color="primary">
                    Iniciar sesión
                </Typography>
                <form className={classes.form} noValidate onSubmit={login}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        value="testapis@tuten.cl"
                        label="Correo electrónico"
                        name="email"
                        onChange={handleChange}
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña "
                        type="password"
                        id="password"
                        onChange={handleChange}
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Iniciar sesión
                    </Button>
                </form>
            </div>
        </Container>
    );
}
