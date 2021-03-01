import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core';
import PortfolioAnalyzer from "./PortfolioAnalyzer";
import StockForecastSVM from "./StockForecastSVM"
import SentimentAnalysis from "./SentimentAnalysis";
import IntrinsicValuation from "./IntrinsicValuation";

export default function HomePage(prop) {
    return (
    <Router>
        <Switch>
            <Route exact path='/'>
                {renderHomePage()}
            </Route>
            <Route exact path='/portfolioanalyzer' component={PortfolioAnalyzer} />
            <Route exact path='/svmforecast' component={StockForecastSVM} />
            <Route exact path='/sentimentanalysis' component={SentimentAnalysis} />
            <Route exact path='/intrinsicvaluation' component={IntrinsicValuation} />
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
        <Grid item xs={6} align="right">
            <Button color="primary" variant="contained" to="/portfolioanalyzer" component={ Link }>
                Portfolio Analyzer
            </Button>
        </Grid>
        <Grid item xs={6} align="left">
            <Button color="primary" variant="contained" to="/svmforecast" component={ Link }>
                Stock Forecast (SVM)
            </Button>
        </Grid>
        <Grid item xs={6} align="right">
            <Button color="primary" variant="contained" to="/sentimentanalysis" component={ Link }>
                Sentiment Analysis
            </Button>
        </Grid>
        <Grid item xs={6} align="left">
            <Button color="primary" variant="contained" to="/intrinsicvaluation" component={ Link }>
                Intrinsic Valuation
            </Button>
        </Grid>
    </Grid>
    );
}

