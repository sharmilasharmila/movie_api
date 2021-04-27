const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./model'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJWT;

passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField : 'Password'
}, (username, password, callback) => {
    console.log(username + ' ' + password);
    Users.findOne({ Username : username}, (error, user)=>{
        if (error){
            console.log(error);
            return callback(error);
        }

        if(!user){
            console.log('Incorrect Username');
            return callback(null, false, {message: 'Incorrect Username oor Password.'});
        }
        if(!user.validatePassword(password)){
            console.log('incorrect Password');
            return callback(null, false, {message: 'Incorrect Password.'});
        }
        console.log('finished');
        return callback(null, user);
    });
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
    .then((user)=>{
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    });
}));
