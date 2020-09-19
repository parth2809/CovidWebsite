var week1 = [];
var week2 = [];
var week3 = [];
var week4 = [];

function chartMap(data) {
    // Instantiate the map
    Highcharts.mapChart('map', {

        chart: {
            map: 'countries/us/us-all',
            borderWidth: 0
        },

        title: {
            text: 'Point Estimates for Incidental Deaths 1 Week Ahead 9/7/20'
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
            y: 25
        },

        mapNavigation: {
            enabled: true
        },

        colorAxis: {
            min: 1,
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
            joinBy: ['hc-key', 'code'],
            dataLabels: {
                enabled: true,
                color: '#FFFFFF',
                format: ''
            },
            borderColor: 'black',
            borderWidth: 0.2,
            name: 'Point Estimate',
            tooltip: {
                pointFormat: '{point.code}: {point.value}',
                valueDecimals: 2,
            }
        }]
    });
};

async function loadJSON(path) {
	let response = await fetch(path);
	let dataset = await response.json();
	return dataset;
}

function selectType(chart) {
    let dfPromise;
    if (chart == 0) {
        dfPromise = loadJSON('http://192.168.0.130:8080/datasets/df_inc.json')
    }
    else {
        dfPromise = loadJSON('http://192.168.0.130:8080/datasets/df_cum.json')
    }

    week1 = [];
    week2 = [];
    week3 = [];
    week4 = [];

    dfPromise.then(function (df) {
        for (const state of df) {
            week1.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week1"]});
            week2.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week2"]});
            week3.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week3"]});
            week4.push({"code": "us-" + state["code"].toLowerCase(),"value": state["week4"]});
        };
        chartMap(week3)
    });
}

selectType(1)