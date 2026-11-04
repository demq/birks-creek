#!/bin/sh
# Rebuild the groundwater meeting flyer PDF (run from handout/).
cd "$(dirname "$0")" || exit 1
node -e "const fs=require('fs');fs.writeFileSync('flyer.html',fs.readFileSync('flyer.src.html','utf8').replace('{{QR}}',fs.readFileSync('flyer-qr.svg','utf8')))"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer \
  --print-to-pdf="$PWD/Ground-Water-Discharge-Meeting-Flyer.pdf" "file://$PWD/flyer.html"
cp Ground-Water-Discharge-Meeting-Flyer.pdf ../public/groundwater-meeting-flyer.pdf
