@echo off
set BASE_URL=http://localhost:3000/api

echo Testing GET all cards...
curl -s %BASE_URL%/cards

echo.
echo Testing card search...
curl -s "%BASE_URL%/cards/search?name=avishkar+raceway&sortBy=cmc&sortOrder=desc"

echo.
echo Testing card by type...
curl -s "%BASE_URL%/cards/type/land"


rem Set variables
set API_URL=http://localhost:3000/api/users/login
set USERNAME=johndoe
set PASSWORD=password123


echo Registering user %USERNAME%...
curl -X POST %API_URL% ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"%USERNAME%\",\"email\":\"%EMAIL%\",\"password\":\"%PASSWORD%\"}" ^
  -o register_response.json

echo.
echo Response saved to register_response.json
echo.
echo Done!

rem Make the login request
echo Sending login request for user %USERNAME%...
curl -X POST %API_URL% ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"%USERNAME%\",\"password\":\"%PASSWORD%\"}" ^
  -o login_response.json

echo.
echo Response saved to login_response.json