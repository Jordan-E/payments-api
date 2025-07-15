# payments-api

A simple TS REST API.
Used to interact with a payments db table.

## To run

To create the in memory db  
`npm run db`  
Once this has run you should see a database.db file in the project root

dev sever  
`npm run dev`

tests  
`npm test`

## Future work - tests

Sadly the two hours have finished.
I would have written many more tests had a I had the time.

- filter params with data
  - Status filter
  - RecordType filter
  - Both Status and RecordType together
- Get record has total at 2dp
- Adding single record
- Adding multiple records
- Adding invalid records
  - Record with invalid RecordType value
  - Test with missing fields
  - Record with extra fields
  - Test None total value
