import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import PortfolioAnalyzer from "./PortfolioAnalyzer";
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core';

export default function HomePage(prop) {
    return (
    <Router>
        <Switch>
            <Route exact path='/'>
                {renderHomePage()}
            </Route>
            <Route exact path='/portfolioanalyzer' component={PortfolioAnalyzer} />
        </Switch>
    </Router>
    );
}

function renderHomePage() {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} align="center">
                <Typography variant="h3" compact="h3">
                    Algotrading
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" to="/portfolioanalyzer" component={ Link }>
                    Portfolio Analyzer
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" to="/portfolioview" component={ Link }>
                    Change this
                </Button>
            </Grid>
        </Grid>
    );
}

