# Pitayax Auth Service
The service to do authenticate. It bases on express + nodejs + MySql.

# How to use

## authorizate work flow

### Get page to do authorizate

Access following URL to get authorizate page.   
http://location:port/auth?response_type=&client_id=&state=&redirect_uri=   

> response_type: "code"   
> client_id: The client id of this client.   
> state: post to authorization server and will send back once authorization is done.   
> redirect_uri: recall URL after authorization is done. Used to accept authorization code.   

### Convert authorizate code to authorizate token
### Feed authorizate token to check access right
### Refresh authorizate token

## Start Rest Services
npm start

## How to test
npm test
