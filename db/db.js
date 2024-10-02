const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017'; // Replace with your MongoDB server URL
const client = new MongoClient(url);

// Database Name
const dbName = 'todoDb';
let db;
let collection = 'todoCollection';
async function connect() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to MongoDB');

    db = client.db(dbName);
    collection = db.collection(collection);
    // Perform CRUD operations here

    return 'done';
}
async function insertDocument(obj) {
    const result = await collection.insertOne(
        obj
    );

    console.log(`${result.insertedCount} documents were inserted`);
}

async function updateDocument(filter, newValues) {

    const result = await collection.updateOne(
        filter, 
        { $set: newValues }
    );

    console.log(`Updated ${result.matchedCount} document(s)`);
}

async function deleteDocument(col, filter) {

    const result = await collection.deleteOne(filter);
    console.log(`Deleted ${result.deletedCount} document(s)`);
}

async function selectDocument(personMail){
    const result = await collection.findOne({email: personMail})
    return result;
}
async function select(query){
    const result = await collection.findOne(query)
    return result;
}

module.exports = {
    connect,
    insertDocument,
    updateDocument,
    selectDocument,
    select
}

// main()
//   .then(console.log)
//   .catch(console.error)
//   .finally(() => client.close());
