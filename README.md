# Bot Test

## Dependencies

* Node v10.16.0
* Yarn v1.17.3
* Docker v18.09.2
* MongoDB v4.0


## Structure

The project was structured using the repository design pattern to store the business logic and interact with the database.

* src/models - contains the mongoose models that are the definitions of the models with validation.
* src/repository - classes following the repository design pattern
* src/routes - express routers for each resource
* tests/integration - automated integration tests for each resource
* tests/unit - automated unit tests for each repository file

## Project Quality

To make sure that the api quality assurance, it was implemented 3 levels o testing.

1. Unit testing - basic unit testing
2. Mutation Testing - tests that mutate the logic of the code and generates a report indicating how effective the unit tests are
3. Integration Tests - tests to make sure the integration beetween the service and the database results in interations as expected from a business point of view

## Running Tests

### Unit Testing
Run the command:
```
yarn test:unit
```

### Mutant Testing
Run the command:
```
test:mutation
```

### Integration Testing
1. Run an instance of MongoDb:
```
docker run --name mongo -p 27017:27017 mongo
```
2. Execute tests:
```
yarn test:integration
```
## Running

To run the API, execute the command on the root folder:
```
docker-compose up
```

