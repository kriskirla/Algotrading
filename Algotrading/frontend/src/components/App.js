import React from "react";
import ReactDOM from "react-dom";
import HomePage from "./HomePage";
import PortfolioAnalyzer from "./PortfolioAnalyzer";

function App(props) {
    return (
    <div>
        <HomePage />
    </div>
    );
}

const appDiv = document.getElementById("app");
ReactDOM.render(<App name="Kris"/>, appDiv);