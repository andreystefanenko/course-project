import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom"
import {useHttp} from "../hooks/http.hook"
import {Loader} from "../components/Loader"
import {useSnackbar} from "notistack"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import {makeStyles} from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import TurnedInIcon from '@material-ui/icons/TurnedIn'
import Image from "material-ui-image"
import showdown from 'showdown'
import parse from 'html-react-parser'

const useStyles = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: '#fafafa',
        padding: theme.spacing(8, 0, 6),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    media: {
        marginTop: theme.spacing(4)
    }
}));

export const ReadPage = () => {
    const chapterId = useParams().id
    const [chapter, setChapter] = useState()
    const {error, request, clearError} = useHttp()
    const {enqueueSnackbar} = useSnackbar()
    const converter = new showdown.Converter()
    const classes = useStyles()

    useEffect(() => {
        async function getChapter() {
            try {
                return await request(`/api/chapter/${chapterId}`, 'GET')
            } catch (e) {}
        }
        getChapter().then(res => setChapter(res))
    }, [request])

    useEffect(() => {
        if (error) {
            enqueueSnackbar(JSON.stringify(error), {variant: "error"})
            clearError()
        }
    }, [error, enqueueSnackbar, clearError])

    if (chapter === undefined){
        return <Loader/>
    } else return (
        <div className={classes.heroContent}>
            <Container maxWidth="sm">
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    {chapter.title}
                </Typography>
                <Grid
                    container
                    alignItems="center"
                    justify="center"
                    spacing={1}
                    direction="row"
                >
                    <Grid item>
                        <TurnedInIcon color="secondary"/>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" align="justify" color="textSecondary">
                            Chapter: {chapter.number}
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
            <Container maxWidth="sm">
                <Image className={classes.media} src={chapter.photo} alt="Chapter photo" color='none' aspectRatio={16 / 9} />
            </Container>

            <Container className={classes.cardGrid} maxWidth="md">
                <Grid container justify="center">
                    <Typography align="justify" variant="body1">
                        {parse(`${converter.makeHtml(chapter.text)}`)}
                    </Typography>
                </Grid>
            </Container>
        </div>

    )
}