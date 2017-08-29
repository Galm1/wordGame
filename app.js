const express = require('express');
const mustacheExpress = require('mustache-express');
const parseurl = require('parseurl');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const app = express();
const models = require('./models/models.js');
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
let path = require('path');

let display = {
  letters:[]
};

app.use( function (req, res, next){
  if(!req.session.game){
    req.session.game = true;
    display.letters=[]
    display.secretWord = models.randomWord(models.listOfWords).split('');
    display.numOfGuess = display.secretWord.length-1;
    display.unknownWord = []
    for (let i = 0; i < display.secretWord.length; i++) {
      display.unknownWord.push('_');
    }next('route');
  }else{
    next();
  }});
app.get('/', function(req, res, next){
    res.render('index', display);
  });
app.get('/new', function(req,res,next){
    res.render('new', display)
  });
app.post('/', function(req, res, next){
    let guessLetter = req.body.guessLetter;
    req.checkBody('guessLetter', "You must type something").notEmpty();
    req.checkBody('guessLetter', "It must be a letter").isAlpha();
    let errors = req.validationErrors();
    if (errors){
      display.errors = errors;
      console.log(errors);
      res.render('index', display);
    }else{
     let alreadyGuessed = false;
      for (let i = 0; i < display.letters.length; i++) {
        if(display.letters[i] === guessLetter){
          alreadyGuessed = true;
        }else if(display.letters[i].toUpperCase() === guessLetter){
          alreadyGuessed = true;
        }else if(display.letters[i].toLowerCase() === guessLetter){
          alreadyGuessed = true;
        }}
      if(display.errors){
        delete display['errors'];
      }if (!alreadyGuessed) {
        display.letters.push(guessLetter);
        let isRight = false;
        for (let i = 0; i < display.secretWord.length; i++) {
          if(guessLetter === display.secretWord[i]){
          display.unknownWord[i] = guessLetter;
          isRight = true;
        }else if (guessLetter.toUpperCase() === display.secretWord[i]) {
            display.unknownWord[i] = guessLetter.toUpperCase();
            isRight = true;
          }else if (guessLetter.toLowerCase() === display.secretWord[i]){
            display.unknownWord[i] = guessLetter.toLowerCase();
            isRight = true;
          }}if(isRight === false){
          display.numGuesses--;
        }}if (display.unknownWord.toString()===display.secretWord.toString()) {
        res.redirect('/new');
        display.win = true;
      }else if(display.numGuesses === 0){
        display.win =false;
        res.redirect('/new')
      }else{
        console.log('in else ' + display);
      res.render('index', display);
    }}});
console.log(display);
    app.post('/new', function(req,res,next){
      req.session.game = false;
      res.redirect('/')
    });

app.listen(3000, function () {
  console.log('SERVER IS LIVE');
})
