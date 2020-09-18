# UCSD/HDSI Covid-19 Website

## IMPORTANT
To run this properly, you will need to host this on a server. Opening the HTML in a browser will NOT display the charts properly. Either use VS code "Live Server" extension, `python3 -m http.server 8080` followed by visiting 127.0.0.1:8080 to open a server, or some other server of your choosing.

## TODO Major
We have one of two options: <br> <br>
1. We can manually fetch the information weekly and run the Python script
2. We can create a CRON job? IDK
3. See Below
Right now, in order to convert the data from the supplied CSV to a chart friendly JSON, we need to run `python3 generate.py` (you'll need pandas) in order to generate the df.json file needed. 
<br>
<br>
If you could, can you rewrite *datasets/generate.py* to be in JS entirely instead. Ideally, it will download the latest data from their GitHub, convert with the afformentioned script you can create, and then you can pipe that to the js/map.js function at the top. 
<br>
<br>
Next, find a WP plugin or something that will allow us to scheudle a job that runs the JSON daily or weekly or whatever. That would make it a very low maintenence page.
<br>
<br>
Probably want to be in a call to discuss this if wanted, but this can be a down the line thing.
<br>
<hr>
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