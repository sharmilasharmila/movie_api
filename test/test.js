const express = require("express"),
    bodyparcer = require("body-parser"),
    morgan = require("morgan");
    uuid = require("uuid");
    
const app = express();
app.use(morgan('common'));
app.use(bodyparcer.json());

let students = [
    {
        id: 1,
        name: 'Jassica Drake',
        classes:{
            biology: 95,
            algebra: 92
        }
    },
    {
        id: 2,
        name: 'Ben Cohen',
        classes:{
            biology: 95,
            algebra: 92
        }
    },
    {
        id: 3,
        name: 'Lisa Downing',
        classes:{
            biology: 95,
            algebra: 92
        }
    }
]

//Default
app.get('/',(req,res)=>{
    res.send('Welcome To Student Database');
});

// get all details
app.get('/students', (req,res)=>{
    res.json(students);
});


// get details by name
app.get('/students/:name', (req,res)=>{
    res.json(students.find((student)=>
    {return student.name === req.params.name}));
});


// add student detials
app.post('/students', (req,res)=>{
    let newStudent = req.body;

    if (!newStudent.name){
        const message = 'Missing Name in request Body';
        res.status(400).send(message);
    }
    else {
        newStudent.id = uuid.v4();
        students.push(newStudent);
        res.status(201).send(newStudent);
    }
});

// delete details
app.delete('/students/:id', (req,res)=>{
    let student = students.find((student)=>{return student.id === req.params.id});

    if (student){
        students = students.filter((obj)=>{return obj.id !== req.params.id});
        res.status(201).send('Student ' + req.params.id + ' was deleted.');
    }
});

//update grade of a student
app.put('students/:name/:class/:grade', (req,res)=>{
    let student = students.find((student)=>{return student.name === req.params.name});

    if (student){
        student.classes[req.params.class] = parseInt(req.params.grade);
        res.status(201).send('Student ' + req.params.name + ' was not found.');
    }
});

//get GPA of the students
app.get('/students/:name/:gpa', (req,res)=>{
    let student = students.find((student)=> {return student.name === req.params.name});

    if (student){
        let classGrades = Object.values(student.class);
        let sumOfGrades = 0;
        classGrades.forEach(grade => {
            sumOfGrades = sumOfGrades + grade;
        });

        let gpa = sumOfGrades / classGrades.length;
        console.log(sumOfGrades);
        console.log(classGrades.length);
        console.log(gpa);
        res.status(201).send('' + gpa);
    } else {
        res.status(404).send('Student with name ' + req.params.name + ' was not found.');
    }
});

app.listen(8080, ()=>{
    console.log('Your Application is running on port 8080.');
});