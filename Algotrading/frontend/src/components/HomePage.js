import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom"
import PortfolioAnalyzer from "./PortfolioAnalyzer";

export default function HomePage(prop) {
    return (
    <Router>
        <Switch>
            <Route exact path='/'>
                <p>This is the home page</p>
            </Route>
            <Route path='/portfolioanalyzer' component={PortfolioAnalyzer} />
        </Switch>
    </Router>
    );
}