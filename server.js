const dotenv = require('dotenv');
const express = require('express');
const mongodb = require('mongodb');
const { getPutBodyIsAllowed } = require('./util');

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const uri = process.env.DATABASE_URI;

app.post('/api/books', function(request, response) {
  const client = new mongodb.MongoClient(uri);
    
  const title = request.query.title;
  const author = request.query.author;
  const author_birth_year = request.query.author_birth_year;
  const author_death_year = request.query.author_death_year;
  const url = request.query.url;

    
    client.connect(() => {
      const db = client.db('literature')
      const collection = db.collection('books')
        const book = {
          title: title,
          author: author,
          author_birth_year: author_birth_year,
          author_death_year: author_death_year,
          url: url
      };
        collection.insertOne(book, function (error, result) {
            if(error){
            response.sendStatus(400).send(error);
            }else {
                response.sendStatus(200).send(result.query);
            }
            client.close();
        });
    });
        
    console.log("ADD NEW Films:", request.query);
  // Make this work!
});

app.delete('/api/books/:id', function(request, response) {
  const client = new mongodb.MongoClient(uri);

    const searchObject = { "id" : request.params.id };

    console.log(searchObject);
    client.connect(() => {
      const db = client.db('literature')
      const collection = db.collection('books')
    collection.deleteOne(searchObject , function (error, result) {
        if(error){
          request.sendStatus(400).send(error);
          console.log("Error", error);
            }else if (request.result) {
              request.sendStatus(204)
              console.log("ADD NEW :", request.result);
            } else {
              request.sendStatus(404)
            }
            client.close();
        });
    });
  // Make this work, too!
});

app.put('/api/books/:id', function(request, response) {
  const client = new mongodb.MongoClient(uri);

  const searchObject = { "id" : request.params.id };
  console.log("hiiiiiiii");
  console.log(searchObject);
  client.connect(() => {
    const db = client.db('literature')
    const collection = db.collection('books')
    collection.find(searchObject).toArray(function(error, books) {
      response.send(error || books);
      const update = {
        $set: {
          title,
          author,
          author_birth_year,
          author_death_year,
          url,
        },
      };
  collection.findOneAndUpdate(searchObject , update ,function (error, result) {
      if(error){
        request.sendStatus(400).send(error);
          }else if (request.result) {
            request.sendStatus(204)
          } else {
            request.sendStatus(404)
          }
          client.close();
      });
    });
  // Also make this work!
  });
});

app.get('/api/books', function(request, response) {
  const client = new mongodb.MongoClient(uri)

  client.connect(function() {
    const db = client.db('literature')
    const collection = db.collection('books')

    const searchObject = {}

    if (request.query.title) {
      searchObject.title = request.query.title
    }

    if (request.query.author) {
      searchObject.author = request.query.author
    }

    collection.find(searchObject).toArray(function(error, books) {
      response.send(error || books)
      client.close()
    });
  });
})

app.get('/api/books/:id', function(request, response) {
  const client = new mongodb.MongoClient(uri)

  let id
  try {
    id = new mongodb.ObjectID(request.params.id)
  } catch (error) {
    response.sendStatus(400)
    return
  }

  client.connect(function() {
    const db = client.db('literature')
    const collection = db.collection('books')

    const searchObject = { _id: id }

    collection.findOne(searchObject, function(error, book) {
      if (!book) {
        response.sendStatus(404)
      } else {
        response.send(error || book)
      }

      client.close()
    });
  });
});

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html')
})

app.get('/books/new', function(request, response) {
  response.sendFile(__dirname + '/new-book.html')
})

app.get('/books/:id', function(request, response) {
  response.sendFile(__dirname + '/book.html')
})

app.get('/books/:id/edit', function(request, response) {
  response.sendFile(__dirname + '/edit-book.html')
})

app.get('/authors/:name', function(request, response) {
  response.sendFile(__dirname + '/author.html')
})

app.listen(port || 3000, function() {
  console.log(`Running at \`http://localhost:${port}\`...`)
})
