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

function updateQuantile(quant) {
    if (typeof(quant) != "string") {
        throw new Error('Pass number as a string type and not a number type');
    }
    q = quant;
    updateGraphs(activeType);
}

// Updates all of the graphs (used when either type or location is changed)
function updateGraphs(level) {
    // Sets the activeType (1 is Incidental, 0 is Cumulative)
    activeType = level;
    updateUSMapWeekDisplay(activeWeek);

    if (activeType == 1) {
        statesFutureType = statesFutureInc;
        statesTruthType = statesTruthInc;
        quantileType = quantilesInc;
    } else {
        statesFutureType = statesFutureCum;
        statesTruthType = statesTruthCum;
        quantileType = quantilesCum;
    }

    chartLineHistorical(statesTruthType, statesFutureType, quantileType, q, selectedState);
};

function selectUSA(choice, update=true) {
    let statesSelection = document.getElementById("states-selection-label")
    let nationalSelection = document.getElementById("national-selection-label")
    typeStateOrNational = choice

    if (choice == 1) {
        priorState = selectedState
        selectedState = "US"
        statesSelection.classList.remove('active')
        nationalSelection.classList.add('active')
    } else {
        selectedState = priorState
        statesSelection.classList.add('active')
        nationalSelection.classList.remove('active')
    }
    if (update == true) {
        updateGraphs(activeType)
    }
}