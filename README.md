<h1>SharmilaFlix Backend</h1>

# Objective

Building the server side of a Movie API which shows movies' details about director, genre and a short description about the movie.
User can register, login and add a movie to their favorite list.

# Features

* A new user can register
* Existing user can login using their username and password they provided
* User can update their details any time
* User can add a movie to their favorite list
* Return a list of ALL movies to the user
* Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
* Return list of movies according to their genre
* Return list of movies according to their Director name
* User can cancel their subscription to the website


# Technical Details

* Built using NodeJS and Express
* REST architecture is used with URL endpoints to the data operation listed in Features
* All the installed packages are listed in "package.json" file
* `npm install` command is to install all the packaages used in list
* Return the movie details or User details in JSON format
* JWT authentication is used
* Deployed with `Heroku`
* The database was built using MongoDB.
* The business logic modeled with Mongoose.

# Built with:
* JavaScript
* Node.js
* Express
* MongoDB
* Mongoose

**Hosted on Heroku** [SharmilaFlix](https://sharmilamovie.herokuapp.com/)
