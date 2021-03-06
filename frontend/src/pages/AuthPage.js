import React, {useContext, useEffect} from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { useFormik } from 'formik'
import * as yup from 'yup'
import {useHttp} from "../hooks/http.hook"
import {useSnackbar} from "notistack"
import {AuthContext} from "../context/AuthContext"
import {NavLink} from "react-router-dom"
import {FormattedMessage} from "react-intl"


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const authSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(6, 'Password should be of minimum 6 characters length')
        .required('Password is required'),

});

export const AuthPage = () => {
        const auth = useContext(AuthContext)
        const classes = useStyles();

        const formik = useFormik({
            initialValues: {
                email: '',
                password: ''

            },
            validationSchema: authSchema,
            onSubmit: (values) => {
                loginHandler()
            },
        });

        const {loading,error,request, clearError} = useHttp()

        const { enqueueSnackbar } = useSnackbar()

        useEffect( () => {
            if (error) {
                enqueueSnackbar(JSON.stringify(error), {variant: "error"})
                clearError()
            }
        }, [error, enqueueSnackbar, clearError])

        const loginHandler = async () => {
            try {
                const data = await request('/api/auth/login', 'POST', {...formik.values})
                enqueueSnackbar(data.message, {variant: "success"})
                auth.login(data.token, data.userId)
            } catch (e) {

            }
        }

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        <FormattedMessage id="authpage.signin" />
                    </Typography>
                    <form className={classes.form} onSubmit={formik.handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            id="email"
                            label=<FormattedMessage id="authpage.textfield.email" />
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label=<FormattedMessage id="authpage.textfield.password" />
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={loading}
                        >
                            <FormattedMessage id="authpage.button.signin" />
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <NavLink to="/registration"><FormattedMessage id="authpage.textfield.signup" /></NavLink>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
    }