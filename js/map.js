var activeType = 1 //1 is Incidental, 0 is Cumulative

var week1_inc = [];
var week2_inc = [];
var week3_inc = [];
var week4_inc = [];

var week1_cum = [];
var week2_cum = [];
var week3_cum = [];
var week4_cum = [];

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
            layout: 'horizontal',
            borderWidth: 0,
            backgroundColor: 'rgba(255,255,255,0.85)',
            floating: true,
            verticalAlign: 'top',
            y: 20
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
                    click: function () {
                        chartLine((activeType > 0 ? states_inc : states_cum), this.code.slice(3).toUpperCase());
                    },
                },
            },
            joinBy: ['hc-key', 'code'],
            dataLabels: {
                enabled: true,
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
}

async function loadJSON(path) {
	let response = await fetch(path);
	let df = await response.json();
	return df;
}

function directState(week) {
    // sets and updates the chart with the appropriate type and week number, and then draws the map
    // activeType determines incidental or cumulative
    // week determines week number
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
}

function setActiveType(level) {
    // Sets the activeType (1 is Incidental, 0 is Cumulative)
    activeType = level;
}


var dfPromiseInc = loadJSON('http://192.168.0.130:8080/datasets/df_inc.json')
var dfPromiseCum = loadJSON('http://192.168.0.130:8080/datasets/df_cum.json')
var states_inc = {}
var states_cum = {}

// Will wait for and then append to respective array
dfPromiseInc.then(function (df) {
    // Incidentals
    for (const state of df) {
        week1_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week1"]});
        week2_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week2"]});
        week3_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week3"]});
        week4_inc.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week4"]});
        states_inc[state["code"]] = [state["week1"], state["week2"], state["week3"], state["week4"]]
    };
    directState(1); // Draws the map
    chartLine(states_inc, "CA")
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

