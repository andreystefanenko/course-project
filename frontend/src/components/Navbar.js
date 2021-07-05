import React, {useContext} from 'react';
import {fade, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {AuthContext} from "../context/AuthContext";
import {NavLink, useHistory} from "react-router-dom"
import SearchIcon from '@material-ui/icons/Search';
import {InputBase, Link, Select} from "@material-ui/core";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    select: {
        textDecoration: "none",
        color: "white",
        '&:before': {
            borderColor: "white",
        },
        '&:after': {
            borderColor: "white",
        }
    },
    icon: {
        fill: "white",
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(2),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
    link: {
        textDecoration: "none",
        color: "white"
    },
}));

export const Navbar = () => {
    const classes = useStyles();
   // const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const auth = useContext(AuthContext)
    const history = useHistory()

    // const handleChange = (event) => {
    //     setAuth(event.target.checked);
    // };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logoutHandler = (event) => {
        event.preventDefault()
        auth.logout()
        history.push("/authorization")
        handleClose()
    }

    const profileHandler = (event) => {
        event.preventDefault()
        history.push("/profile")
        handleClose()
    }

    const createHandler = (event) => {
        event.preventDefault()
        history.push("/create")
        handleClose()
    }

    const fanficsHandler = (event) => {
        event.preventDefault()
        history.push("/create")
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        <NavLink to="/"
                                 style={{color: 'white', textDecoration: 'none'}}
                                 activeStyle={{
                                     fontWeight: "normal",
                                     color: "white",
                                     textDecoration: "none"
                                 }}>Fanfics book</NavLink>
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                    <div>
                        <Select className={classes.select}
                            value=''
                            //onChange={handleChange}
                            displayEmpty
                            //className={classes.selectEmpty}
                                inputProps={{
                                    classes: {
                                        icon: classes.icon,
                                    },
                                }}
                        >
                            <MenuItem value=''>English</MenuItem>
                            <MenuItem value={10}>Russian</MenuItem>
                        </Select>
                    </div>
                    {!auth.isAuthenticated && (
                    <div>
                        <Button color='white'>
                            <NavLink to="/authorization"
                                     style={{color: 'white', textDecoration: 'none'}}
                                     activeStyle={{
                                fontWeight: "normal",
                                color: "white",
                                textDecoration: "none"
                            }}>Sign in</NavLink>
                        </Button>
                    </div>
                    )}
                    {auth.isAuthenticated && (
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={profileHandler}>Profile</MenuItem>
                                <MenuItem onClick={handleClose}>My fanfics</MenuItem>
                                <MenuItem onClick={createHandler}>Create new</MenuItem>
                                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}