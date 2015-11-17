# Pitayax Auth Service
The service to do authenticate. It bases on express + nodejs + MySql.

# How to use

## authorization work flow

### Get page to do authorization

Access following URL to get authorization page.   
http://server:port/auth?response_type=&client_id=&state=&redirect_uri=   

> response_type: "code"   
> client_id: The client id of this client.   
> state: post to authorization server and will send back once authorization is done.   
> redirect_uri: recall URL after authorization is done. Used to accept authorization code.   

Once authorization is done. The page will redirect to redirect_uri in following format.    
http://redirect_uri?code=&state=

> code: Code generated by authorization service to get authorization key.   
> state: The statue posts to authorization server.   


### Convert authorization code to authorization token

Do post call to following URL with certain parameters.    
http://server:port/token    

> code: Code returned in previous step.  
> grant_type: "authorization_code"   
> client_id: The client id of this client.      
> redirect_uri: recall URL after authorization is done. Used to accept authorization code.   

Response will be a json with following format.    

```json
{     
 "access_token":"a645c550-75f1-4a56-8600-ef12eb04b98d",    
 "token_type":"pitayax-auth",    
 "expires_in":3600    
}    
```

### Feed authorization token to check access right


### Refresh authorization token

Do post call to following URL with certain parameters.    
http://server:port/token  

> refresh_token: The token that you are holding now.  
> grant_type: "refresh_token"

Response will be a json with following format.    

```json
{     
  "access_token":"a645c550-75f1-4a56-8600-ef12eb04b98d",    
  "token_type":"pitayax-auth",    
  "expires_in":3600    
}    
```

### Feed authorization token

Do get call to following URL with certain parameters.    
http://server:port/feed  

> authorization: The token that you are holding now.  
> client: your client id.

Response will be a json with following format.    

```json
{     
  "pass":1 or 0,    
}    
```

1 = pass    
0 = does not pass  

### Sign out

Do post call to following URL with certain parameters.    
http://server:port/signout  

> token: The token that you are holding now.  
> client_id: your client id.

There is no content to be included in response. You only can check status to see if sign out is succeed or not.   
204 = signed out   
400 = exception meet.       


### Create Account

Access following URL to create account.   
http://server:port//user/createaccount?redirect_uri=   

> redirect_uri: recall URL after authorization is done. Used to accept authorization code.   

Once account is created. The page will redirect to redirect_uri.    


## Start Rest Services
npm start

## How to test
npm test

## How to setup database
npm run initDatabase
