
const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Array to store student records
let students = [];

// GET request - Open registration page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST request - Register student
app.post("/register", (req, res) => {

    const { name, email, age, course } = req.body;

    // Validate name
    if (!name || !/^[a-zA-Z ]+$/.test(name.trim())) {
        return res.status(400).json({
            message: "Please enter a valid student name."
        });
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email.trim())) {
        return res.status(400).json({
            message: "Please enter a valid email address."
        });
    }

    // Validate age
    const studentAge = Number(age);

    if (
        age === undefined ||
        age === "" ||
        !Number.isInteger(studentAge) ||
        studentAge < 16 ||
        studentAge > 100
    ) {
        return res.status(400).json({
            message: "Age must be between 16 and 100."
        });
    }

    // Validate course
    const validCourses = ["BCA", "BBA", "B.Com", "B.Sc", "MCA"];

    if (!validCourses.includes(course)) {
        return res.status(400).json({
            message: "Please select a valid course."
        });
    }

    // Check duplicate email
    if (students.some(student =>
        student.email.toLowerCase() === email.trim().toLowerCase()
    )) {
        return res.status(400).json({
            message: "Email is already registered."
        });
    }

    // Create student object
    const student = {
        name: name.trim(),
        email: email.trim(),
        age: studentAge,
        course: course
    };

    // Store student details
    students.push(student);

    res.status(201).json({
        message: "Student registered successfully!"
    });

});

// GET request - Display students
app.get("/students", (req, res) => {
    res.json(students);
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
