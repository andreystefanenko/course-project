import React, {useState} from 'react'
import {useRoutes} from "./routes"
import {BrowserRouter as Router} from "react-router-dom"
import {useAuth} from "./hooks/auth.hook"
import {AuthContext} from "./context/AuthContext"
import {Navbar} from "./components/Navbar"
import {Loader} from "./components/Loader"
import {IntlProvider} from 'react-intl'
import enMessages from './localization/en.json'
import ruMessages from './localization/ru.json'
import locales from './localization/locale'

const messages = {
    [locales.EN] : enMessages,
    [locales.RU] : ruMessages
}

function App() {
    const [language, setLanguage] = useState(locales.EN)
    const {token, login, logout, userId, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)

        if (!ready) {
           return  <Loader/>
        }

      return (
          <AuthContext.Provider value={{
          login,logout, token, userId, isAuthenticated
          }}>
              <IntlProvider messages={messages[language]} locale={language} defaultLocale={locales.EN}>
                  <Router>
                      <Navbar value={language} onChange={setLanguage}/>
                    <div >
                      {routes}
                    </div>
                  </Router>
              </IntlProvider>
          </AuthContext.Provider>

      );
    }

    export default App;
