import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormControl, MenuItem, Select, Checkbox, FormGroup, Radio, RadioGroup, FormControlLabel, FormHelperText, FormLabel } from '@material-ui/core';
import { Link } from "react-router-dom";
import CanvasJSReact from '../canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, makeStyles } from '@material-ui/core'

const IntrinsicValuation = () => {
    const [ticker, setTicker] = useState('MSFT');
    const [discountRate, setDiscountRate] = useState(1.1);
    const [pe, setPe] = useState(0);
    const [eps, setEps] = useState(0);
    const [growthOneYear, setGrowthOneYear] = useState(0);
    const [growthFiveYear, setGrowthFiveYear] = useState(0);
    const [result, setResult] = useState(false);
    const [staticTicker, setStaticTicker] = useState(false);
    const [hidden, setHidden] = useState(false);

    const buttonValuation = (ticker, discountRate, pe, eps, growthOneYear, growthFiveYear) => {
        // Disable result to reload
        setResult(false);
        setStaticTicker(ticker);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                ticker: ticker,
                discount_rate: discountRate,
                pe: pe,
                eps: eps,
                growth_one_year: growthOneYear,
                growth_five_years: growthFiveYear
            })
        };

        fetch("/api/intrinsicvaluation", requestOptions).then((response) => 
            response.json()
        ).then((data) => {
            let json = JSON.parse(data);
            console.log(json);
            setResult(json);
        }).catch((err) => 
            console.log(err)
        );
    }

    const showStackedBar = (result) => {
        if (result) {
            var chart = 
            {
                title:{
                    text: staticTicker + " Intrinsic Value",
                    fontWeight: "lighter",
                    // fontColor: "#008B8B",
                    fontFamily: "tahoma"
                },
                legend: {
                    verticalAlign: "center",
                    horizontalAlign: "right"
                },
                data: [
                    {
                        type: "column",
                        color: "#E6E6E6",
                        name: "Current Price ($" + result['PE_EPS_Model'][0] + ")",
                        showInLegend: true,
                        dataPoints: [
                            {x: new Date(), y: result['PE_EPS_Model'][0]}
                        ]
                    },
                    {
                        type: "scatter",
                        color: "#000000",
                        name: "Fair Price ($" + result['PE_EPS_Model'][1] + ")",
                        showInLegend: true,
                        dataPoints: [
                            {x: new Date(), y: result['PE_EPS_Model'][1]}
                        ]
                    },
                    {
                        type: "scatter",
                        color: "#FF0000",
                        name: "Upper Bound ($" + result['PE_EPS_Model'][2] + ")",
                        showInLegend: true,
                        dataPoints: [
                            {x: new Date(), y: result['PE_EPS_Model'][2]}
                        ]
                    },
                    {
                        type: "scatter",
                        color: "#00C604",
                        name: "Lower Bound ($" + result['PE_EPS_Model'][3] + ")",
                        showInLegend: true,
                        dataPoints: [
                            {x: new Date(), y: result['PE_EPS_Model'][3]}
                        ]
                    },
                    {
                        type: "scatter",
                        color: "#007DFF",
                        name: "Expected 5yr ($" + result['PE_EPS_Model'][4] + ")",
                        showInLegend: true,
                        dataPoints: [
                            {x: new Date(), y: result['PE_EPS_Model'][4]}
                        ]
                    }
                ]
            };
            return (
                <CanvasJSChart options = {chart}/>
            )
        }
    }

    const hiddenInputs = () => {
        return (
        <div align="center">
            <FormHelperText>
                <div align="center">
                    Leave the fields as default unless you know what you're doing.
                </div>
            </FormHelperText>
            <Grid container spacing={3} justify="center">
                <Grid item xs={2}>
                    <FormControl>
                        <TextField 
                        require={true}
                        type="text"
                        defaultValue={discountRate}
                        inputProps={{
                            style: {textAlign: "center"}
                        }}
                        defaultValue={discountRate}
                        onChange={(e) => setDiscountRate(e.target.value)}
                        />
                        <FormHelperText>
                            <div align="center">
                                Discount Rate
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl>
                        <TextField 
                        require={true}
                        type="text"
                        defaultValue={pe}
                        inputProps={{
                            style: {textAlign: "center"}
                        }}
                        defaultValue={pe}
                        onChange={(e) => setPe(e.target.value)}
                        />
                        <FormHelperText>
                            <div align="center">
                                P/E Ratio
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl>
                        <TextField 
                        require={true}
                        type="text"
                        defaultValue={eps}
                        inputProps={{
                            style: {textAlign: "center"}
                        }}
                        defaultValue={eps}
                        onChange={(e) => setEps(e.target.value)}
                        />
                        <FormHelperText>
                            <div align="center">
                                EPS (TTM)
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl>
                        <TextField 
                        require={true}
                        type="text"
                        defaultValue={growthOneYear}
                        inputProps={{
                            style: {textAlign: "center"}
                        }}
                        defaultValue={growthOneYear}
                        onChange={(e) => setGrowthOneYear(e.target.value)}
                        />
                        <FormHelperText>
                            <div align="center">
                                Expected Growth 1yr
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl>
                        <TextField 
                        require={true}
                        type="text"
                        defaultValue={growthFiveYear}
                        inputProps={{
                            style: {textAlign: "center"}
                        }}
                        defaultValue={growthFiveYear}
                        onChange={(e) => setGrowthFiveYear(e.target.value)}
                        />
                        <FormHelperText>
                            <div align="center">
                                Expected Growth 5yr
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>
        </div>
        );
    }

    return (
    <Grid container spacing={1} cellHeight={180}>
        <Grid item xs={12} align="center">
            <Typography component="h4" variant="h4">
                Stock Intrinsic Valuation
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
            <Button
                size="small"
                onClick={() => setHidden(!hidden)}
                >
                    Advanced Settings
            </Button>
        </Grid>
        <Grid item xs={12} align="center">
            {hidden && hiddenInputs()}
        </Grid>
        <Grid item xs={12} align="center">
            <Button
            color="primary"
            variant="contained"
            onClick={() => buttonValuation(ticker, discountRate, pe, eps, growthOneYear, growthFiveYear)}
            >
                Show Intrinsic Valuation
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
            {result && showStackedBar(result)}
        </Grid>
    </Grid>
    );
}

export default IntrinsicValuation;