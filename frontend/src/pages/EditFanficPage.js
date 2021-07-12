import React, {useContext, useEffect, useState} from 'react'
import {makeStyles} from "@material-ui/core/styles"
import * as yup from "yup"
import {AuthContext} from "../context/AuthContext"
import {useHttp} from "../hooks/http.hook"
import {useSnackbar} from "notistack"
import {useHistory} from "react-router-dom"
import {useFormik} from "formik"
import {Loader} from "../components/Loader"
import {Container, Typography} from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import BuildIcon from '@material-ui/icons/Build'
import TextField from "@material-ui/core/TextField"
import {Autocomplete} from "@material-ui/lab"
import Button from "@material-ui/core/Button"


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(3,1,1,1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))

const fanficSchema = yup.object({
    title: yup
        .string('Enter fanfic title')
        .required('Title is required')
        .min(2,'Title should be of minimum 2 characters length'),
    describe: yup
        .string('Enter fanfic describe')
        .required('Describe is required')
        .min(2,'Describe should be of minimum 2 characters length')
        .max(150,'Describe should be of maximum 150 characters length'),


});


export const EditFanficPage = () => {

    const classes = useStyles();
    const [fandom, setFandom] = useState([])
    const [tag, setTag] = useState([])
    const auth = useContext(AuthContext)
    const {loading,error,request, clearError} = useHttp()
    const { enqueueSnackbar } = useSnackbar()
    const history = useHistory()

    const formik = useFormik({
        initialValues: {
            title: '',
            fandom: '',
            tags: '',
            describe: '',

        },
        validationSchema: fanficSchema,
        onSubmit: () => {
            alert("Still develop!")
            //fanficHandler().then(data => history.push(`/create/${data.fanfic}/chapter`))
        },
    });


    const fanficHandler = async () => {
        try {
            const data = await request('/api/fanfic/create', 'POST', {...formik.values},
                {Authorization: `Bearer ${auth.token}`} )
            enqueueSnackbar(data.message, {variant: "success"})
            return data
        } catch (e) {}
    }

    useEffect( () => {
        if (error) {
            enqueueSnackbar(JSON.stringify(error), {variant: "error"})
            clearError()
        }
    }, [error, enqueueSnackbar, clearError])


    useEffect(() => {
        async function getFandomsAndTags() {
            try {
                const fandoms = await request('/api/fandom/all', 'GET', null, {})
                setFandom(fandoms)
                const tags = await request('/api/tag/all', 'GET', null, {})
                setTag(tags)
            } catch (e) {}
        }
        getFandomsAndTags()
    }, [request])


    if((loading) && fandom === undefined && tag === undefined) {
        return <Loader/>
    }
    return (
        <Container maxWidth="sm" >
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <BuildIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Fanfic editing
                </Typography>
                <form className={classes.form} onSubmit={formik.handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Title"
                        name="title"
                        autoComplete="title"
                        autoFocus
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                    />

                    <Autocomplete
                        onChange={(event, newValue) => {
                            formik.setFieldValue("fandom", newValue)
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        options={fandom}
                        getOptionLabel={(option) => option.title}
                        renderOption={(option) => option.title}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                name="fandom"
                                label="Fandom"
                                id="fandom"
                                autoComplete="fandom"
                                onChange={formik.handleChange}
                                required
                            />
                        )}
                    />

                    <Autocomplete
                        onChange={(event, newValue) => {
                            formik.setFieldValue("tags", newValue)
                        }}
                        multiple
                        limitTags={2}
                        options={tag}
                        getOptionLabel={(option) => option.title}
                        renderOption={(option) => option.title}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                margin="normal"
                                label="Tags"
                                placeholder="Enter the tags..."
                                id="tags"
                                required={formik.values.tags.length === 0}
                                value={formik.values.tags}
                                onChange={formik.handleChange}
                            />
                        )}
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="describe"
                        label="Describe"
                        id="describe"
                        multiline
                        rows={4}
                        autoComplete="off"
                        value={formik.values.describe}
                        onChange={formik.handleChange}
                        error={formik.touched.describe && Boolean(formik.errors.describe)}
                        helperText={formik.touched.describe && formik.errors.describe}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        //disabled={loading}
                    >
                        Save changes
                    </Button>
                </form>
            </div>

        </Container>
    )
}