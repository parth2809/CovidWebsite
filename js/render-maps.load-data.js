var activeType = 1 //1 is Incidental, 0 is Cumulative
var activeWeek = 1 // Which week to display first (1-4)
var selectedState = "CA" // Which state to display default information for
var q = "0.95"
var dateOfForecast = "10/10/20"

var lineColor = "#006A96"
var forecastColor = "#00C6D7"
var quantileColor = "#FFCD00" // C69214

var dfPromiseIncMap = loadJSON('datasets/df_inc.json') // Contains the incremental predictions
var dfPromiseCumMap = loadJSON('datasets/df_cum.json') // Contains the cumulative predictions

var dfPromiseIncTruth = loadJSON('datasets/df_truth_inc.json') // Contains incremental historical data
var dfPromiseCumTruth = loadJSON('datasets/df_truth_cum.json') // Contains cumulative historical data

var dfStatesFutureInc = loadJSON('datasets/df_weekly_inc.json');
var dfStatesFutureCum = loadJSON('datasets/df_weekly_cum.json');

var dfQuantilesInc = loadJSON('datasets/df_quant_inc.json');
var dfQuantilesCum = loadJSON('datasets/df_quant_cum.json');

var week1_inc = [];
var week2_inc = [];
var week3_inc = [];
var week4_inc = [];
var statesTruthInc = {};
var statesFutureInc;
var quantilesInc;

var week1_cum = [];
var week2_cum = [];
var week3_cum = [];
var week4_cum = [];
var statesTruthCum = {};
var statesFutureCum;
var quantilesCum;

var weekArray = [];

Highcharts.setOptions({
    lang: {
      thousandsSep: ','
    }
  });

// Loads JSON objects into promise objects
async function loadJSON(path) {
	let response = await fetch(path);
	let df = await response.json();
	return df;
};

// Promise functions read from the JSON object in loadJSON and then add them to arrays,
// Before finally generating the lines

dfStatesFutureInc.then(function (df) {
    statesFutureInc = df
    //chartForecastLine(statesFutureInc, selectedState)

    dfQuantilesInc.then(function (df) {
        quantilesInc = df

        dfPromiseIncTruth.then(function (df) {
            statesTruthInc = df
            chartLineHistorical(statesTruthInc, statesFutureInc, quantilesInc, q,  selectedState);
            
        });

    });

    dfQuantilesCum.then(function (df) {
        quantilesCum = df
    });



    dfPromiseCumTruth.then(function (df) {
        statesTruthCum = df
        
    });

});

dfStatesFutureCum.then(function (df) {
    statesFutureCum = df
});

dfPromiseIncMap.then(function (df) {
    // Incidentals
    for (const state of df) {
        week1_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week1"]});
        week2_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week2"]});
        week3_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week3"]});
        week4_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week4"]});
    };
    updateUSMapWeekDisplay(1); // Draws the map
});

dfPromiseCumMap.then(function (df) {
    // Cumulative
    for (const state of df) {
        week1_cum.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week1"]});
        week2_cum.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week2"]});
        week3_cum.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week3"]});
        week4_cum.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week4"]});
    };
});