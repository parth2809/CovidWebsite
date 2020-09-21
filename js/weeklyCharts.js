var dfPromiseCum = loadJSON('datasets/df_truth_cum.json')
var dfPromiseInc = loadJSON('datasets/df_truth_inc.json')
var states_truth_cum = {}
var states_truth_inc = {}
var weekArray = []
function chartMap(data, week) {
    // Draws the map, using weekly data and the given week
    
};

function chartLineDetailed(states_true_df, state_code) {
    console.log(states_true_df)
    state_true = [{"name": state_code, "data": states_true_df[state_code] }]
    Highcharts.chart('graph', {

        title: {
            text: 'Weekly Death Forecasts For ' + state_code
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
}

async function loadJSON(path) {
	let response = await fetch(path);
	let df = await response.json();
	return df;
}

dfPromiseCum.then(function (df) {
    console.log(df)
    for (let key in df[0]){
        if(key=="code"){
            continue;
        }else{
            weekArray.push([]);
        }
    }
    var i = 0;
    var j = 0;
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
    console.log(states_truth_cum)
    
});


dfPromiseInc.then(function (df) {
    console.log(df)
    for (let key in df[0]){
        if(key=="code"){
            continue;
        }else{
            weekArray.push([]);
        }
    }
    var i = 0;
    var j = 0;
    // Cumulative
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
    console.log(states_truth_inc)
    
});

function test() {
    console.log(states_truth_cum)
    chartLineDetailed(states_truth_cum, "CA");
}

function test1() {
    console.log(states_truth_cum)
    chartLineDetailed(states_truth_inc, "CA");
}