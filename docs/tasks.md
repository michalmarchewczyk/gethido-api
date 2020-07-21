# Tasks API

This part of API is responsible for CRUD tasks operations. 

Endpoints have the form: **https://[URL]/tasks/[endpoint]**


### Contents
  * [Token authorization](#token-authorization)
  * [Get tasks](#get-tasks)
  * [Search tasks](#search-tasks)
  * [Get task](#get-task)
  * [Create task](#create-task)
  * [Update task](#update-task)
  * [Move task to stage](#move-task-to-stage)
  * [Delete task](#delete-task)
  * [Change task tags](#change-task-tags)
  * [Get tasks with given tag](#get-tasks-with-given-tag)
  
  
## Token authorization

All tasks actions require user to authenticate with JWT token.

Token can be sent in a cookie:

```Cookie: token=[token]```
 
or in authorization header:
 
```Authorization: Bearer [token]```

Tokens automatically expire after 10 hours.

With each request there is a new token send with new expiration time.

Attempt to authorize with invalid or expired token will result in response with code **401 UNAUTHORIZED**


## Get tasks

- **URL**
    ```http
    GET /tasks/[stage]
    ```
  
- **Success response**
    - Code: 200 OK
    - Content: List of tasks in a given stage  
        Example
        ```json
        [
          {
            "calDate": null,
            "completed": false,
            "tags": [],
            "email": null,
            "emailUID": null,
            "_id": "5f16ce4d2346d42480104288",
            "id": 270,
            "userId": 119,
            "stage": "inbox",
            "name": "taskname",
            "description": "testdescription",
            "date": "2020-07-21T11:15:25.438Z",
            "source": "API",
            "__v": 0
          },
          {
            "calDate": null,
            "completed": false,
            "tags": [],
            "email": null,
            "emailUID": null,
            "_id": "5f16ce632346d42480104289",
            "id": 271,
            "userId": 119,
            "stage": "inbox",
            "name": "task2",
            "description": "task2",
            "date": "2020-07-21T11:15:47.703Z",
            "source": "API",
            "__v": 0
          }
        ]
        ```
      
- **Error response**
    - Code: 400 BAD REQUEST
    
    
## Search tasks

- **URL**
    ```http
    GET /tasks/search/[phrase]
    ```
  
- **Success response**
    - Code: 200 OK
    - Content: List of found tasks  
        Example
        ```json
        [
          {
            "calDate": null,
            "completed": false,
            "tags": [],
            "email": null,
            "emailUID": null,
            "_id": "5f16ce4d2346d42480104288",
            "id": 270,
            "userId": 119,
            "stage": "inbox",
            "name": "task 1",
            "description": "testdescription",
            "date": "2020-07-21T11:15:25.438Z",
            "source": "API",
            "__v": 0
          },
          {
            "calDate": null,
            "completed": false,
            "tags": [],
            "email": null,
            "emailUID": null,
            "_id": "5f16ce632346d42480104289",
            "id": 271,
            "userId": 119,
            "stage": "inbox",
            "name": "task 2",
            "description": "task2",
            "date": "2020-07-21T11:15:47.703Z",
            "source": "API",
            "__v": 0
          }
        ]
        ```
      
- **Error response**
    - Code: 400 BAD REQUEST


## Get task

- **URL**
    ```http
    GET /tasks/[id]
    ```
  
- **Success response**
    - Code: 200 OK
    - Content: Task with given id  
        Example
        ```json
        {
          "calDate": null,
          "completed": false,
          "tags": [],
          "email": null,
          "emailUID": null,
          "_id": "5f16ce4d2346d42480104288",
          "id": 270,
          "userId": 119,
          "stage": "inbox",
          "name": "taskname",
          "description": "testdescription",
          "date": "2020-07-21T11:15:25.438Z",
          "source": "API",
          "__v": 0
        }
        ```
      
- **Error response**
    - Code: 404 NOT FOUND
    
    
## Create task

- **URL**
    ```http
    POST /tasks/
    ```
  
- **Body**
    ```
    name=[task name]
    description=[task description]
    stage=[task initial stage]
    source=[task source]
    ```
  
- **Success response**
    - Code: 201 CREATED
    - Content: Created task  
        Example
        ```json
        {
          "calDate": null,
          "completed": false,
          "tags": [],
          "email": null,
          "emailUID": null,
          "_id": "5f16ce4d2346d42480104288",
          "id": 270,
          "userId": 119,
          "stage": "inbox",
          "name": "taskname",
          "description": "testdescription",
          "date": "2020-07-21T11:15:25.438Z",
          "source": "API",
          "__v": 0
        }
        ```

- **Error response**
    - Code: 400 BAD REQUEST
    
    
## Update task

- **URL**
    ```http
    PUT /tasks/[id]
    ```
  
- **Body**
    ```
    name=[optional task name]
    description=[optional task description]
    completed=[optional task state]
    calDate=[optional calendar task date]
    ```
  
- **Success response**
    - Code: 200 OK
    - Content: Updated task  
        Example
        ```json
        {
          "calDate": null,
          "completed": false,
          "tags": [],
          "email": null,
          "emailUID": null,
          "_id": "5f16ce4d2346d42480104288",
          "id": 270,
          "userId": 119,
          "stage": "inbox",
          "name": "task updated",
          "description": "test updated",
          "date": "2020-07-21T11:15:25.438Z",
          "source": "API",
          "__v": 0
        }
        ```

- **Error response**
    - Code: 400 BAD REQUEST


## Move task to stage

- **URL**
    ```http
    PUT /tasks/move/[id]
    ```
  
- **Body**
    ```
    destination=[new task stage]
    ```
  
- **Success response**
    - Code: 200 OK
    - Content: Updated task  
        Example
        ```json
        {
          "calDate": null,
          "completed": false,
          "tags": [],
          "email": null,
          "emailUID": null,
          "_id": "5f16ce4d2346d42480104288",
          "id": 270,
          "userId": 119,
          "stage": "next",
          "name": "task updated",
          "description": "test updated",
          "date": "2020-07-21T11:15:25.438Z",
          "source": "API",
          "__v": 0
        }
        ```

- **Error response**
    - Code: 400 BAD REQUEST


## Delete task

- **URL**
    ```http
    DELETE /tasks/[id]
    ```
  
- **Success response**
    - Code: 200 OK
    - Content: Deleted task  
        Example
        ```json
        {
          "calDate": null,
          "completed": false,
          "tags": [],
          "email": null,
          "emailUID": null,
          "_id": "5f16ce4d2346d42480104288",
          "id": 270,
          "userId": 119,
          "stage": "inbox",
          "name": "task updated",
          "description": "test updated",
          "date": "2020-07-21T11:15:25.438Z",
          "source": "API",
          "__v": 0
        }
        ```

- **Error response**
    - Code: 400 BAD REQUEST
    
    
## Change task tags

- **URL**
    ```http
    PUT /tasks/tags/[id]
    ```
  
- **Body**
    ```
    tags=[list of tags]
    ```
  
- **Success response**
    - Code: 200 OK
    - Content: Updated task  
        Example
        ```json
        {
          "calDate": null,
          "completed": false,
          "tags": [
            "TEST TAG1"
          ],
          "email": null,
          "emailUID": null,
          "_id": "5f16ce632346d42480104289",
          "id": 271,
          "userId": 119,
          "stage": "inbox",
          "name": "task2",
          "description": "task2",
          "date": "2020-07-21T11:15:47.703Z",
          "source": "API",
          "__v": 0
        }
        ```

- **Error response**
    - Code: 400 BAD REQUEST


## Get tasks with given tag

- **URL**
    ```http
    GET /tasks/tags/[tag]
    ```
  
- **Success response**
    - Code: 200 OK
    - Content: List of tasks 
        Example
        ```json
        [
          {
            "calDate": null,
            "completed": false,
            "tags": [
              "TEST TAG1"
            ],
            "email": null,
            "emailUID": null,
            "_id": "5f16ce632346d42480104289",
            "id": 271,
            "userId": 119,
            "stage": "inbox",
            "name": "task2",
            "description": "task2",
            "date": "2020-07-21T11:15:47.703Z",
            "source": "API",
            "__v": 0
          }
        ]
        ```

- **Error response**
    - Code: 400 BAD REQUEST

