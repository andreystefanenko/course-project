import React, {useState} from 'react'
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import {TextField, Typography} from "@material-ui/core";
import {useHistory, useParams} from 'react-router-dom'
import Button from "@material-ui/core/Button";
import FiberNewIcon from '@material-ui/icons/FiberNew';
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import {useSnackbar} from "notistack";
import axios from 'axios'
import {Loader} from "../components/Loader";


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
    editor: {
        marginTop: theme.spacing(2)
    }
}))

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

export const ChapterPage = () => {
    const classes = useStyles()
    const fanficId = useParams().id
    const [form, setForm] = useState({
        title: '',})
    const [selectedTab, setSelectedTab] = useState("write");
    const [text, setText] = useState("**Hello World!**")
    const [fileInput, setFileInput] = useState()
    const correctFileTypes = ["image/png", "image/jpg", "image/jpeg"]
    const { enqueueSnackbar } = useSnackbar()
    const [loading, setLoading] = useState(false)
    const history = useHistory()


    const getFile = () => {
        const selectedFile = document.getElementById('inputFile').files[0]
        if (!selectedFile){
            enqueueSnackbar("No file selected", {variant: "error"})
        } else if (!correctFileTypes.includes(selectedFile.type)) {
            enqueueSnackbar("Wrong format of file! Choose only .jpg, .jpeg, .png", {variant: "error"})
        } else setFileInput(selectedFile)
    }

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
        event.preventDefault()
    }

    const chapterHandler = async () => {
        setLoading(true)
        try {
            const inputData = new FormData()
            inputData.append("file", fileInput)
            inputData.append("fanficId", fanficId)
            inputData.append("text", text)
            inputData.append("title", form.title)
            axios.post('/api/chapter/create', inputData)
                .then(res => {
                    enqueueSnackbar(res.data.message, {variant: "success"})
                })
                .then(() => setLoading(false))
                .then(() => history.push(`/fanfics/${fanficId}/edit`))
                .catch(e => {
                    enqueueSnackbar(e.response.data.message, {variant: "error"})
                })
        } catch (e) {}

    }
    if (loading){
        return <Loader/>
    }

    return (
        <Container maxWidth="md" >
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <FiberNewIcon fontSize="large" />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Creating a new chapter
                </Typography>
                <form className={classes.form}
                      encType="multipart/form-data"
                      onSubmit={(event) => {
                    event.preventDefault()
                          chapterHandler()
                }

                }
                    >
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
                        value={form.title}
                        onChange={changeHandler}
                    />
                    <TextField
                        id="inputFile"
                        variant="outlined"
                        type="file"
                        required
                        margin="normal"
                        fullWidth
                        onChange={getFile}
                        />

                    <div className={classes.editor}>
                    <ReactMde
                        toolbarCommands={[["header", "bold", "italic"],
                            ["link", "quote"],
                            ["unordered-list", "ordered-list", "checked-list"]]}
                        value={text}
                        onChange={setText}
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        generateMarkdownPreview={(markdown) =>
                            Promise.resolve(converter.makeHtml(markdown))
                        }
                        childProps={{
                            writeButton: {
                                tabIndex: -1
                            }
                        }}
                    />
                    </div>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        //disabled={loading}
                    >
                        Save chapter
                    </Button>
                </form>
            </div>
        </Container>
    )
}