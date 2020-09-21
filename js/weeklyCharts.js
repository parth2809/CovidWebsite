var dfPromiseCum = loadJSON('datasets/df_truth_cum.json')
var states_cum = {}
var weekArray = []
function chartMap(data, week) {
    // Draws the map, using weekly data and the given week
    
};

function chartLine(states_df, state_code) {
    state = [{"name": state_code, "data": states_df[state_code] }]
    console.log(states_df[state_code])
    Highcharts.chart('states-line', {

        title: {
            text: 'Point Estimates for ' + ' Deaths for ' + state_code
            + ' Ahead 9/7/20'
        },
    
        yAxis: {
            title: {
                text: ' Deaths'
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
                pointStart:0,
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

dfPromiseCum.then(function (df) {
    for (var key in df[0]){
        if(key=="code"){
            continue;
        }else{
            weekArray.push([]);
        }
    }
    var i = 0;
    var j = 0;
    // Cumulative
    for (const state of df) {
        for(var key in state){
            if(key=="code"){
                states_cum[state["code"]]=[]
                continue;
            }
            else{
                states_cum[state["code"]].push(state[key])
            }
        }
    };

    
});

function test() {
    chartLine(states_cum, "CA");
}