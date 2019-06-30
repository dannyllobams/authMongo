import mongoose from 'mongoose';

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose.connect('mongodb://localhost/test', {
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  }
}

export default new Database();
