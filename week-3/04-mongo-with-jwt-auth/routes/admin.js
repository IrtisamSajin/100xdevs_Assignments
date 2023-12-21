const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();
const jwt=require('jwt')

// Admin Routes
app.post("/signup", async (req, res) => {
  // Implement admin signup logic
  try {
    const username = req.body.username;
    const password = req.body.password;
    const NewAdmin = new Admin({
      username: username,
      password: password,
    });
    await NewAdmin.save();
    res.json({
      message: "Admin created successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.post("/signin", async (req, res) => {
  // Implement admin signup logic
  const username = req.headers.username;
  const password = req.headers.password;
  const admin = await Admin.findOne({ username: username });
  if (admin && admin.password === password) {
    const token=jwt.sign({adminUsername:admin.username},process.env.JWT_KEY);
    res.json({
        token,
    })
  } else {
    res.status(404).json({
      message: "Invalid credentials",
    });
  }
});

app.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  try {
    const { title, description, price, imageLink } = req.body;
    const newCourse = new Course({
      title,
      description,
      price,
      imageLink,
    });
    const savedCourse = await newCourse.save();
    res.json({
      message: "Course created successfully",
      courseId: savedCourse._id.toString(),
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  try {
    const courses = await Course.find({});
    let allCourses = [];
    courses.map((course) => {
      allCourses.push({
        id: course._id.toString(),
        title: course.title,
        description: course.description,
        price: course.price,
        imageLink: course.imageLink,
        published: course.published,
      });
    });
    res.json({
      course: allCourses,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
