import React from 'react'
import Grid from "@material-ui/core/Grid"
import {Box, Card, CardActions, CardContent, CardMedia, Chip} from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import FaceIcon from "@material-ui/icons/Face"
import StarIcon from "@material-ui/icons/Star"
import {makeStyles} from "@material-ui/core/styles"
import {useHistory} from "react-router-dom"
import Container from "@material-ui/core/Container"
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import NoteIcon from '@material-ui/icons/Note'
import EventIcon from '@material-ui/icons/Event'
import BookIcon from '@material-ui/icons/Book'
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: '#fafafa',
        padding: theme.spacing(8, 0, 6),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        backgroundColor: "white",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',

    },
    cardContent: {
        flexGrow: 1,
    },
    title: {
        marginBottom: theme.spacing(2)
    },
    fandom: {
        backgroundColor: theme.palette.secondary.main,
        borderRadius: '0.5rem',
        padding: '2px 0.5rem',
        color: '#fff',
        marginBottom: theme.spacing(2),
    },
    avatar: {
        backgroundColor: "#f8bbd0",
        width: theme.spacing(3),
        height: theme.spacing(3),
        color: theme.palette.secondary.main,
        marginLeft: theme.spacing(4)
    },
    button:{
        marginLeft: theme.spacing(11)
    },
    chip: {
        marginBottom: theme.spacing(4)
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: theme.spacing(3),
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
    cardMedia: {
        paddingTop: '56.25%',
    },
}));

export const ChaptersList = (props) => {
    const classes = useStyles()
    const fanfic = props.fanfic
    const cards = props.chapters
    const history = useHistory()

    return (
        <div className={classes.heroContent}>
            <Container maxWidth="sm">
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    {fanfic.title}
                </Typography>
                <Grid
                    container
                    alignItems="center"
                    justify="center"
                    spacing={1}
                    direction="row"
                >
                    <Grid item>
                        <NoteIcon color="secondary"/>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" align="justify">
                            {fanfic.fandom}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                    spacing={1}
                >
                    <Grid item>
                        <FaceIcon color="secondary"/>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="h6"
                        >
                            {fanfic.author}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                    spacing={1}
                >
                    <Grid item>
                        <EventIcon color="secondary"/>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="subtitle1"
                            color="textSecondary"
                        >
                            {(new Date(fanfic.createDate)).toLocaleDateString()}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                    spacing={1}
                >
                    <Grid item>
                            <StarIcon color="secondary"/>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="subtitle1"
                            color="textSecondary"
                        >
                            2.5
                        </Typography>
                    </Grid>
                </Grid>
                <div className={classes.chips}>
                    {fanfic.tags.map(element =>
                            <Chip
                                variant="outlined"
                                key={element}
                                label={element}
                                color="primary"
                                icon={<LocalOfferIcon/>}
                            />
                    )}
                </div>
                <Typography variant="h5" align="justify" color="textSecondary" paragraph>
                    {fanfic.describe}
                </Typography>
            </Container>

            <Container className={classes.cardGrid} maxWidth="md">
                <Grid
                    container
                    className={classes.chip}
                    alignItems="center"
                    justify="center"
                >
                    <Chip
                        variant="outlined"
                        color="primary"
                        icon={<BookIcon/>}
                        label="Chapters"
                    />
                </Grid>
                <Grid container spacing={4}>
                    {cards.map((card) => (
                        <Grid item key={card._id} xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                <CardMedia
                                    className={classes.cardMedia}
                                    image={card.photo}
                                    title="Image title"
                                />
                                <CardContent className={classes.cardContent}
                                >
                                    <Box height={80}>
                                        <Typography
                                            className={classes.title}
                                            gutterBottom
                                            variant="h5"
                                            component="h2"
                                            align="center"
                                        >
                                            {card.title}
                                        </Typography>
                                    </Box>
                                    <Typography className={classes.fandom} align="center">
                                        Chapter: {card.number}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Grid container spacing={1} alignItems="center" justify="center">
                                        <Grid item className={classes.button}>
                                            <Button
                                                size="small"
                                                color="secondary"
                                                variant="outlined"
                                                onClick={() => history.push(`/chapter/${card._id}/read`)}
                                            >
                                                Read
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Avatar className={classes.avatar}>
                                                <StarIcon color="inherit"/>
                                            </Avatar>

                                        </Grid>
                                        <Typography>2.5</Typography>

                                    </Grid>

                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
    </div>
    )}