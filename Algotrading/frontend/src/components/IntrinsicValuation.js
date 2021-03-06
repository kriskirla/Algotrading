import React, { useState, useRef } from "react";
import { Button, Grid, Typography, TextField, FormControl, LinearProgress, FormHelperText } from '@material-ui/core';
import { Link } from "react-router-dom";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Scatter, ComposedChart, LabelList } from 'recharts';

const IntrinsicValuation = () => {
    const ticker = useRef();
    const discountRate = useRef();
    const pe = useRef();
    const eps = useRef();
    const growthOneYear = useRef();
    const growthFiveYear = useRef();
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
                ticker: ticker.current.value,
                discount_rate: discountRate.current.value,
                pe: pe.current.value,
                eps: eps.current.value,
                growth_one_year: growthOneYear.current.value,
                growth_five_years: growthFiveYear.current.value
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

    const BarGraph = (props) => {
        if (props.result) {
            const data = props.result['graph'];
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
                        defaultValue={1}
                        inputProps={{
                            style: {textAlign: "center"}
                        }}
                        inputRef={discountRate}
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
                        defaultValue={0}
                        inputProps={{
                            style: {textAlign: "center"}
                        }}
                        inputRef={pe}
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
                        defaultValue={0}
                        inputProps={{
                            style: {textAlign: "center"}
                        }}
                        inputRef={eps}
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
                        defaultValue={0}
                        inputProps={{
                            style: {textAlign: "center"}
                        }}
                        inputRef={growthOneYear}
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
                        inputRef={growthFiveYear}
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
                defaultValue="MSFT"
                inputProps={{
                    min: 0,
                    style: {textAlign: "center"}
                }}
                inputRef={ticker}
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
            {result && <BarGraph result={result}/>}
            {/* {result && showStackedBar(result)} */}
            {loading && !result && <LinearProgress />}
        </Grid>
    </Grid>
    );
}

export default IntrinsicValuation;