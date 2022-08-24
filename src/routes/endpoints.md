# Endpoints

```
With * is required
```

## Auth

### (Register) POST: https://domain.com/signup
```
Request body:
{
    username: string; (*)
    email: string; (*)
    password: string; (*)
}

- Response body:
(SUCCESS)
{
    token: JWT Payload;
}
(ERROR CODE: 400)
{
    en: error_string;
    es: error_string;
}
```
### (Login) POST: https://domain.com/login
```
- Request body:
{
    username: string; (*)
    email: string; (*)
    password: string; (*)
}

- Response body:
(SUCCESS)
{
    token: JWT Payload;
}
(ERROR CODE: 400)
{
    en: error_string;
    es: error_string;
}
```
## Account Info (SAMP)
### (Create SAMP Player) POST: https://domain.com/samp/new
```
- Request body:
{
    character_fist: string; (*)
    character_last: string; (*)
    age: number; (*)
    gender: number; (*)
}

- Response body:
(SUCCESS)
{
    token: JWT Payload updated;
}
(ERROR CODE: 400)
{
    en: error_string[];
    es: error_string[];
}
```
### (Get player stats) GET: https://domain.com/samp
```
- Response body:
(SUCCESS)
{
    IUserSAMP;
}
(ERROR CODE: 400)
{
    en: error_string;
    es: error_string;
}
```
### (Get player vehicles) GET: https://domain.com/samp/vehicles
```
- Response body:
(SUCCESS)
{
    Vehicles[] | []
}
(ERROR CODE: 400)
{
    en: error_string;
    es: error_string;
}
```