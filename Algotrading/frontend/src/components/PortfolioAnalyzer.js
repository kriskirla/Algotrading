import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormControl, Checkbox, FormGroup, Radio, RadioGroup, FormControlLabel, FormHelperText, FormLabel } from '@material-ui/core'
import { Link } from "react-router-dom"

function buttonCreatePortfolio(fund, sp, dow) {
    if (!(sp || dow)) {
        sp = true;
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            fund: fund,
            sp: sp,
            dow: dow
        })
    };
    fetch("/api/portfolioanalyzer", requestOptions).then((response) => 
        response.json()
    ).then((data) => 
        console.log(data)
    );
}

export default function PortfolioAnalyzer(prop) {
    const [fund, setFund] = useState(10000);
    const [sp, setSp] = useState(false);
    const [dow, setDow] = useState(false);

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
            <Button
            color="primary"
            variant="contained"
            onClick={() => buttonCreatePortfolio(fund, sp, dow)}
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
    </Grid>
    );
}