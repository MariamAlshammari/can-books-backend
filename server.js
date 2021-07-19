'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());

app.use(express.json())


const PORT = process.env.PORT;
mongoose.connect('mongodb://mariamalshammari:0000@cluster0-shard-00-00.652vg.mongodb.net:27017,cluster0-shard-00-01.652vg.mongodb.net:27017,cluster0-shard-00-02.652vg.mongodb.net:27017/books?ssl=true&replicaSet=atlas-t8heu1-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const booksSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: String,
    img: String

});

const UserSchema = new mongoose.Schema({
    // name:String,

    email: String,
    books: [booksSchema]


});

const myBookModel = mongoose.model('book', booksSchema);
const userModel = mongoose.model('owner', UserSchema);

function seadOwnerCollection() {
    const mariam = new userModel({
        email: 'malshammari37@gmail.com', books: [
            { name: 'The Growth Mindset', description: 'Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.', status: 'FAVORITE FIVE', img: 'https://m.media-amazon.com/images/I/61bDwfLudLL._AC_UL640_QL65_.jpg' },
            { name: 'The Momnt of Lift', description: 'Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation.', status: 'RECOMMENDED TO ME', img: 'https://m.media-amazon.com/images/I/71LESEKiazL._AC_UY436_QL65_.jpg' }
        ]
    })
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
    let userEmail = req.query.userEmail;
    userModel.find(
        { email: userEmail }, function (error, ownerData) {
            if (error) {
                res.send(error, 'did not work')
            }
            else {
                res.send(ownerData[0].books)
            }

        })

}

// http://localhost:3005/addBook?name=book1&description=about1&status=readed&userEmail=malshammari37@gmail.com
app.post('/addBook', addBookHandler);

// localhost:3005/books/1?userEmail=malshammari37@gmail.com
app.delete('/books/:bookId', deleteBookHandler)
app.put('/updateBook/:bookId', updateBookHandler)


function addBookHandler(req, res) {
    console.log(req.body)
    let { name, status, description, img, Email } = req.body
    console.log(Email);

    userModel.find({ email: Email }, (error, booksData) => {
        if (error) {
            res.send(error, 'wrong user')
        }
        else {
            console.log('befor', booksData[0])
            booksData[0].books.push({
                name: name,
                description: description,
                status: status,
                img: img




            })
            console.log('after adding', booksData[0])
            booksData[0].save()
            res.send(booksData[0].books)

        }
    })


}
function deleteBookHandler(req, res) {

    console.log(req.params)
    console.log(req.query)

    let bookId = Number(req.params.bookId)
    console.log(bookId);
    let userEmail = req.query.userEmail
    console.log(userEmail)
    userModel.find({ email: userEmail }, (error, booksData) => {

        if (error) { res.send(error, 'not delete') }
        else {
            let newBookArr = booksData[0].books.filter((item, idx) => {
                // return idx !==bookId
                if (idx !== bookId)
                    return item

            })
            booksData[0].books = newBookArr
            console.log('data after del', booksData[0].books)
            booksData[0].save()
            res.send(booksData[0].books)
        }

    })
}

function updateBookHandler(req, res) {
    console.log('params:', req.params)
    console.log('query:', req.query)
    let { name, status, description, img, userEmail } = req.body
    console.log(userEmail);
    let bookId = Number(req.params.bookId);
    console.log(bookId);
    userModel.findOne({ email: userEmail }, (error, booksData) => {

        if (error) { res.send(error, 'not delete') }
        else {
            console.log(booksData)
            booksData.books.splice(bookId, 1, {
                name: name,
                status: status,
                description: description,
                img: img
            })
            console.log(booksData)
            booksData.save();
            res.send(booksData.books)

        }
    })

}




app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})
