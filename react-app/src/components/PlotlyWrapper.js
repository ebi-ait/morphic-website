// src/components/PlotlyWrapper.js
import loadable from "@loadable/component"
import React from "react"

// Dynamically import react-plotly.js. This tells Gatsby's Webpack
// to load this code only on the client (in the browser).
const Plot = loadable(() => import("react-plotly.js"))

const PlotlyWrapper = (props) => {
  // Pass all props through to the actual Plot component
  return <Plot {...props} />
}

export default PlotlyWrapper
