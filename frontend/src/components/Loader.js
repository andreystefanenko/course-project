import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";


export const Loader = () => {
    return(
    <Container maxWidth="sm">
        <Grid>
            <CircularProgress style={{margin: '40%'}} color="secondary" size='20%'/>
        </Grid>
    </Container>
    )
}