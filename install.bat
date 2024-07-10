@echo off

rem Change directory to where your package.json is located
cd /d %cd%/src 

rem Run npm install
call npm install

rem Optional: Display message when done
echo npm install completed.

rem stating installer.js
node installer.js

rem installer completed
echo install completed

pause
