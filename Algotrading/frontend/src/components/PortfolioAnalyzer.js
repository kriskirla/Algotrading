import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormControl, Checkbox, FormGroup, Radio, RadioGroup, FormControlLabel, FormHelperText, FormLabel } from '@material-ui/core';
import { Link } from "react-router-dom";
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, makeStyles } from '@material-ui/core'

const PortfolioAnalyzer = () => {
    const [fund, setFund] = useState(10000);
    const [sp, setSp] = useState(false);
    const [dow, setDow] = useState(false);
    const [startDate, setStartDate] = useState(new Date('2018-01-01'));
    const [endDate, setEndDate] = useState(new Date('2021-01-01'));
    const [result, setResult] = useState(false);

    const buttonCreatePortfolio = (fund, sp, dow, startDate, endDate) => {
        if (!(sp || dow)) {
            sp = true;
        }
    
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                fund: fund,
                sp: sp,
                dow: dow,
                start_date: startDate.toISOString().substring(0, 10),
                end_date: endDate.toISOString().substring(0, 10)
            })
        };

        fetch("/api/portfolioanalyzer", requestOptions).then((response) => 
            response.json()
        ).then((data) => {
            let json = JSON.parse(data);
            setResult(json);
            console.log(json);
        }).catch((err) => 
            console.log(err)
        );
    }

    const createTable = (result) => {
        if (result) {
            return (
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Ticker</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Allocation</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="right">Industry</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(result).map((key) => (
                            <TableRow>
                                <TableCell>{key}</TableCell>
                                {result[key].map((row) =>
                                    <TableCell>{row}</TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            );
        }
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
                    label="DOW" 
                    labelPlacement="start" 
                    onChange={() => setDow(!dow)} 
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
                defaultValue="10000"
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
                    format="yyyy-mm-dd"
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
                        format="yyyy-mm-dd"
                        margin="normal"
                        id="date-picker-inline"
                        label="Start Date of Analysis"
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
            onClick={() => buttonCreatePortfolio(fund, sp, dow, startDate, endDate)}
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
            {createTable(result)}
        </Grid>
    </Grid>
    );
}

export default PortfolioAnalyzer;