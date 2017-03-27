const express = require('express')
const bodyParser = require('body-parser')
const expressPromise = require('express-promise')
const { inMemoryStore, validator } = require('./utils.js')

const app = express()
app.use(bodyParser.json());
app.use(expressPromise());

const db = inMemoryStore({})

const resolve = (res, fn) => data => {
  if (!data) {
    res.sendStatus(404);
  }
  if (fn) {
    fn(data);
  } else {
    res.send(data);
  }
  return data;
}

app.get('/:collection',
  ({ params: { collection }}, res) => {
    db.find(collection).then(resolve(res)).catch((e) => console.error(e));
})

app.get('/:collection/:id', 
  ({ params: {collection, id} }, res) => {
    db.findOne(collection, id).then(resolve(res));
})

app.post('/:collection', validator(db),
  ({ body: obj, params: { collection } }, res) => {
    db.insert(collection, obj).then(resolve(res))
})

app.put('/:collection/:id',
  ({ params: { id, collection }, body: obj }, res) => {
    db.update(collection, id, {...obj, id}).then(resolve(res, () => res.sendStatus(204)))
})

app.patch('/:collection/:id',
  ({ params: { id, collection }, body: obj }, res) => {
    db.findOne(collection, id).then(currentValue => {
      const newValue = {
        id,
        ...currentValue,
        ...obj,
      }
      db.update(collection, id, newValue).then(resolve(res, () => res.sendStatus(204)))
    })
})

app.delete('/:collection/:id',
  ({ params: { id, collection } }, res) => {
    db.remove(collection, id).then(resolve(res, () => res.sendStatus(204)))
})

app.listen(3000)
