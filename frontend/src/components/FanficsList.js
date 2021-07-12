import React from 'react'
import Grid from "@material-ui/core/Grid";
import {Box, Card, CardActions, CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import FaceIcon from "@material-ui/icons/Face";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import StarIcon from "@material-ui/icons/Star";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import {FormattedMessage} from "react-intl";


const useStyles = makeStyles((theme) => ({
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
    date: {
        marginBottom: theme.spacing(1)
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
        marginBottom: theme.spacing(2)
    }
}));

export const FanficsList = (props) => {
    const classes = useStyles()
    const cards = props.fanfics
    const history = useHistory()

    return (
        <Grid container spacing={4}>
            {cards.map((card) => (
                <Grid item key={card._id} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
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
                                {card.fandom}
                            </Typography>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                                spacing={1}
                            >
                                <Grid item>
                                    <FaceIcon/>
                                </Grid>
                                <Grid item>
                                    <Typography>{card.author}</Typography>
                                </Grid>
                            </Grid>
                            <Typography
                                align="center"
                                color="textSecondary"
                                className={classes.date}
                                component="h4"
                                variant="body2"
                                >
                                {(new Date(card.createDate)).toLocaleDateString()}
                            </Typography>
                            <Box height={100} display="inline-block">
                            <Typography
                                align="justify"
                                color="textSecondary"
                            >

                                {card.describe}
                            </Typography>
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Grid container spacing={1} alignItems="center" justify="center">
                                <Grid item className={classes.button}>
                                    <Button
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        onClick={() => history.push(`/${card._id}/detail`)}
                                    >
                                        <FormattedMessage id="mainpage.button.view"/>
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
    )
}