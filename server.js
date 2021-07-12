'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();

const app = express();
app.use(cors());


const PORT = process.env.PORT;
mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });

const booksSchema = new mongoose.Schema({
    name:String,
    description:String,
    status:String

});

const UserSchema = new mongoose.Schema({
    name:String,
    books:[booksSchema],
    email:String

});

const myBookModel=mongoose.model('book',booksSchema);
const userModel=mongoose.model('owner',UserSchema);

function seadOwnerCollection(){
    const mariam = new userModel({email: 'malshammari37@gmail.com', books: [
        { name: 'The Growth Mindset', description: 'Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.', status: 'FAVORITE FIVE', img: 'https://m.media-amazon.com/images/I/61bDwfLudLL._AC_UL640_QL65_.jpg' },
        { name: 'The Momnt of Lift', description: 'Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation.', status: 'RECOMMENDED TO ME', img: 'https://m.media-amazon.com/images/I/71LESEKiazL._AC_UY436_QL65_.jpg'}
      ]})
      mariam.save();
}
seadOwnerCollection();






app.get('/', homePageHandler);
function homePageHandler(req, res) {
    res.send('all good')
}
// http://localhost:3005/books?userEmail=mariam
app.get('/books', booksHandler);

function booksHandler(req, res) {
let userEmail=req.query.userEmail;
userModel.find(
    {email:userEmail},function(error,ownerData){
    if(error){
        res.send(error,'did not work')
    }
    else{
        res.send(ownerData[0].books)
    }
    
})

}

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})
