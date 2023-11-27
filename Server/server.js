const express = require('express')
const mongoose = require('mongoose')
const path = require('path');
const bodyParser = require('body-parser')

//Schema Banano hoise
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    SID: {
        type: Number,
        required: true
    },
    university: {
        type: String,
        required: true
    }
})

//Models
const Student = mongoose.model('Student', studentSchema);

const app = express()
const PORT = 3000;

app.use(bodyParser.json());

//Database Connections
mongoose.connect('mongodb://localhost/TestForm')
.then(console.log('Connection to Database Successful!'))


//Header is a must to be included to keep js files in the server
app.use('/JS', express.static(path.join(__dirname, '..', 'JS'), { 'Content-Type': 'application/javascript' }));

//Route making to get the HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Client', 'form.html'))
})

//Routes to submit data into the backend
app.post('/api/students', async (req, res) => {
    try {
        const { name, SID, university } = req.body;
        const student = new Student({ name, SID, university });
        const savedStudent = await student.save();
        res.json(savedStudent);
    } catch (error) {
        console.log('Error Submitting Data: ' + error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
//Fetching students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
//Deleting the Student with ID
app.delete('/api/students/:id', async (req, res) => {
    const studentId  = req.params.id;

    try {
        const deletedStudent = await Student.findOneAndDelete({ SID: studentId });

        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
//Searching the Students
app.get('/api/students/find', logger, async (req, res) => {
    try {
        const { name } = req.query;

        const nameFilter = name ? { name: { $regex: new RegExp(name, 'i') } } : {};

        const students = await Student.find(nameFilter);
        res.json(students);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Update a student name to updated name
app.patch('/api/students/update/:id', async (req, res)=>{
    const studentID = req.params.id;
    try{
        const updateStudent = await Student.findOneAndUpdate(({SID: studentID}), {
            name: 'Asif',
        }, {useFindandModify: true, new: true});
    }catch(error){
        res.status(500).send(error.message);}
})

//Middleware
function logger(req, res, next){
    console.log('Hello from middleware');
    next();
}

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})