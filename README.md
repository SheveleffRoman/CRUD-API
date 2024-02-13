## Node.js CRUD API
Simple CRUD API using in-memory database.

### How to use:
+ `git checkout develop`
+ use script `npm install`,
+ rename .env.example to .env
+ use script `npm run start:dev` for working in development mode,
+ use script `npm run start:prod` for working in production mode,
+ use script `npm run test`, for testing,

### How to specify port:
you can change port in .env file

## API Endpoints

#### Get all users

```
method: get
address: http://localhost:3000/api/users
```

#### Add one user

```
method: post
address: http://localhost:3000/api/users
body: {
    "username": "skave",
    "age": 25,
    "hobbies": ["dance"]
}
```

#### Get user

```
method: get
address: http://localhost:3000/api/users/${userID}
```

#### Update user

```
method: put
address: http://localhost:3000/api/users/${userID}
body: {
    "username": "nat",
    "age": 12,
    "hobbies": ["dance"]
}
```

#### Delete user

```
method: delete
address: http://localhost:3000/api/users/${userID}
```
