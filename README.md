# Game finder by Valeria Selviz

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