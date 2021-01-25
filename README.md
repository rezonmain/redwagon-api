Red wagons api for handling anything red wagon related.

As jan 24, is used for determining the number of burgers sold using loyverse's api its hosted on heroku on a free dyno and it used express.js.

Dev history: The first instance of the api made 2 request to the loyverse api, the first one requsted all the items from the store, and a function determined the id's of the items in the burgers category, it did this by knowing the category id, and matching it with the category id of the item, then saved the id's in a variable, then made a second request that got the recepits made at the start of the working day to that moment, filtered by id, and the determined the number of burgers sold that day, the second version of the api made a single request request to the api, did this by storing the id's in a file and using them instead of always reqesting them, this is possible because the id's dont change, and new burgers are not added often.

Version 3 of the api will use a postgreSQL database to store the id's, and also, it will use webhooks now that the loyverse api implement them, it will work something like this: when a new receipt is created, a webhook from loyverse will send a POST request to the server, then it will filter by id and determine the new number of burgers sold, this number will be stored in the database, so the number of request to the loyverse api will go from 1 to 0, this means faster response to the client, because to get the data the server will only query the database, instead of request from the loyverse api and then computing the number of burgers.

TODO:

-   Implement postgreSQL database
-   Enable Webhook when new receipt is created
-   Compute and store number of burgers
-   Store burgers id's to db
-   Run a daily job to get id's and store them to db
