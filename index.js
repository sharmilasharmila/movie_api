const express = require("express"),
    morgan = require("morgan"),
    mongoose = require("mongoose"),
    Models = require('./model.js'),
    bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.use(morgan('common'));
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true,
useUnifiedTopology: true});


//Default
app.get('/',(req,res)=>{
    res.send('Welcome To MyFlix Application');
});

//GET MOVIES
app.get('/movies',(req,res)=>{
    res.json(movies);
})

//GET DOCUMENTATION
app.get('/documentation',(req,res)=>{
    res.sendFile('C:/Users/Sajith/Documents/GitHub/sharmila/second_acheivement/movie_api/movie_api/public/documentation.html');
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
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

//Get User Details as whole
app.get('/users', (req,res)=>{
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
app.get('/users/:Username', (req,res)=>{
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

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
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
})

//Listen to requests
app.listen(8080, () =>{
    console.log('Your app is listening to port 8080')
});