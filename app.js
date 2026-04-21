const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

let students = [
    { id: 1, name: 'Alice Johnson', age: 20, course: 'Computer Science', grade: 'A' },
    { id: 2, name: 'Bob Smith', age: 22, course: 'Mathematics', grade: 'B' },
    { id: 3, name: 'Carol Davis', age: 21, course: 'Physics', grade: 'A' },
    { id: 4, name: 'David Wilson', age: 23, course: 'Engineering', grade: 'C' },
    { id: 5, name: 'Eva Brown', age: 19, course: 'Biology', grade: 'B' }
];

let nextId = 6;

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Simple Student App is running!', studentCount: students.length });
});

app.get('/api/students', (req, res) => {
    res.json(students);
});

app.get('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
});

app.post('/api/students', (req, res) => {
    const { name, age, course, grade } = req.body;
    if (!name || !age || !course || !grade) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const newStudent = {
        id: nextId++,
        name: name.trim(),
        age: parseInt(age),
        course: course.trim(),
        grade: grade.toUpperCase()
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

app.put('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, age, course, grade } = req.body;
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ error: 'Student not found' });
    students[index] = { ...students[index], name, age: parseInt(age), course, grade: grade.toUpperCase() };
    res.json(students[index]);
});

app.delete('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ error: 'Student not found' });
    const deleted = students.splice(index, 1)[0];
    res.json({ message: 'Student deleted successfully', student: deleted });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
