import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormControl, LinearProgress, FormHelperText, Slider } from '@material-ui/core';
import { Link } from "react-router-dom";
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, Brush, Tooltip, Legend, Scatter, ResponsiveContainer } from 'recharts';
import LinearLoading from "./LinearLoading";

const StockForecastSVM = () => {
    const [ticker, setTicker] = useState("");
    const [day, setDay] = useState(2);
    const [year, setYear] = useState(new Date('2021-01-01T00:00:00'));
    const [result, setResult] = useState(false);
    const [displaySwitch, flipSwitch] = useState(false);
    const [loading, setLoading] = useState(false);

    const buttonTestSVM = () => {
        // Enable forecast, disable test
        flipSwitch(false);
        setResult(false);
        setLoading(true);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                ticker: ticker,
                day: day,
                year: year.toISOString().substring(0, 10)
            })
        };

        fetch("/api/svmforecast", requestOptions).then((response) => 
            response.json()
        ).then((data) => {
            let json = JSON.parse(data);
            console.log(json);
            setLoading(false);
            setResult(json["TestGraph"]);
        }).catch((err) => 
            console.log(err)
        );
    }

    const buttonForecastSVM = () => {
        // Enable forecast, disable test
        flipSwitch(true);
        setResult(false);
        setLoading(true);
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                ticker: ticker,
                day: day,
                year: year.toISOString().substring(0, 10)
            })
        };

        fetch("/api/svmforecast", requestOptions).then((response) => 
            response.json()
        ).then((data) => {
            let json = JSON.parse(data);
            console.log(json);
            setLoading(false);
            setResult(json["PredictGraph"]);
        }).catch((err) => 
            console.log(err)
        );
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
                required
                label="Required"
                variant="outlined"
                placeholder="MSFT"
                type="text"
                inputProps={{
                    min: 0,
                    style: {textAlign: "center"}
                }}
                onChange={(e) => setTicker(e.target.value)}
                error={ticker === ""}
                />
                <FormHelperText>
                    <div align="center">
                        Input the ticker to forecast
                    </div>
                </FormHelperText>
            </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
            <FormControl>
                <Slider
                    defaultValue={day}
                    // getAriaValueText="days"
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={3}
                    onChange={(e, val) => setDay(val)}
                />
                <FormHelperText>
                    <div align="center">
                        Day to Analyze
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
                    label="Select the start date to analyze"
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
            onClick={buttonTestSVM}
            >
                Test Trained Model
            </Button>
            <Button
            color="primary"
            variant="contained"
            onClick={buttonForecastSVM}
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
            {loading && !result && <LinearLoading info={"Fetching data and Trainning Model..."}/>}
            {!displaySwitch && createGraph(result)}
            {displaySwitch && createGraph(result)}
        </Grid>
    </Grid>
    );
}

const createGraph = (result) => {
    if (result) {
        return (
        <ComposedChart
            width={900}
            height={500}
            data={result}
            margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
            }}
        >
            <XAxis dayakey="date" type="category" />
            <YAxis type="number" domain={['auto', 'auto']} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="adj" fill="#F4DDFC" stroke="#8884d8" />
            <Line type="monotone" dataKey="lin" stroke="#FFA300" />
            <Line type="monotone" dataKey="poly" stroke="#017100" />
            <Line type="monotone" dataKey="rbf" stroke="#0020FF" />
            <Brush />
        </ComposedChart>
        );
    }
}

export default StockForecastSVM;