'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();

const app = express();
app.use(cors());

// app.use(express.json())

const PORT = process.env.PORT;
mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });

const booksSchema = new mongoose.Schema({
    name:String,
    description:String,
    status:String,
    img:String

});

const UserSchema = new mongoose.Schema({
    // name:String,
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


// http://localhost:3005/books?userEmail=malshammari37@gmail.com
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

// http://localhost:3005/addBook?name=book1&description=about1&status=readed&userEmail=malshammari37@gmail.com
// app.post('/addBook',addBookHandler);

// localhost:3005/deleteCat/1?ownerName=razan
// app.delete('/deleteBook/:bookId',deleteBookHandler)


// function addBookHandler(req,res) {
//     console.log(req.body)
//     let {name,status,description,img,Email}= req.body
//     userModel.find({ email: Email},(error,bookData) => {
//         if (error) {
//             res.send(error, 'wrong user')
//         }
//         else {
//             console.log(bookData[0].books)
//             bookData[0].books.push({
//                 name: name,
//                 description: description,
//                 status: status,
//                 img: img




//             })
//             console.log('after adding', bookData[0])
//             bookData[0].save()
//             res.send(bookData[0].books)

//         }
//     })
    

// }
















app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})
