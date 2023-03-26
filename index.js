let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
let cors = require('cors');

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//homepage
app.get('/',(req, res) => {
    return res.send({
        error: false,
        message: 'Wecome to RESTful CRUD API with NodeJS, Express, MYSQL',
        written_by:'praween',
        published_on: 'https://milerdev.dev'
    })
})

//connection to mysql database  เชื่อมกับข้อมูล
let dbCon = mysql.createConnection({
    host: 'lvq.h.filess.io',
    user: 'temidb_eventdrawn',
    password: 'f3812bb929e9770e29ba1c4eaaaaad708712efdd',
    database: 'temidb_eventdrawn',
    port: '3307'
})

dbCon.connect();

// //retriveve all books  เปิดข้อมูลทั้งหมดในlocalhost
app.get('/books/data',(req, res) => {
    dbCon.query('SELECT * FROM books',(error, results, fields) => {
        if(error) throw error;

        let message = ""
        if (results === undefined || results.length == 0 ) {
            message ="Books table is empty";
        } else {
            message = "Successfully retrieved all books";
        }
        // return res.send({ error:false, data: results, message: message});
        return res.send({ data: results});
    })
})



//add a new book  เพิ่มข้อมูลผ่านpost
app.post('/book', (req,res) =>{
    let name = req.body.name;
    let author = req.body.author;

    //validation
    if (!name || !author) {
        return res.status(400).send({error:true, message:"Please provide book name and author."});
    } else{
        dbCon.query('INSERT INTO books (name, author) VALUES(?,?)',[name,author],(error,results,fields)=>{
            if (error) throw error;
            return res.send({ error: false, data: results, message:"Book successfuly added"})
        })
    }
});

//retrieve book by id   หาข้อมูล โดยหาจากไอดี
app.get('/book/:id',(req,res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({ error:true, message:"Please provide book id"});
    } else {
        dbCon.query("SELECT * FROM books WHERE id = ?", id, (error,results, fields) => {
            if (error) throw error;
            
            let message ="";
            if (results === undefined || results.length==0){
                message = "Book not found";
            } else {
                message = "Successfully retrieved book data";
            }
            return res.send({error:false, data: results[0], message: message})
        })
    }
})

//update book with id  เปลี่ยนข้อมูลโดยใช้id ในการหา
app.put('/book',(req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let author = req.body.author;

    //validation
    if (!id || !name || !author) {
        return res.status(400).send({error:true, message:'Please provide book id,nameand author'});
    } else {
        dbCon.query('UPDATE books SET name = ?, author =? WHERE id = ?', [name, author, id],(error,results,fields)=>{
            if (error) throw error;

            let message ="";
            if (results.changedRows ===0){
                message = "Book not found or data are same";
            } else {
                message = "Book successfully updated";
            }

            return res.send({error:false, data:results, message:message})
        })
    }
})

// delete book by id  ลบidไปเลย 
app.delete('/book',(req, res)=>{
    let id =req.body.id;

    if(!id) {
        return res.status(400).send({error:true, message: "Please provide book id"});
    } else {
        dbCon.query('DELETE FROM books WHERE id = ?',[id],(error, results, fields)=>{
            if (error) throw error;

            let message ="";
            if (results.affectedRows ===0){
                message = "Book not found";
            } else {
                message = "Book successfully deleted";
            }
            return res.send({error:false, data:results, message: message})
        })
    }
})

app.listen(3000, () =>{
    console.log('Node App is running on port 3000')
})

module.exports = app;
