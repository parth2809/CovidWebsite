Highcharts.getJSON('http://192.168.0.130:8080/datasets/df.json', function (data) {


    // Make codes uppercase to match the map data
    data.forEach(function (p) {
        p.code = p.code.toUpperCase();
    });

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
            type: 'logarithmic',
            minColor: '#EEEEFF',
            maxColor: '#000022',
            stops: [
                [0, '#EFEFFF'],
                [0.67, '#4444FF'],
                [1, '#000022']
            ],
        },

        series: [{
            animation: {
                duration: 1000
            },
            data: data,
            joinBy: ['postal-code', 'code'],
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
});
