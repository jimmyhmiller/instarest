# Instarest

Very much in prototype stage. The goal is an instant rest api for rapid prototyping that you can slowly evolve by interacting with the running system.

Right now, you can use GET, PUT, PATCH, POST, and DELETE on any entity. Url schema is `/:collection/:id`.

Here's an example.

#### Create User

```http
POST /users HTTP/1.1
Accept: application/json
Content-Type: application/json; charset=utf-8

{
    "name": "Jimmy"
}
```

##### Reponse

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "id": "82f3f82d-b4d7-4b56-a7c0-33d35a187c79", 
    "name": "Jimmy"
}
```

#### Get all users

```http
GET /users HTTP/1.1
```

##### Response

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
    {
        "id": "82f3f82d-b4d7-4b56-a7c0-33d35a187c79", 
        "name": "Jimmy"
    }
]
```

The only special endpoint right now is `/validation/:collection`. You can use [validatejs](http://validatejs.org/) validations to add validations to endpoints.

#### Add User Validation

```http
PUT /validation/users HTTP/1.1
Accept: application/json
Content-Type: application/json; charset=utf-8

{
    "name": {
        "presence": true
    }
}
```

##### Response

```http
HTTP/1.1 204 No Content
```

#### Try Adding Invalid User

```http
POST /users HTTP/1.1
Accept: application/json
Content-Type: application/json; charset=utf-8

{
    "stuff": "Jimmy"
}

```

##### Response

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{
    "errors": {
        "name": [
            "name can't be blank"
        ]
    }
}
```



## Future plans

Right now you can add validations and old data will not be validated. I plan on adding a way to migrate old data if any validations conflict. Currently all data is just in memory, the plan is to add middleware for your own storage. One thought I've had with regard to this is a way to do migrations. That way even with an in memory version, you could spin up a new version and migrate data over. I'd love to be able to add queries to endpoints. Validations currently only work on the body, headers should be an easy addition. By allowing header validation, we can automatically get authentication.  

I'd love to also be able to add onto the validation system. Not quite sure how to do this, but one idea is to allow validations to be an endpoint to allow any application to implement validations. In fact, this idea would allow nesting of validations for related entities. 

One possible future approach is to use datascript. It would allow querying, and allow endpoints that are a subset of current fields using the pull api.

My motivation for working on this is to try and make a modern mini version of [PILOT by Warren Teitelman](https://dspace.mit.edu/bitstream/handle/1721.1/6905/AITR-221.pdf?sequence=2). I must admit I actually haven't read it full, but really enjoyed the description in [Marvin Minsky's Paper](http://web.media.mit.edu/~minsky/papers/Why%20programming%20is--.html) (which I did read). This is a far cry from PILOT. Even if I developed all the features I want it would still not be what Teitelman describes. But the way in which it works is precisely what Teitelman describes. You would not develop by writing code in a text file, but by sending "advice" to the running system, telling it how to interpret future inputs. I find this to be a compelling way to implement APIs and would love to have a system to explore these notions.

One area that is still unclear to me is the transition from dev to prod. One possibility is to use this only in dev in the initial stages, using a proxy to replace endpoint by endpoint witha real service. But more interesting to me is the ability to migrate a running system to prod. How would this work? I have no idea.