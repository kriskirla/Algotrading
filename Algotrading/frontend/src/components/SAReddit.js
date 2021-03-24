import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormControl, MenuItem, Select, LinearProgress, FormHelperText, Slider, capitalize } from '@material-ui/core';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Scatter, ComposedChart, LabelList } from 'recharts';
import PaperTable from "./PaperTable"
import LinearLoading from "./LinearLoading";

const SAReddit = () => {
    const [ticker, setTicker] = useState("");
    const [day, setDay] = useState(2);
    const [result, setResult] = useState(false);
    const [loading, setLoading] = useState(false);
    var titles = ['Datetime', 'Headline', 'Neg', 'Neu', 'Pos', 'Compound', 'Url'];

    const buttonAnalysis = (ticker, day) => {
        // Enable forecast, disable test
        setResult(false);
        setLoading(true);

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
                Reddit Sentiment Analysis
            </Typography>
        </Grid>
        <Grid item xs={12} align="center">
            <FormControl>
                <TextField 
                required
                label="Required"
                variant="outlined"
                type="text"
                placeholder="MSFT"
                // defaultValue="MSFT"
                inputProps={{
                    min: 0,
                    style: {textAlign: "center"}
                }}
                onChange={(e) => setTicker(e.target.value)}
                error={ticker === ""}
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
            {loading && !result && <LinearLoading info={"Scraping Finviz for data..."}/>}
            {result && HorizontalBarGraph(result)}
            {result && <PaperTable result={result} titles={titles}/>}
        </Grid>
    </Grid>
    );
}

const HorizontalBarGraph = (result) => {
    if (result) {
        const data = result['Graph'];
        return (
        <BarChart
            width={900}
            height={150}
            data={data}
            layout="vertical"
            margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
            }}
        >
            <XAxis dayakey="value" type="number" />
            <YAxis dataKey="date" type="category" reversed />
            <Tooltip />
            <Legend />
            <ReferenceLine x={0} stroke="#000" />
            <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
        );
    }
}

export default SAReddit;