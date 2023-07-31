# Game finder by Valeria Selviz

## About

Game Finder is a website designed for users to search and explore a vast collection of over 350,000 games, utilizing the data from the RAW API.

The platform provides comprehensive details for each game, including essential information like the release date, genres, description, available platforms, developers, as well as additional content like screenshots and trailers.

To access the full functionality of the website, users need to register and log in with their accounts.

## Running project

To run this web page I recommend using VS Live Server.
This web page needs 2 extra servers running: 
 - json-server-auth on port 3000
 - cors-proxy on port 3001

### json-server-auth

This server provides endpoints for login in and sign in up.
You can download it here https://github.com/jeremyben/json-server-auth

### cors-proxy

To work around the CORS access issue, all the request to rawg.io are proxied through this server.
You can download it here https://github.com/ccoenraets/cors-proxy
