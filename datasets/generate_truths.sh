#!/bin/bash

MONDAY=$(date +"%Y-%m-%d" -d "last monday")
PREV_SAT_YEAR=$(date +"%Y" --date="$MONDAY -2 day")
PREV_SAT_MONTH=$(date +"%m" --date="$MONDAY -2 day")
PREV_SAT_DAY=$(date +"%d" --date="$MONDAY -2 day")


GLEAM_URL=https://raw.githubusercontent.com/reichlab/covid19-forecast-hub/master/data-processed/UCSD_NEU-DeepGLEAM/
SECTION=-UCSD_NEU-DeepGLEAM.csv

GLEAMCSV=$MONDAY$SECTION
echo $GLEAMCSV
echo Truth data based from $PREV_SAT_YEAR-$PREV_SAT_MONTH-$PREV_SAT_DAY
echo ""

echo "Deleting Old Data (this may give a 'No such file or directory' error, thats ok!)"
rm truth-Incident\ Deaths.csv
rm truth-Cumulative\ Deaths.csv
rm df_cum.json
rm df_inc.json
rm df_quant_cum.json
rm df_quant_inc.json
rm df_truth_cum.json
rm df_truth_inc.json
rm df_weekly_cum.json
rm df_weekly_inc.json
echo "...done"
echo ""

echo "Downloading Forecast Data"
curl -O $GLEAM_URL$MONDAY$SECTION
echo "...done"
echo ""

echo "Downloading Truth Data"
curl -O https://raw.githubusercontent.com/reichlab/covid19-forecast-hub/master/data-truth/truth-Incident%20Deaths.csv
mv truth-Incident%20Deaths.csv truth-Incident\ Deaths.csv
curl -O https://raw.githubusercontent.com/reichlab/covid19-forecast-hub/master/data-truth/truth-Cumulative%20Deaths.csv
mv truth-Cumulative%20Deaths.csv truth-Cumulative\ Deaths.csv
echo "...done"
echo ""

echo "Generating Forecast Data"
python3 generate_cumulative_for_map.py $GLEAMCSV
python3 generate_incidental_for_map.py $GLEAMCSV
python3 generate_quantiles.py $GLEAMCSV
python3 generate_weekly.py $GLEAMCSV
echo "...done"
echo ""

echo "Generating Truth Data"
python3 generate_truth_cum.py $PREV_SAT_YEAR $PREV_SAT_MONTH $PREV_SAT_DAY
python3 generate_truth_inc.py $PREV_SAT_YEAR $PREV_SAT_MONTH $PREV_SAT_DAY
echo "...done"
echo ""

echo "Deleting Downloaded Data"
rm $GLEAMCSV
rm truth-Cumulative\ Deaths.csv
rm truth-Incident\ Deaths.csv
echo "...done"
echo ""

now=$(date +"%m/%d/%y")
SATURDAY=$(date +"%m/%d/%y" -d "last monday")

echo "Make sure to go into index.html and render-maps.update-graphs.js and change the date to:"
echo \>\>\> index.html $now
echo \>\>\> render-maps.update-graphs.js $SATURDAY