import React from "react";
import ReactDOM from "react-dom";
import HomePage from "./HomePage";

function App(props) {
    return (
    <div className="center">
        <HomePage />
    </div>
    );
}

const appDiv = document.getElementById("app");
ReactDOM.render(<App name="Kris"/>, appDiv);