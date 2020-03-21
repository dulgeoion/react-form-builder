import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import { Header } from "./cointainers/Header";
import { LoginPage } from "./cointainers/LoginPage";
import { AuthorizedPage } from "./cointainers/AuthorizedPage";
import StructureBuilder from "./cointainers/StructureBuilder";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "./intl";
import DisplayCategories from "./cointainers/DisplayCategories";

import { useUser } from "./context";
// import

function App() {
  const { user } = useUser();

  console.log("TCL: App -> user.locale", user.locale);
  return user.loading ? (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "10rem"
      }}
    >
      Loading
    </div>
  ) : (
    <IntlProvider locale={user.locale} messages={messages[user.locale]}>
      <div className="App">
        <Header isLoggedIn={user.isLoggedIn} />
        <Router>
          <Switch>
            <Route
              path="/"
              exact
              component={user.isLoggedIn ? AuthorizedPage : LoginPage}
            />
            <Route path="/builder" exact component={StructureBuilder} />
            <Route path="/display" exact component={DisplayCategories} />
            {/* <Route path="/" component={LoginPage} /> */}
          </Switch>
        </Router>
      </div>
    </IntlProvider>
  );
}

export default App;
