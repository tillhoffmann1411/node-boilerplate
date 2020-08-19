import mongoose from 'mongoose';


const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

const db = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

export default class Mongo {
  public static connect(): void {
    console.log('Try to connect to database...');
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    mongoose.connect(db, options).then(() => {
      console.info('Successfully connected to MongoDB');
    }).catch(error => {
      console.info('Error connecting to database: ', error);
    });
    mongoose.connection.on('disconnected', this.connect);
  }
}