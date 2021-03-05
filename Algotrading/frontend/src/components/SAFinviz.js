import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormControl, MenuItem, Select, LinearProgress, FormHelperText, Slider } from '@material-ui/core';
import { Link } from "react-router-dom";
import CanvasJSReact from "../canvasjs.react";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
import PaperTable from "./PaperTable"

const showGraph = (result, staticTicker) => {
    if (result) {
        var mean_table = []

        Object.keys(result['Mean']).map((key) => {
            mean_table.push({x: new Date(result['Mean'][key][0] + 'T00:00:00'), y: result['Mean'][key][1]});
        });
        
        var chart = 
        {
            title:{
                text: staticTicker + " Sentiment",
                fontWeight: "lighter",
                // fontColor: "#008B8B",
                fontFamily: "tahoma"
            },
            height: 200,
            axisX:{
                intervalType: "day",
                interval: 1,
                valueFormatString: "YYYY-MM-DD",
            },
            axisY: {
                title: "Sentimental Value",
            },
            data: [
            {
                type: "bar",
                name: "Score",
                showInLegend: true,
                dataPoints: mean_table
            }
            ]
        };
        return (
            <CanvasJSChart options = {chart}/>
        )
    }
}

export default function SAFinviz() {
    const [ticker, setTicker] = useState('MSFT');
    const [day, setDay] = useState(2);
    const [result, setResult] = useState(false);
    const [staticTicker, setStaticTicker] = useState(false);
    const [loading, setLoading] = useState(false);
    var titles = ['Datetime', 'Headline', 'Neg', 'Neu', 'Pos', 'Compound', 'Url'];

    const buttonAnalysis = (ticker, day) => {
        // Enable forecast, disable test
        setResult(false);
        setLoading(true);
        setStaticTicker(ticker);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                ticker: ticker,
                day: day
            })
        };

        fetch("/api/sentimentanalysis", requestOptions).then((response) => 
            response.json()
        ).then((data) => {
            let json = JSON.parse(data);
            console.log(json);
            setLoading(false);
            setResult(json);
        }).catch((err) => 
            console.log(err)
        );
    }

    return (
    <Grid container spacing={1} cellHeight={180}>
        <Grid item xs={12} align="center">
            <Typography component="h4" variant="h4">
                Stock Sentiment Analysis
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
                onChange={(e) => setTicker(e.target.value)}
                />
                <FormHelperText>
                    <div align="center">
                        Input the ticker to analyze
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
            <Button
            color="primary"
            variant="contained"
            onClick={() => buttonAnalysis(ticker, day)}
            >
                Show Sentiment Chart
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
            {loading && !result && <LinearProgress />}
            {result && showGraph(result, staticTicker)}
            {result && <PaperTable result={result} titles={titles}/>}
        </Grid>
    </Grid>
    );
}