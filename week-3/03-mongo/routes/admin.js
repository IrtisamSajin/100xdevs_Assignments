const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Course } = require("../db");
const router = Router();

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
        message:"Server Error"
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
    const savedCourse=await newCourse.save();
    res.json({
        message: "Course created successfully",
        courseId: savedCourse._id.toString(),
    })
  } catch (err) {
    res.status(500).json({
        message: "Server Error",
    })
  }
});

app.get("/courses", adminMiddleware,async (req, res) => {
  // Implement fetching all courses logic
  try{
    const courses=await Course.find({});
    let allCourses=[];
    courses.map((course) => {
        allCourses.push({
            id: course._id.toString(),
            title: course.title,
            description: course.description,
            price: course.price,
            imageLink: course.imageLink,
            published: course.published
        })
    });
    res.json({
        course: allCourses
    })
  }catch(err){
    res.status(500).json({
        message: "Server Error"
    })
  }
});

module.exports = router;
