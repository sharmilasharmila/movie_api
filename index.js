const express = require("express"),
    morgan = require("morgan"),
    mongoose = require("mongoose"),
    Models = require('./model.js'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    cors = require('cors');
const {check, validationResult} = require('express-validator');


const app = express();
app.use(bodyParser.json());
let auth = require('./auth')(app);
require ('./passport');
app.use(morgan('common'));

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com',
  'https://sharmilamovie.herokuapp.com','http://localhost:1234','http://localhost:4565'];
app.use(cors({
  origin: (origin, callback)=>{
    if(!origin) return callback (null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      let message = 'The CORS policy for this application does not allow access from the origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));
// const Movies = Models.Movie;
// const Users = Models.User;

//mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});

//Default
app.get('/',(req,res)=>{
    res.send('Welcome To MyFlix Application');
});

//GET MOVIES
app.get('/movies' ,(req,res)=>{
  Movies.find()
  .then(movies => {
    res.status(201).json(movies);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//GET request to get information about a specific genre (by name)
app.get('/movies/genres/:Genre', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({'Genre.Name': req.params.Genre}).then((genre) => {
    res.status(201).json(genre.Genre);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});

//GET request to get information about a certain movie by title
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ Title: req.params.Title }).then((movie) => {
    res.status(201).json(movie);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});

//GET request to get information about a specific Director (by name)
app.get('/movies/directors/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({'Director.Name': req.params.Name}).then((director) => {
    res.status(201).json(director.Director);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

//Get User Details as whole
app.get('/users', passport.authenticate('jwt', { session: false }),  (req,res)=>{
    Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) =>{
         console.error(err);
         res.status(500).send('Error : ' + err);
    });
});

//Get Single User Details
app.get('/users/:Username', passport.authenticate('jwt', { session: false }),  (req,res)=>{
    Users.findOne({Username : req.params.Username})
    .then((users) => {
        res.json(user);
    })
    .catch((err) =>{
         console.error(err);
         res.status(500).send('Error : ' + err);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//DELETE request to remove a movie (by movieID) from a user's favourite movie list.
app.delete('/users/:Username/favourites/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
 Users.findOneAndUpdate({Username: req.params.Username},
 {$pull: {FavoriteMovies: req.params.MovieID}},
 {new: true},
 (err, updatedUser) => {
   if(err) {
     console.error(err);
     res.status(500).send('Error: ' + err);
   } else {
     res.json(updatedUser);
   };
 });
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }),  (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Error Handler
app.use((err,req,res,next) =>{
    console.error(err.stack);
    res.status(500).send('The code is broken')
});

//Listen to requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () =>{
  console.log('listening on PORT: ' + port);
});
