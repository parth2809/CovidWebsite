# UCSD/HDSI Covid-19 Website

## TODO Major
Right now, in order to convert the data from the supplied CSV to a chart friendly JSON, we need to run `python3 generate.py` (you'll need pandas) in order to generate the df.json file needed. 
<br>
<br>
If you could, can you rewrite *datasets/generate.py* to be in JS entirely instead. Ideally, when you go on the site, it will automatically download from their GitHub, convert with the
afformentioned script you can create, and then you can pipe that to the js/map.js function at the top. That way there is no maintenece needed at all from them.
<br>
<br>
Afterwards, if you wanted to look into the second page, that would be great. Although we might be able to squeeze it onto the first page, but double check the emails.

### TODO Minor
* Need to change second HDSI logo to JSOE white
* Add Favicon
* Add About Text

## Technologies Used
* Bootstrap 4
* HighCharts (the licensing seems to be very permissive, but we still need to contact them to get a valid free key)

## Other Resources
* https://github.com/reichlab/covid19-forecast-hub/tree/master/data-processed/UCSD_NEU-DeepGLEAM
* Stephs XD screenshot