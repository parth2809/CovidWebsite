var mapChart
var save
// Charts the USA Map
function chartMap(data, week) {
    // Draws the map, using weekly data and the given week
    mapChart = Highcharts.mapChart('map', {

        chart: {
            map: 'countries/us/us-all',
            borderWidth: 0
        },

        title: {
            text: 'Forecasts for ' + (activeType > 0 ? 'New Weekly' : 'Total') + ' Deaths ' + 
            week + (week > 1 ? ' Weeks' : ' Week')
            + ' Ahead ' + dateOfForecast,
        },

        subtitle: {
            text: 'Hover over a state to get the forecast, click on a state to get a detailed chart below'
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
            type: 'linear',
            minColor: '#d0d4da',
            maxColor: '#182B49',
            stops: [
                [0, '#d0d4da'],
                [0.67, '#006A96'],
                [1, '#182B49']
            ],
        },

        series: [{
            data: data,
            point: {
                events: {
                    click: function () {
                        selectedState = this.code.slice(3).toUpperCase();
                        chartLineHistorical(
                            (activeType > 0 ? statesTruthInc : statesTruthCum),
                            (activeType > 0 ? statesFutureInc : statesFutureCum),
                            (activeType > 0 ? quantilesInc : quantilesCum),
                            q,
                            selectedState);
                        selectUSA(0, update=false)
                        window.location = (""+window.location).replace(/#[A-Za-z0-9_]*$/,'')+"#graph"
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
            name: 'Forecast for:',
            tooltip: {
                pointFormat: '{point.name}: {point.value}',
                valueDecimals: 0,
            }
        }]
    });
};

// Charts the Detailed Historical Chart
function chartLineHistorical(statesTrue, statesFuture, quantiles, q,  state_code) {

    // This gets the last known date and adds it to the future guesses as to connect the line
    futureStateWithPrevious = statesFuture[state_code]
    futureStateWithPrevious.unshift(statesTrue[state_code][statesTrue[state_code]["length"] - 1])

    Highcharts.chart('graph', {

        chart: {
            zoomType: 'x'
        },

        title: {
            text: 'Reported ' + (activeType > 0 ? 'New Weekly' : 'Total') + ' Deaths by Week For ' + state_code
        },

        subtitle: {
            text: 'Click and drag cursor over a selected timeframe to zoom into the timeframe'
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

        tooltip: {
            crosshairs: false,
            shared: true,
            useHTML: true,
            formatter() {
                if (this.x == futureStateWithPrevious[0][0]) { // Gets the pseudoguess point from the historical data
                    var output = `<span style=font-size:10px>${ Highcharts.dateFormat('%A, %b %e', new Date(this.x))}</span><br/>`
          
                    // If the point is historical, show, otherwise, hide
                    this.points.forEach(point => {
                      if (point.color == lineColor) {
                        return false
                      } else {
                        output += `<span style=color:${point.color}>●</span> ${point.series.name}: <b>${Math.round(point.y)}</b><br/>`
                      }
                    })
                    return output
                } else {
                  var output = `<span style=font-size:10px>${ Highcharts.dateFormat('%A, %b %e', new Date(this.x))}</span><br/>`
          
                  this.points.forEach(point => {
                    if (point.color == quantileColor) {
                      output += `<span style=color:${point.color}>●</span> ${point.series.name}: <b>${Math.round(point.point.low)}</b> - <b>${Math.round(point.point.high)}</b><br/>`
                    } else {
                      output += `<span style=color:${point.color}>●</span> ${point.series.name}: <b>${Math.round(point.y)}</b><br/>`
                    }
                  })
                  return output
                }
              }
          },
    
        series: [
            {
                name: "Forecasted Data",
                data: futureStateWithPrevious,
                color: forecastColor, 
                zIndex: 1,
                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    enabledThreshold: 0,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            },
            {
                name: "Quantiles",
                data: quantiles[q][state_code],
                type: 'arearange',
                lineWidth: 0,
                linkedTo: ':previous',
                color: quantileColor,
                fillOpacity: 0.3,
                zIndex: 0,
                marker: {
                    enabled: false
                }
            },
            {
                name: "Reported Data",
                data: statesTrue[state_code],
                zIndex: 2,
                color: lineColor
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


