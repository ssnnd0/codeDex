@echo off

echo Installing CodeSync...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js and npm before running this script.
    exit /b 1
)

REM Install project dependencies
echo Installing project dependencies...
call npm install

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    echo RAPIDAPI_KEY=your_rapidapi_key_here > .env
    echo Please update the RAPIDAPI_KEY in the .env file with your actual key.
)

echo Installation complete!
echo To start the development server, run: npm run dev
