const Datastore = require('nedb-promises');
const path = require('path');

const dbDir = path.join(__dirname, 'data');

const users = Datastore.create({ filename: path.join(dbDir, 'users.db'), autoload: true });
const history = Datastore.create({ filename: path.join(dbDir, 'history.db'), autoload: true });

// Indexes
users.ensureIndex({ fieldName: 'email', unique: true });
history.ensureIndex({ fieldName: 'userId' });

module.exports = { users, history };
