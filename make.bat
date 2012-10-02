@ECHO OFF 

:; Clear the screen and turn echo off (above) to keep it clean 
CLS 

SET PPath=
SET FPath=

:; Get Value from 'VER' command output 
FOR /F "" %%i in ('where make') do SET PPath=%%i

:; djdd
call %PPath%