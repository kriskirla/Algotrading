import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormControl, Checkbox, FormGroup, LinearProgress, FormControlLabel, FormHelperText } from '@material-ui/core';
import { Link } from "react-router-dom";
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import PaperTable from "./PaperTable";

const PortfolioAnalyzer = () => {
    const [fund, setFund] = useState(10000);
    const [sp, setSp] = useState(false);
    const [nasdaq, setNasdaq] = useState(false);
    const [startDate, setStartDate] = useState(new Date('2018-01-01T00:00:00'));
    const [endDate, setEndDate] = useState(new Date());
    const [result, setResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const titles = ['Ticker', 'Name', 'Allocation', 'Price', 'Total', 'Industry', 'Url'];

    const buttonCreatePortfolio = (fund, sp, nasdaq, startDate, endDate) => {
        // Reset result and apply click
        setResult(false);
        setLoading(true);

        if (!(sp || nasdaq)) {
            sp = true;
        }
    
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                fund: fund,
                sp: sp,
                nasdaq: nasdaq,
                start_date: startDate.toISOString().substring(0, 10),
                end_date: endDate.toISOString().substring(0, 10)
            })
        };

        fetch("/api/portfolioanalyzer", requestOptions).then((response) => 
            response.json()
        ).then((data) => {
            // Need to parse because it contains list as values
            let json = JSON.parse(data);
            console.log(json);
            setLoading(false);
            setResult(json);
        }).catch((err) => 
            console.log(err)
        );
    }

    return (
    <Grid container spacing={1}>
        <Grid item xs={12} align="center">
            <Typography component="h4" variant="h4">
                Portfoilio Analyzer
            </Typography>
        </Grid>
        <Grid item xs={12} align="center">
            <FormHelperText>
                <div align="center">
                    Select the indexes you want to include.
                </div>
                <div align="center">
                    If nothing is selected, it will default to using only S&P500
                </div>
            </FormHelperText>
        </Grid>
        <Grid item xs={12} align="center">
            <FormControl component="fieldset" >
                <FormGroup row defaultValue="true" >
                    <FormControlLabel 
                    control={<Checkbox color="primary"/>} 
                    label="S&P500" labelPlacement="start" 
                    onChange={() => setSp(!sp)} 
                    />
                    <FormControlLabel 
                    control={<Checkbox color="primary"/>} 
                    label="Nasdaq-100" 
                    labelPlacement="start" 
                    onChange={() => setNasdaq(!nasdaq)} 
                    />
                </FormGroup>
            </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
            <FormControl>
                <TextField 
                require={true}
                type="number"
                defaultValue={fund}
                inputProps={{
                    min: 0,
                    style: {textAlign: "center"}
                }}
                defaultValue={fund}
                onChange={(e) => setFund(e.target.value)}
                />
                <FormHelperText>
                    <div align="center">
                        Available fund
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
                    label="Start Date of Analysis"
                    value={startDate}
                    onChange={(date) => {setStartDate(date)}}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
                <KeyboardDatePicker
                        variant="inline"
                        format="yyyy-MM-dd"
                        margin="normal"
                        id="date-picker-inline"
                        label="End Date of Analysis"
                        value={endDate}
                        onChange={(date) => {setEndDate(date)}}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12} align="center">
            <Button
            color="primary"
            variant="contained"
            onClick={() => buttonCreatePortfolio(fund, sp, nasdaq, startDate, endDate)}
            >
                Create Portfolio
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
            {result && <PaperTable result={result} titles={titles}/>}
            {loading && !result && <LinearProgress />}
        </Grid>
    </Grid>
    );
}

export default PortfolioAnalyzer;