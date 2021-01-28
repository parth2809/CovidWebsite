var activeType = 0 //1 is Cumidental, 0 is Inculative
var activeWeek = 1 // Which week to display first (1-4)
var selectedState = "CA" // Which state to display default information for
var priorState = selectedState // Used for switching between states
var typeStateOrNational = 0 // 0 is state forecasts, 1 is national forecasts
var q = "0.95"
var dateOfForecast = "1/25/21"

var lineColor = "#006A96"
var forecastColor = "#00C6D7"
var quantileColor = "#FFCD00" // C69214

var dfPromiseCumMap = loadJSON('datasets/df_cum.json') // Contains the cumremental predictions
var dfPromiseIncMap = loadJSON('datasets/df_inc.json') // Contains the inculative predictions

var dfPromiseCumTruth = loadJSON('datasets/df_truth_cum.json') // Contains cumremental historical data
var dfPromiseIncTruth = loadJSON('datasets/df_truth_inc.json') // Contains inculative historical data

var dfStatesFutureCum = loadJSON('datasets/df_weekly_cum.json');
var dfStatesFutureInc = loadJSON('datasets/df_weekly_inc.json');

var dfQuantilesCum = loadJSON('datasets/df_quant_cum.json');
var dfQuantilesInc = loadJSON('datasets/df_quant_inc.json');

var week1_cum = [];
var week2_cum = [];
var week3_cum = [];
var week4_cum = [];
var statesTruthCum = {};
var statesFutureCum;
var quantilesCum;

var week1_inc = [];
var week2_inc = [];
var week3_inc = [];
var week4_inc = [];
var statesTruthInc = {};
var statesFutureInc;
var quantilesInc;

var weekArray = [];

Highcharts.setOptions({
    lang: {
      thousandsSep: ','
    },
    chart: {
        style: {
            fontFamily: 'Arial'
        }
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

dfStatesFutureCum.then(function (df) {
    statesFutureCum = df

    dfQuantilesCum.then(function (df) {
        quantilesCum = df

        dfPromiseCumTruth.then(function (df) {
            statesTruthCum = df
            chartLineHistorical(statesTruthCum, statesFutureCum, quantilesCum, q,  selectedState);
            
        });

    });

    dfQuantilesInc.then(function (df) {
        quantilesInc = df
    });



    dfPromiseIncTruth.then(function (df) {
        statesTruthInc = df
        
    });

});

dfStatesFutureInc.then(function (df) {
    statesFutureInc = df
});

dfPromiseCumMap.then(function (df) {
    // Cumidentals
    for (const state of df) {
        week1_cum.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week1"]});
        week2_cum.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week2"]});
        week3_cum.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week3"]});
        week4_cum.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week4"]});
    };
    updateUSMapWeekDisplay(1); // Draws the map
});

dfPromiseIncMap.then(function (df) {
    // Inculative
    for (const state of df) {
        week1_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week1"]});
        week2_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week2"]});
        week3_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week3"]});
        week4_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week4"]});
    };
});
