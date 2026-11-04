#!/bin/sh
# Rebuild the groundwater meeting flyer PDFs (run from anywhere).
#   colour  -> public/groundwater-meeting-flyer.pdf
#   B&W     -> public/groundwater-meeting-flyer-bw.pdf   (low-ink, greyscale photos)
cd "$(dirname "$0")" || exit 1
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
node -e "
const fs=require('fs');
const src=fs.readFileSync('flyer.src.html','utf8').replace('{{QR}}',fs.readFileSync('flyer-qr.svg','utf8'));
fs.writeFileSync('flyer.html',src);
fs.writeFileSync('flyer-bw.html',src.replace('</style>','\n'+fs.readFileSync('flyer-bw.css','utf8')+'</style>'));
"
"$CHROME" --headless=new --no-pdf-header-footer --print-to-pdf="$PWD/Ground-Water-Discharge-Meeting-Flyer.pdf" "file://$PWD/flyer.html"
"$CHROME" --headless=new --no-pdf-header-footer --print-to-pdf="$PWD/Ground-Water-Discharge-Meeting-Flyer-BW.pdf" "file://$PWD/flyer-bw.html"
cp Ground-Water-Discharge-Meeting-Flyer.pdf ../public/groundwater-meeting-flyer.pdf
cp Ground-Water-Discharge-Meeting-Flyer-BW.pdf ../public/groundwater-meeting-flyer-bw.pdf
