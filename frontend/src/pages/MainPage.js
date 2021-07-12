import React, {useEffect, useState} from 'react'
import {makeStyles} from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import {Chip} from "@material-ui/core"
import WhatshotIcon from '@material-ui/icons/Whatshot'
import {FanficsList} from "../components/FanficsList"
import {useHttp} from "../hooks/http.hook";
import {useSnackbar} from "notistack";
import {Loader} from "../components/Loader";
import {FormattedMessage} from "react-intl";

const useStyles = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: '#fafafa',
        padding: theme.spacing(8, 0, 6),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    latest: {
        marginBottom: theme.spacing(2)
    },
    rated: {
        margin: theme.spacing(4,0,4)
    }
}));

export const MainPage = () => {
    const classes = useStyles()
    const {error, request, clearError} = useHttp()
    const {enqueueSnackbar} = useSnackbar()
    const [latest, setLatest] = useState()
    const [rated, setRated] = useState()


    async function updateFanfic(fanfics) {
        const fandomIds = fanfics.map(fanfic => fanfic.fandom)
        const authorIds = fanfics.map(fanfic => fanfic.author)
        const fandomsByIds = await request('/api/fandom/byIds', 'POST', fandomIds)
        const fandoms = fandomsByIds.response.map(fdom => fdom)
        const authorById = await request('/api/user/byIds', 'POST', authorIds)
        const authors = authorById.response.map(user => user)

        const fandomMapById = new Map(fandoms.map(it => ([it._id, it])))
        const authorMapById = new Map(authors.map(it =>([it._id, it])))

        return fanfics.map(el => {
            const fandomForReplace = fandomMapById.get(el.fandom);
            const authorForReplace = authorMapById.get(el.author)
            if (fandomForReplace && fandomForReplace.title) {
                return {...el, fandom: fandomForReplace.title,
                    author: authorForReplace.firstname + " " + authorForReplace.lastname};
            }
            return el
        })
    }

    useEffect(() => {
        async function getLatestFanfics() {
            try {
                const latestFanfics = await request('/api/fanfic/latest', 'GET', null, {})
                return latestFanfics.fanfics.slice(0, 6)
            } catch (e) {
            }
        }

        getLatestFanfics()
            .then(result => {
                updateFanfic(result)
                    .then(newFanfics => setLatest(newFanfics))
            })

    }, [request])

    // useEffect(() => {
    //     async function getLatestFanfics() {
    //         try {
    //             const latestFanfics = await request('/api/fanfic/latest', 'GET', null, {})
    //             return latestFanfics.fanfics.slice(0, 6)
    //         } catch (e) {}
    //     }
    //     getLatestFanfics()
    //         .then(result => {
    //             updateFanfic(result).then(newFanfics => setLatest(newFanfics))
    //         })
    //
    // }, [request])


    useEffect(() => {
        if (error) {
            enqueueSnackbar(JSON.stringify(error), {variant: "error"})
            clearError()
        }
    }, [error, enqueueSnackbar, clearError])

    if (latest === undefined) {
        return <Loader/>
    } else {
        return (
            <div className={classes.heroContent}>
                <Container maxWidth="sm">
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                        <FormattedMessage id="mainpage.title"/>
                    </Typography>
                    <Typography variant="h5" align="justify" color="textSecondary" paragraph>
                        <FormattedMessage id="mainpage.subtitle"/>
                    </Typography>
                </Container>
                <Container className={classes.cardGrid} maxWidth="md">
                    <Grid container alignItems="center" justify="center" className={classes.latest}>
                        <Chip
                            variant="outlined"
                            color="primary"
                            icon={<WhatshotIcon/>}
                            label=<FormattedMessage id="mainpage.chip.last"/>
                        />
                    </Grid>
                    <FanficsList fanfics={latest}/>
                    {/*<Grid container alignItems="center" justify="center" className={classes.rated}>*/}
                    {/*    <Chip variant="outlined" color="primary" icon={<StarIcon />} label="Most rated fanfics"/>*/}
                    {/*</Grid>*/}
                    {/*<FanficsList fanfics={cards}/>*/}
                </Container>

            </div>
        )
    }
}