REM  Created by: @TheHydroImpulse - Daniel Fagnan
@ECHO OFF 
@setlocal enableextensions enabledelayedexpansion

REM Clear the screen and turn echo off (above) to keep it clean 
CLS 

SET PPath=
SET NPMCOMMAND=

REM Get Value from 'where make' command output 
FOR /F "" %%i in ('where make') do SET PPath=%%i

REM We first need to check if we got the real make.exe or this make.bat file.
REM call %PPath%
if x%PPath:bat=%==x%PPath% (
	REM Make is installed. We can run it instead.
	call %PPath% %1 %2
) else (

	GOTO %1%
	:install
		call npm install
		GOTO end_switch
	:post-install
		REM We need to run everything manually and outside the Makefile:
		echo Make cannot be found. Installing dependencies manually...

		goto install-dependencies
		goto install-message

		GOTO end_switch
	:install-dependencies
		REM Run install-dependencies manually:
		REM We have to run the dependencies command, capture the results and run them.
		FOR /F "tokens=*" %%i IN ('node .\bin\install dependencies') do call %%i 
		REM goto end_switch
	:install-message
		REM Run install-message manually:
		REM This will only appear on global installations of Tower
		FOR /F "tokens=*" %%i IN ('node .\bin\install message') do call %%i 
		goto end_switch
	:watch
		call grunt start --config ./grunt.coffee
		goto end_switch
	:end_switch
		REM end

	REM @todo Copy the rest of the Makefile here...
)

endlocal