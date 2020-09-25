var activeType = 1 //1 is Incidental, 0 is Cumulative
var activeWeek = 1 // Which week to display first (1-4)
var selectedState = "CA" // Which state to display default information for

var lineColor = "#182B49"

var dfPromiseIncMap = loadJSON('datasets/df_inc.json') // Contains the incremental predictions
var dfPromiseCumMap = loadJSON('datasets/df_cum.json') // Contains the cumulative predictions

var dfPromiseIncTruth = loadJSON('datasets/df_truth_inc.json') // Contains incremental historical data
var dfPromiseCumTruth = loadJSON('datasets/df_truth_cum.json') // Contains cumulative historical data

var dfStatesFutureInc = loadJSON('datasets/df_weekly_inc.json');
var dfStatesFutureCum = loadJSON('datasets/df_weekly_cum.json');


var week1_inc = [];
var week2_inc = [];
var week3_inc = [];
var week4_inc = [];
var states_truth_inc = {};
var statesFutureInc;

var week1_cum = [];
var week2_cum = [];
var week3_cum = [];
var week4_cum = [];
var states_truth_cum = {};
var statesFutureCum;

var weekArray = [];


// Loads JSON objects into promise objects
async function loadJSON(path) {
	let response = await fetch(path);
	let df = await response.json();
	return df;
};

// Charts the USA Map
function chartMap(data, week) {
    // Draws the map, using weekly data and the given week
    Highcharts.mapChart('map', {

        chart: {
            map: 'countries/us/us-all',
            borderWidth: 0
        },

        title: {
            text: 'Point Estimates for ' + (activeType > 0 ? 'Incidental' : 'Cumulative') + ' Deaths ' + 
            week + (week > 1 ? ' Weeks' : ' Week')
            + ' Ahead 9/7/20',
        },

        exporting: {
            sourceWidth: 600,
            sourceHeight: 500
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            borderWidth: 0,
            backgroundColor: 'rgba(255,255,255,0.85)',
            floating: false,
            verticalAlign: 'middle',
        },

        mapNavigation: {
            enabled: true
        },
        credits: {
            enabled: false
        },    

        colorAxis: {
            min: 1,
            type: 'logarithmic',
            minColor: '#EEEEEE',
            maxColor: '#222222',
            stops: [
                [0, '#EEEEEE'],
                [0.67, '#444444'],
                [1, '#222222']
            ],
        },

        series: [{
            data: data,
            point: {
                events: {
                    mouseOver: function () {
                        //selectedState = this.code.slice(3).toUpperCase()
                        //chartLine((activeType > 0 ? statesFutureInc : statesFutureCum), selectedState);
                        //chartLineDetailed((activeType > 0 ? states_truth_inc : states_truth_cum), selectedState);
                    },
                    click: function () {
                        selectedState = this.code.slice(3).toUpperCase()
                        chartForecastLine((activeType > 0 ? statesFutureInc : statesFutureCum), selectedState);
                        chartLineHistorical(
                            (activeType > 0 ? states_truth_inc : states_truth_cum),
                            (activeType > 0 ? statesFutureInc : statesFutureCum),
                            selectedState);
                    },
                },
            },
            joinBy: ['hc-key', 'code'],
            dataLabels: {
                enabled: false,
                color: '#FFFFFF',
                format: '{point.name}',
            },
            borderColor: 'black',
            borderWidth: 0.2,
            name: 'Point Estimate',
            tooltip: {
                pointFormat: '{point.name}: {point.value}',
                valueDecimals: 3,
            }
        }]
    });
};

// Charts the Weekly Forecast Chart
function chartForecastLine(states_df, state_code) {
    state = [{
        "name": state_code, 
        "data": states_df[state_code]
    }];
    Highcharts.chart('states-line', {

        title: {
            text: 'Forecasts for ' + (activeType > 0 ? 'Incidental' : 'Cumulative') + ' Deaths for ' + state_code
            + ' Ahead 9/7/20',
            style: {
                fontSize: '12px'
            }
        },
    
        yAxis: {
            title: {
                text: (activeType > 0 ? 'Incidental' : 'Cumulative') + ' Deaths'
            }
        },

        xAxis: {
            title: {
                text: "Week Number"
            },
            type: 'datetime',
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart:1,
                color: lineColor,
            }
        },
    
        series: state,
        credits: {
            enabled: false
        },
    
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
    });
};

// Charts the Detailed Historical Chart
function chartLineHistorical(statesTrue, statesFuture, state_code) {
    console.log(statesFuture )
    Highcharts.chart('graph', {

        title: {
            text: 'Historical Weekly ' + (activeType > 0 ? 'Incidental' : 'Cumulative') + ' Deaths For ' + state_code
        },
    
        yAxis: {
            title: {
                text: 'Deaths'
            }
        },

        xAxis: {
            title: {
                text: 'Date'
            },
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%b %e'
            }
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                color: lineColor,
            }
        },
    
        series: [
            {
                name: "Historical Data",
                data: statesTrue[state_code] 
            },
            {
                name: "Forecasted Data",
                data: statesFuture[state_code],
                color: '#006A96', 
        }],

        credits: {
            enabled: false
        },
    
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
    });
};

// Updates the US Map (used for updating week number, also called in updateGraphs)
function updateUSMapWeekDisplay(week) {
    // sets and updates the chart with the appropriate type and week number, and then draws the map
    // activeType determines incidental or cumulative
    // week determines week number
    activeWeek = week
    if (activeType == 0) {
        switch (week) {
            case 1:
                chartMap(week1_cum, week);
                break;
            case 2:
                chartMap(week2_cum, week);
                break;
            case 3:
                chartMap(week3_cum, week);
                break;
            case 4:
                chartMap(week4_cum, week);
                break;
        }
    } else {
        switch (week) {
            case 1:
                chartMap(week1_inc, week);
                break;
            case 2:
                chartMap(week2_inc, week);
                break;
            case 3:
                chartMap(week3_inc, week);
                break;
            case 4:
                chartMap(week4_inc, week);
                break;
        }
    }
};

// Updates all of the graphs (used when either type or location is changed)
function updateGraphs(level) {
    // Sets the activeType (1 is Incidental, 0 is Cumulative)
    activeType = level;
    updateUSMapWeekDisplay(activeWeek);

    if (activeType == 1) {
        statesFutureType = statesFutureInc;
        statesTruthType = states_truth_inc;
    } else {
        statesFutureType = statesFutureCum;
        statesTruthType = states_truth_cum;
    }

    chartForecastLine(statesFutureType, selectedState);
    chartLineHistorical(statesTruthType, statesFutureType, selectedState);
};

// Promise functions read from the JSON object in loadJSON and then add them to arrays,
// Before finally generating the lines

dfStatesFutureInc.then(function (df) {
    statesFutureInc = df
    chartForecastLine(statesFutureInc, selectedState)

    dfPromiseIncTruth.then(function (df) {
        states_truth_inc = df
        chartLineHistorical(states_truth_inc, statesFutureInc ,selectedState);
        
    });

    dfPromiseCumTruth.then(function (df) {
        states_truth_cum = df
        
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





