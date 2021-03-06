import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormControl, LinearProgress, FormHelperText } from '@material-ui/core';
import { Link } from "react-router-dom";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Scatter, ComposedChart, LabelList } from 'recharts';
import LinearLoading from "./LinearLoading";

const IntrinsicValuation = () => {
    const [ticker, setTicker] = useState("");
    const [discountRate, setDiscountRate] = useState(1);
    const [pe, setPe] = useState(0);
    const [eps, setEps] = useState(0);
    const [growthOneYear, setGrowthOneYear] = useState(0);
    const [growthFiveYear, setGrowthFiveYear] = useState(0);
    const [result, setResult] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [loading, setLoading] = useState(false);

    const buttonValuation = () => {
        // Disable result to reload
        setResult(false);
        setLoading(true);

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
            setLoading(true);
            setResult(json);
        }).catch((err) => 
            console.log(err)
        );
    }

    const BarGraph = (result) => {
        if (result) {
            const data = result['Graph'];
            return (
            <ComposedChart
                width={325}
                height={500}
                data={data}
                margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
                }}
            >
                <XAxis dataKey="name" />
                <YAxis type="number" domain={['dataMin', 'dataMax']}/>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
                <ReferenceLine y={data[0]['fair']} fill="violett" stroke="#8884d8" />
                <Scatter dataKey="actual" fill="#E7C4F3">
                    <LabelList dataKey="actual" position="left" />
                </Scatter>
                <Scatter dataKey="fair" fill="black">
                    <LabelList dataKey="fair" position="top" />
                </Scatter>
                <Scatter dataKey="upper" fill="red">
                    <LabelList dataKey="upper" position="left" />
                </Scatter>
                <Scatter dataKey="lower" fill="#82ca9d">
                    <LabelList dataKey="lower" position="top" />
                </Scatter>
                <Scatter dataKey="in5years" fill="#226DFF">
                    <LabelList dataKey="in5years" position="left" />
                </Scatter>
            </ComposedChart>
            );
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
                        defaultValue={0}
                        inputProps={{
                            style: {textAlign: "center"}
                        }}
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
                required
                label="Required"
                variant="outlined"
                require={true}
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
            onClick={buttonValuation}
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
            {loading && !result && <LinearLoading info={"Fetching Data and Calculating"}/>}
            {result && BarGraph(result)}
        </Grid>
    </Grid>
    );
}

export default IntrinsicValuation;