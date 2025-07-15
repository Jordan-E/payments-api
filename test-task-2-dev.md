# Introduction

- Please do not spend more than two hours on this task.
- It's okay to skip parts or leave notes in the README file. For example, if you don't have time to implement all the tests, you can briefly describe them for later discussion.
- You decide which part of the project to focus on.

# Pre-Conditions

- Create a new public GitHub repository.
- Make an initial commit with an empty README file.
- Set up and commit a new empty TypeScript project.

# Task

- Implement a CRUD (Create, Read, Update, Delete) RESTful API.
- Choose a test library or framework and implement integration tests for your API.
- Add a project description and other relevant info to the README file.

Below is the schema of a table that you should use in the task.

_Note_: The SQL script was tested in MySQL, but you may use any database, including SQLite.

```sql
CREATE TABLE payments (
  ID bigint unsigned NOT NULL AUTO_INCREMENT,
  Total double DEFAULT NULL,
  Record_type enum('invoice','bill','none') NOT NULL,
  Status enum('pending','void','completed') NOT NULL,
  Create_date datetime DEFAULT NULL,
  Modified_date datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
);
```

# Requirements

- It should be possible to create multiple records in a single API request (all records must be created or none).
- Records should be queryable by `Record_type` and `Status`.
- `Create_date` is a system field and should not be exposed through the API.
- `Total` must be rounded to two decimal places.
- `Total` must be not NULL.
- It must print debug logs to STDOUT and write to debug.log file

# Questions

Feel free to ask any questions before you start.

# Next Step

Once you complete the task please submit us a link to the repo on GitHub.
If you can't make next interview in person or just prefer a video call, you should be able to share your screen.
