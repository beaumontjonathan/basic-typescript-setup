# The plan to Planner

## Data overview

### Data Shapes

- User
  - description: account for login and app manipulation
  - fields
    - id
    - username
    - password

- Task
  - description: described action, event, activity for a single user to undertake
  - fields
    - id
    - user id
    - name
    - description

- Tag
  - description: named attributed for relating similar data
  - fields
    - id
    - name

- TaskTagAssociation
  - description: linking between tags and tasks
  - fields
    - tag id
    - task id

- TaskSession
  - description: date-timed event for a single task
  - fields
    - id
    - task id
    - start
    - end

### GraphQL Shapes

User {
  id: Int!
  username: String!
  tags: [Tag!]!
  tasks(
    range: TaskRange
  ): [Tasks!]!
}

(
  TaskRange {
    start: String!
    end: String!
  }
)

Task {
  id: Int!
  user: User!
  name: String!
  description: String
  sessions: [TaskSession!]!
  tags: [Tag!]!
}

Tag {
  id: Int!
  name: String!
  tasks: [Task!]!
}

TaskSession {
  id: Int!
  task: Task!
  start: String!
  end: String!
}

## Data Mutation

### GraphQL

Mutation {
  ```User mutations```
  createUser(): User | ErrorResponse
  login(): User | ErrorResponse
  deleteAccount(): DeletedUser | ErrorResponse

  ```Task mutations```
  addTask(): Task | ErrorResponse
  updateTask(): Task | ErrorResponse
  deleteTask(): DeletedTask | ErrorResponse

```Tag mutations```
  addTag(): Task | ErrorResponse
  updateTag(): Task | ErrorResponse
  deleteTag(): DeletedTask | ErrorResponse

```TaskTagAssociation```
  tagTask(): TaskTag | ErrorResponse
  unTagTask(): TaskTag | ErrorResponse

(
  TaskTag {
    tag: Tag!
    task: Task!
  }
)

```TaskSession mutations```
  addTaskSession(): TaskSession | ErrorResponse
  updateTaskSession(): TaskSession | ErrorResponse
  deleteTaskSession(): TaskSession | ErrorResponse
}

#### User mutations

##### createUser

- parameters
  - username: String!
  - password: String!
- steps
  - validate input data
  - check for user with username [DB-SEARCH]
  - hash/salt password
  - store username & password to db for user [DB-STORE]

##### login

- parameters
  - username: String!
  - password: String!
- steps
  - validate input data
  - fetch user data with username [DB-SEARCH]
  - compare password

##### deleteAccount

- parameters
  - userId: Int!
- steps
  - validate input data
  - ensure logged in as user
  - remove all user data [DB-DELETE]

#### Task mutations

##### addTask

- parameters
  - title: String!
  - description: String
- steps
  - validate input data
  - ensure logged in & fetch user data [DB-SEARCH]
  - add task to db [DB-STORE]

##### updateTask

- parameters
  - id: Int!
  - title: String!
  - description: String
- steps
  - validate input data
  - ensure logged in & fetch user data [DB-SEARCH]
  - ensure task exists for user [DB-SEARCH]
  - update task [DB-STORE]

##### deleteTask

- parameters
  - id: Int!
- steps
  - validate input data
  - ensure logged in & fetch user data [DB-SEARCH]
  - ensure task exists for user [DB-SEARCH]
  - delete task [DB-DELETE]

#### Tag mutations

##### addTag

- parameters
  - name: String!
- steps
  - validate input data
  - ensure logged in & fetch user data [DB-SEARCH]
  - ensure tag name is unique for user [DB-SEARCH]
  - add tag to db [DB-STORE]

##### updateTag

- parameters
  - id: Int!
  - name: String!
- steps
  - validate input data
  - ensure logged in & fetch user data [DB-SEARCH]
  - ensure tag exists for user [DB-SEARCH]
  - ensure new tag name is unique [DB-SEARCH]
  - update tag [DB-STORE]

##### deleteTag

- parameters
  - id: Int!
- steps
  - validate input data
  - ensure logged in & fetch user data [DB-SEARCH]
  - ensure tag exists for user [DB-SEARCH]
  - delete all tag associations [DB-DELETE]
  - delete tag [DB-DELETE]

#### TaskTagAssociation

##### tagTask

- parameters
  - tagId: Int!
  - taskId: Int!
- steps
  - validate input data
  - ensure logged in & fetch user data [DB-SEARCH]
  - ensure no task tag association already exists [DB-SEARCH]
  - add task tag association record to db [DB-STORE]

##### unTagTask

- parameters
  - tagId: Int!
  - taskId: Int!
- steps
  - validate input data
  - ensure logged in & fetch user data [DB-SEARCH]
  - ensure task tag association exists [DB-SEARCH]
  - remove task tag association record from db [DB-DELETE]

#### TaskSession mutations

##### addTaskSession

- parameters
  - taskId: Int!
  - start: String!
  - end: String!
- steps
  - validate input data
  - ensure logged in & fetch user data [DB-SEARCH]
  - ensure task exists for user [DB-SEARCH]
  - add task session for user [DB-STORE]

##### updateTaskSession

- parameters
  - id: Int!
  - start: String!
  - end: String!
- steps
  - validate input data
  - ensure logged in & fetch user data [DB-SEARCH]
  - ensure task session exists for user [DB-SEARCH]
  - update task session [DB-STORE]

##### deleteTaskSession

- parameters
  - id: Int!
- steps
  - validate input data
  - ensure logged in & fetch user data [DB-SEARCH]
  - ensure task session exists for user [DB-SEARCH]
  - delete task session [DB-DELETE]
