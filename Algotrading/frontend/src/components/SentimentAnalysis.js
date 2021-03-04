import React, { useState } from "react";
import { AppBar, Tabs, Tab, TabPanel, Paper, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import CanvasJSReact from '../canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
import SAFinviz from './SAFinviz'

export default function SentimentAnalysis () {
    const [tab, setTab] = React.useState(0);

    return (
    <div>
        <Paper square>
            <Tabs
                value={tab}
                indicatorColor="primary"
                textColor="primary"
                onChange={(e, select) => setTab(select)}
                aria-label="disabled tabs example"
            >
                <Tab label="Finviz" />
                <Tab label="Reddit" />
                <Tab label="Yahoo" disabled />
                <Tab label="Metastock" disabled />
                <Tab label="Morningstar" disabled />
                <Tab label="Motley Fool" disabled />
            </Tabs>
        </Paper>
        <hr></hr>
        {tab === 0 && <SAFinviz></SAFinviz>}
        {tab === 2 && <h1>{tab}</h1>}
    </div>
    );
}