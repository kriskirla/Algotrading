import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormControl, Checkbox, FormGroup, Radio, RadioGroup, FormControlLabel, FormHelperText, FormLabel } from '@material-ui/core';
import { Link } from "react-router-dom";
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import CanvasJSReact from '../canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const StockForecastSVM = () => {
    const [ticker, setFund] = useState('MSFT');
    const [year, setYear] = useState(new Date('2021-01-01T00:00:00'));
    const [result, setResult] = useState(false);
    const [displaySwitch, flipSwitch] = useState(false);
    const [staticTicker, setStaticTicker] = useState(false);

    const buttonTestSVM = (ticker, year) => {
        // Enable forecast, disable test
        flipSwitch(false);
        setResult(false);
        setStaticTicker(ticker);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                ticker: ticker,
                year: year.toISOString().substring(0, 10)
            })
        };

        fetch("/api/svmtest", requestOptions).then((response) => 
            response.json()
        ).then((data) => {
            let json = JSON.parse(data);
            console.log(json);
            setResult(json);
        }).catch((err) => 
            console.log(err)
        );
    }

    const buttonForecastSVM = (ticker, year) => {
        // Enable forecast, disable test
        flipSwitch(true);
        setResult(false);
        setStaticTicker(ticker);
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                ticker: ticker,
                year: year.toISOString().substring(0, 10)
            })
        };

        fetch("/api/svmforecast", requestOptions).then((response) => 
            response.json()
        ).then((data) => {
            let json = JSON.parse(data);
            console.log(json);
            setResult(json);
        }).catch((err) => 
            console.log(err)
        );
    }

    const createTestGraph = (result) => {
        if (result) {
            var close = [];
            var linear = [];
            var poly = [];
            var rbf = [];

            Object.keys(result).map((key) => {
                close.push({x: new Date(key), y: result[key][0]});
                linear.push({x: new Date(key), y: result[key][1]});
                poly.push({x: new Date(key), y: result[key][2]});
                rbf.push({x: new Date(key), y: result[key][3]});
            });
            
            var chart = 
            {
                title:{
                    text: staticTicker + " SVM Trained Model",
                    fontWeight: "lighter",
                    // fontColor: "#008B8B",
                    fontFamily: "tahoma"
                },
                axisX:{
                    intervalType: "hour",        
                    valueFormatString: "YYYY-MM-DD"
                },
                axisY: {
                    title: "Price(USD)"
                },
                legend: {
                    cursor: "pointer",
                    verticalAlign: "top",
                    horizontalAlign: "center",
                    dockInsidePlotArea: true
                },
                data: [
                {
                    type: "splineArea",
                    name: "Closing Price",
                    showInLegend: true,
                    dataPoints: close
                },
                {
                    type: "line",
                    name: "RBF",
		            showInLegend: true,
                    dataPoints: rbf
                },
                {
                    type: "line",
                    name: "Poly",
		            showInLegend: true,
                    dataPoints: poly
                },
                {
                    type: "line",
                    name: "Linear",
		            showInLegend: true,
                    dataPoints: linear
                }]
            };
            return (
                <CanvasJSChart options = {chart}/>
            )
        }
    }

    const createForecastGraph = (result) => {
        if (result) {
            var linear = [];
            var poly = [];
            var rbf = [];

            Object.keys(result).map((key) => {
                linear.push({x: new Date(key), y: result[key][0]});
                poly.push({x: new Date(key), y: result[key][1]});
                rbf.push({x: new Date(key), y: result[key][2]});
            });
            
            var chart = 
            {
                title:{
                    text: staticTicker + " Forecast",
                    fontWeight: "lighter",
                    // fontColor: "#008B8B",
                    fontFamily: "tahoma"
                },
                axisX:{
                    intervalType: "hour",
                    valueFormatString: "YYYY-MM-DD"
                },
                axisY: {
                    title: "Price(USD)"
                },
                legend: {
                    cursor: "pointer",
                    verticalAlign: "top",
                    horizontalAlign: "center",
                    dockInsidePlotArea: true
                },
                data: [
                {
                    type: "line",
                    name: "RBF",
		            showInLegend: true,
                    dataPoints: rbf
                },
                {
                    type: "line",
                    name: "Poly",
		            showInLegend: true,
                    dataPoints: poly
                },
                {
                    type: "line",
                    name: "Linear",
		            showInLegend: true,
                    dataPoints: linear
                }]
            };
            return (
                <CanvasJSChart options = {chart}/>
            )
        }
    }

    return (
    <Grid container spacing={1}>
        <Grid item xs={12} align="center">
            <Typography component="h4" variant="h4">
                Stock Forecasting using SVM Model
            </Typography>
        </Grid>
        <Grid item xs={12} align="center">
            <FormControl>
                <TextField 
                require={true}
                type="text"
                defaultValue={ticker}
                inputProps={{
                    min: 0,
                    style: {textAlign: "center"}
                }}
                defaultValue={ticker}
                onChange={(e) => setFund(e.target.value)}
                />
                <FormHelperText>
                    <div align="center">
                        Input the ticker to forecast
                    </div>
                </FormHelperText>
            </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    variant="inline"
                    format="yyyy-MM-dd"
                    margin="normal"
                    id="date-picker-inline"
                    label="Select the date to analyze"
                    value={year}
                    onChange={(date) => {setYear(date)}}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12} align="center">
            <Button
            color="secondary"
            variant="contained"
            onClick={() => buttonTestSVM(ticker, year)}
            >
                Test Trained Model
            </Button>
            <Button
            color="primary"
            variant="contained"
            onClick={() => buttonForecastSVM(ticker, year)}
            >
                Show Forecast
            </Button>
        </Grid>
        <Grid item xs={12} align="center">
            <Button
            color="back"
            variant="contained"
            to="/"
            component={Link}
            >
                Back
            </Button>
        </Grid>
        <Grid item xs={12} align="center">
            {!displaySwitch && createTestGraph(result)}
            {displaySwitch && createForecastGraph(result)}
        </Grid>
    </Grid>
    );
}

export default StockForecastSVM;