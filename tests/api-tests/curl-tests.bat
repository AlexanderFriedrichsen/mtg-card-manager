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