# API AUTH BASE
API Base using express with JWT token intergration. Uses Bcrypt to salt users passwords. MongoDB Database

## Setup
## Docker
1. Start MongoDB Container ```docker run --name MongoDB -d mongo:latest```
2. Start API Docker Container ```docker run --name SchoolVPNAPI -d -p 80:80 -e MONGODB_HOST=localhost -e MONGODB_PORT=27017 -e MONGODB_DATABASE=API -e API_JWT_SECRET=SuperSecretSecret -e API_PORT=80 schvpn/api:master```



## Endpoints

|Name|Method|Endpoint | Headers | Params | Body |
| -- |  --  |   --    |   --    |   --   |  --  |
|User Signup|POST|/user/signup| ```Content-Type= application/json``` |N/A|```{"firstname": "String", "lastname": "String", "email": "String@FQDN", "password": "String"}``` |
|User Login|POST|/user/login|```Content-Type= application/json```|N/A|```{"email": "String", "password": "String"```|
|User Info|GET|/user/me|```Authorization= "Bearer JWT_TOKEN"```|N/A|N/A|
|User Edit|PUT|/user/me|```Content-Type= application/json, Authorization= "Bearer JWT_TOKEN"```|N/A|```{"ItemToEdit": "Value"}```|
|Admin User List|GET|/admin/userlist|```Authorization= "Bearer JWT_TOKEN"```|N/A|N/A|
|Admin User Edit|PUT|/admin/:userId|```Content-Type= application/json, Authorization= "Bearer JWT_TOKEN"```|N/A|```{{"ItemToEdit": "Value"}}```|
|Admin User Delete|DELETE|/admin/:userId|```Authorization= "Bearer JWT_TOKEN"```|N/A|N/A|

Enjoy :smile:
