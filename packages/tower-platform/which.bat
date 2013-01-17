@setlocal
@set P2=.;%PATH%
@for %%e in (%PATHEXT%) do @for %%i in (%~n1%%e) do @if NOT "%%~$P2:i"=="" echo %%~$P2:i