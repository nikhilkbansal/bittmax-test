const mongoose = require('mongoose');
const mongo = { uri: 'mongodb://localhost:27017/bittmax-test', dbName: 'bittmax-test' }

mongoose.Promise = Promise;


mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});


exports.connect = () => {
  mongoose.connect(mongo.uri, {
    keepAlive: 1,
    useNewUrlParser: true,
    useCreateIndex: true,
  });
  mongoose.set('debug', true);
  return mongoose.connection;
};
