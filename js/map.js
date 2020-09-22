var activeType = 1 //1 is Incidental, 0 is Cumulative
var activeWeek = 1 // Which week to display first (1-4)
var selectedState = "CA" // Which state to display default information for

var dfPromiseInc = loadJSON('datasets/df_inc.json') // Contains the incremental predictions
var dfPromiseCum = loadJSON('datasets/df_cum.json') // Contains the cumulative predictions
var dfPromiseIncTruth = loadJSON('datasets/df_truth_inc.json') // Contains incremental historical data
var dfPromiseCumTruth = loadJSON('datasets/df_truth_cum.json') // Contains cumulative historical data

var week1_inc = [];
var week2_inc = [];
var week3_inc = [];
var week4_inc = [];
var states_truth_inc = {};

var week1_cum = [];
var week2_cum = [];
var week3_cum = [];
var week4_cum = [];
var states_truth_cum = {};

var weekArray = [];
var states_inc = {};
var states_cum = {};


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
            + ' Ahead 9/7/20'
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
            y: 20,
        },

        mapNavigation: {
            enabled: true
        },
        credits: {
            enabled: false
        },    

        colorAxis: {
            min: 1,
            type: 'linear',
            minColor: '#EEEEFF',
            maxColor: '#000022',
            stops: [
                [0, '#EFEFFF'],
                [0.67, '#4444FF'],
                [1, '#000022']
            ],
        },

        series: [{
            data: data,
            point: {
                events: {
                    mouseOver: function () {
                        //selectedState = this.code.slice(3).toUpperCase()
                        //chartLine((activeType > 0 ? states_inc : states_cum), selectedState);
                        //chartLineDetailed((activeType > 0 ? states_truth_inc : states_truth_cum), selectedState);
                    },
                    click: function () {
                        selectedState = this.code.slice(3).toUpperCase()
                        chartLine((activeType > 0 ? states_inc : states_cum), selectedState);
                        chartLineDetailed((activeType > 0 ? states_truth_inc : states_truth_cum), selectedState);
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
function chartLine(states_df, state_code) {
    state = [{"name": state_code, "data": states_df[state_code] }]
    Highcharts.chart('states-line', {

        title: {
            text: 'Point Estimates for ' + (activeType > 0 ? 'Incidental' : 'Cumulative') + ' Deaths for ' + state_code
            + ' Ahead 9/7/20'
        },
    
        yAxis: {
            title: {
                text: (activeType > 0 ? 'Incidental' : 'Cumulative') + ' Deaths'
            }
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
function chartLineDetailed(states_true_df, state_code) {
    state_true = [{"name": state_code, "data": states_true_df[state_code] }]
    Highcharts.chart('graph', {

        title: {
            text: 'Weekly ' + (activeType > 0 ? 'Incidental' : 'Cumulative') + ' Death Forecasts For ' + state_code
        },
    
        yAxis: {
            title: {
                text: 'Deaths'
            }
        },

        xAxis: {
            type: "datetime",
            labels: {
              formatter: function() {
                return Highcharts.dateFormat('%Y/%b/%e', this.key);
              }
            },
            title: {
                text: 'Date'
            }
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

            }
        },
    
        series: state_true,
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
        stateType = states_inc;
        stateTruthType = states_truth_inc;
    } else {
        stateType = states_cum;
        stateTruthType = states_truth_cum;
    }

    chartLine(stateType, selectedState)
    chartLineDetailed(stateTruthType, selectedState);
};

// Promise functions read from the JSON object in loadJSON and then add them to arrays,
// Before finally generating the lines
dfPromiseInc.then(function (df) {
    // Incidentals
    for (const state of df) {
        week1_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week1"]});
        week2_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week2"]});
        week3_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week3"]});
        week4_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week4"]});
        states_inc[state["code"]] = [state["week1"], state["week2"], state["week3"], state["week4"]]
    };
    updateUSMapWeekDisplay(1); // Draws the map
    chartLine(states_inc, selectedState)
});

dfPromiseCum.then(function (df) {
    // Cumulative
    for (const state of df) {
        week1_cum.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week1"]});
        week2_cum.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week2"]});
        week3_cum.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week3"]});
        week4_cum.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week4"]});
        states_cum[state["code"]] = [state["week1"], state["week2"], state["week3"], state["week4"]]
    };
});

dfPromiseIncTruth.then(function (df) {
    for (let key in df[0]){
        if(key=="code"){
            continue;
        }else{
            weekArray.push([]);
        }
    }
    for (const state_true of df) {
        for(let key in state_true){
            if(key=="code"){
                states_truth_inc[state_true["code"]]=[]
                continue;
            }
            else{
                states_truth_inc[state_true["code"]].push([key,state_true[key]])
            }
        }
    };
    chartLineDetailed(states_truth_inc, selectedState);
    
});

dfPromiseCumTruth.then(function (df) {
    console.log(df)
    for (let key in df[0]){
        if(key=="code"){
            continue;
        }else{
            weekArray.push([]);
        }
    }
    // Cumulative
    for (const state_true of df) {
        for(let key in state_true){
            if(key=="code"){
                states_truth_cum[state_true["code"]]=[]
                continue;
            }
            else{
                states_truth_cum[state_true["code"]].push([key,state_true[key]])
            }
        }
    };
    
});
