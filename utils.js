const Datastore = require('nedb')
const validate = require('validate.js');
const { merge } = require('lodash');
const uuid = require('uuid');

// I don't want error messages to be formated
// that would make them inaccurate for api responses
// Validate.js is really geared towards frontend, but 
// is flexible enough for this purpose.
// Overriding these stops the messages from being
// converted to a "human readable" format.
validate.capitalize = x => x 
validate.prettify = x => x

validate.options = {
  prettify: x => x,
  stringifyValue: x => x,
}

const getCollection = (db, collection) => {
  db[collection] = db[collection] || {}
  return db[collection];
}

const toArray = (collection) => Object.keys(collection).map(key => collection[key]);

export const inMemoryStore = db => ({
  find: (collection) => {
    const request = toArray(getCollection(db, collection));
    return Promise.resolve(request);
  },
  findOne: (collection, id) => {
    return Promise.resolve(getCollection(db, collection)[id]);
  },
  insert: (collection, obj) => {
    const id = uuid();
    getCollection(db, collection)[id] = {...obj, id};
    return Promise.resolve(db[collection][id]);
  },
  update: (collection, id, obj) => {
    const currentValue = getCollection(db, collection)[id];
    getCollection(db, collection)[id] = obj;
    return Promise.resolve(db[collection][id]);
  },
  remove: (collection, id) => {
    delete getCollection(db, collection)[id];
    return Promise.resolve(undefined);
  },
})


export const validator = (db) => (req, res, next) => {
  const collection = req.params.collection;
  db.findOne('validation', collection).then(({id, ...constraints} = {}) => {
    const validation = validate.validate(req.body, constraints);
    if (validation) {
      res.status(400)
      res.send({
        errors: validation
      })
    } else {
      next()
    }
  })
}
