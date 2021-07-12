import React from 'react'
import {Switch, Route, Redirect} from "react-router-dom"
import {CreatePage} from "./pages/CreatePage"
import {ProfilePage} from "./pages/ProfilePage"
import {MainPage} from "./pages/MainPage"
import {AuthPage} from "./pages/AuthPage"
import {RegPage} from "./pages/RegPage"
import {ChapterPage} from "./pages/ChapterPage"
import {EditFanficPage} from "./pages/EditFanficPage"
import {DetailPage} from "./pages/DetailPage"
import {ReadPage} from "./pages/ReadPage"
import {AllFanficsPage} from "./pages/AllFanficsPage"


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
                <Route path="/create/:id/chapter" exact>
                    <ChapterPage/>
                </Route>
                <Route path="/fanfics/:id/edit" exact>
                    <EditFanficPage/>
                </Route>
                <Route path="/:id/detail" exact>
                    <DetailPage/>
                </Route>
                <Route path="/chapter/:id/read" exact>
                    <ReadPage/>
                </Route>
                <Route path="/fanfics" exact>
                    <AllFanficsPage/>
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
            <Route path="/:id/detail" exact>
                <DetailPage/>
            </Route>
            <Route path="/chapter/:id/read" exact>
                <ReadPage/>
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}