const express = require("express"),
    morgan = require("morgan");
const app = express();
app.use(morgan('common'));

/* let topBooks = [
    {
        title:'Harry Potter',
        author: 'J.K.Rowling'
    },
    {
        title:'Lord of the Rings',
        author:'J.R.R.Tolkins'
    },
    {
        title:'Twilight',
        author:'Stephanie Meyer'
    }
]; */

// Movie Details
let movies = [
    {
        title: 'The Lion King',
        Director: 'Jonathan Favreau'
    },
    {
        title:'Master',
        Director: 'Lokesh Kanagaraj'
    },
    {
        title: 'Karnan',
        Director: 'Mari Selvaraj'
    },
    {
        title:'Endhiran',
        Director:'Shankar'
    },
    {
        title: 'Pariyerum Perumal',
        Director: 'Mari Selvaraj'
    },
    {
        title: 'Vikram',
        Director: 'Lokesh Kanagaraj'
    },
    {
        title: 'Doctor',
        Director: 'Nelson'
    },
    {
        title: 'Kaithi',
        Director: 'Lokesh Kanagaraj'
    },
    {
        title: 'The Irishman',
        Director: 'Martin Scorcees'
    },
    {
        title: 'Titanic',
        Director: 'Spilberg'
    }
]

//Installation of Morgan void necessity of the myLogger
/* let myLogger = (req, res, next) =>{
    console.log(req.url);
    next();
};
app.use(myLogger); */

/* let requestTime = (req, res, next) =>{
    req.requestTime = Date.now();
    next();
};
app.use(requestTime); */


//Get request
//Following are for practice
/* app.get('/',(req,res)=>{
    res.send('Welcome To My Book Club \n\n <small> Requested in: ' + req.requestTime + '<small>');
});

app.get('/documentation',(req,res)=>{
    res.sendFile('./public/documentation.html');
});

app.get('/books',(req,res)=>{
    res.json(topBooks);
}); */

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

//Error Handler
app.use((err,req,res,next) =>{
    console.error(err.stack);
    res.status(500).send('The code is broken')
})

//Listen to requests
app.listen(8080, () =>{
    console.log('Your app is listening to port 8080')
});