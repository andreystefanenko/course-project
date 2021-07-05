import React from 'react'
import {Switch, Route, Redirect} from "react-router-dom";
import {CreatePage} from "./pages/CreatePage";
import {ProfilePage} from "./pages/ProfilePage";
import {MainPage} from "./pages/MainPage";
import {AuthPage} from "./pages/AuthPage";
import {RegPage} from "./pages/RegPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/" exact>
                    <MainPage/>
                </Route>
                <Route path="/create" exact>
                   <CreatePage/>
                </Route>
                <Route path="/profile/:id" exact>
                    <ProfilePage/>
                </Route>
                <Redirect to ="/"/>
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path="/" exact>
                <MainPage/>
            </Route>
            <Route path="/authorization" exact>
                <AuthPage/>
            </Route>
            <Route path="/registration" exact>
                <RegPage/>
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}