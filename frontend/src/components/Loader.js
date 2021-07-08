import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
            marginTop: theme.spacing(2),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
    },
}));

export const Loader = () => {
    const classes = useStyles();

    return(
    <div className={classes.root}>
        <CircularProgress color="secondary" />
    </div>
    )
}