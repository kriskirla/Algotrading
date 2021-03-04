import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormControl, MenuItem, Select, Checkbox, FormGroup, Radio, RadioGroup, FormControlLabel, FormHelperText, FormLabel } from '@material-ui/core';
import { Link } from "react-router-dom";
import CanvasJSReact from '../canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core'

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

const showTable = (result) => {
    if (result) {
        return (
        <TableContainer component={Paper} style={{maxHeight: 350}}>
            <Table aria-label="simple table" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Datetime</TableCell>
                        <TableCell align="center">Headline</TableCell>
                        <TableCell align="center">Neg</TableCell>
                        <TableCell align="center">Neu</TableCell>
                        <TableCell align="center">Pos</TableCell>
                        <TableCell align="center">Compound</TableCell>
                        <TableCell align="center">URL</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(result['Table']).map((key) => (
                        <TableRow>
                            <TableCell>{result['Table'][key][0]}</TableCell>
                            <TableCell>{result['Table'][key][1]}</TableCell>
                            <TableCell>{result['Table'][key][2]}</TableCell>
                            <TableCell>{result['Table'][key][3]}</TableCell>
                            <TableCell>{result['Table'][key][4]}</TableCell>
                            <TableCell>{result['Table'][key][5]}</TableCell>
                            <TableCell>
                                <a target="_blank" href={result['Table'][key][6]}>Link</a>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        );
    }
}

export default function SAFinviz() {
    const [ticker, setTicker] = useState('MSFT');
    const [day, setDay] = useState(2);
    const [result, setResult] = useState(false);
    const [staticTicker, setStaticTicker] = useState(false);

    const buttonAnalysis = (ticker, day) => {
        // Enable forecast, disable test
        setResult(false);
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
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                </Select>
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
            {result && showGraph(result, staticTicker)}
            {result && showTable(result, staticTicker)}
        </Grid>
    </Grid>
    );
}