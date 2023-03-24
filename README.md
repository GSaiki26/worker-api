# Creds - API
The Credentials API is a service that's able to keep some credentials.

# Routes
## POST /worker
### Security:
- Bearer - Admin level

### Params:
#### Body example:
```ts
{
    "firstName": string,
    "secondName": string,
    "email": string
}
```

### Response example:
```ts
{
    "status": "Success",
    "data": {
        "id": id,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "created_at": created_at,
        "updated_at": updated_at
    }
}
```