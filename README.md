# UCSD/HDSI Covid-19 Website

## IMPORTANT
To run this properly, you will need to host this on a server. Opening the HTML in a browser will NOT display the charts properly. Either use VS code "Live Server" extension, `python3 -m http.server 8080` followed by visiting 127.0.0.1:8080 to open a server, or some other server of your choosing.

## How to Use
Download repo onto your local machine and `cd` into datasets and run `download_data.sh` (You will need Ubuntu for this). Verify that everything works properly and then push to the repo. Afterwards, connect onto the server, `cd` to the directory containing the HDSI website, `cd` into the COVID19 folder, and then run `git pull`

## Technologies Used
* Bootstrap 4
* HighCharts (the licensing seems to be very permissive, but we still need to contact them to get a valid free key)

## Other Resources
* https://github.com/reichlab/covid19-forecast-hub/tree/master/data-processed/UCSD_NEU-DeepGLEAM
* https://github.com/reichlab/covid19-forecast-hub/blob/master/data-truth/truth-Cumulative%20Deaths.csv
* https://github.com/reichlab/covid19-forecast-hub/blob/master/data-truth/truth-Incident%20Deaths.csv
* Stephs XD screenshot