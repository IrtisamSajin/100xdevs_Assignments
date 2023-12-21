const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
app.post("/signup", async (req, res) => {
  // Implement user signup logic
  try {
    const username = req.body.username;
    const password = req.body.password;
    const NewUser = new User({
      username: username,
      password: password,
      purchasedCourses: [],
    });
    await NewUser.save();
    res.json({
      message: "User created successfully",
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
  const user = await User.findOne({ username: username });
  if (user && user.password === password) {
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_KEY
    );
    res.json({
      token,
    });
  } else {
    res.status(404).json({
      message: "Invalid credentials",
    });
  }
});

app.get("/courses", async (req, res) => {
  // Implement listing all courses logic
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

app.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  try {
    const courseid = mongoose.Types.ObjectId(req.query.courseId);
    const newCoursePurchased = await Course.findOne({ _id: courseid });
    const username = req.headers.username;
    const user = await User.findOne({ username: username });
    user.purchasedCourses.push({
      id: newCoursePurchased._id.toString(),
      title: newCoursePurchased.title,
      description: newCoursePurchased.description,
      price: newCoursePurchased.price,
      imageLink: newCoursePurchased.imageLink,
      published: newCoursePurchased.published,
    });
    await User.updateOne(
      { username: username },
      { purchasedCourses: user.purchasedCourses }
    );
    res.json({
      message: "Course purchased successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  try {
    const username = req.headers.username;
    const user = await User.findOne({ username: username });
    res.json({
      purchasedCourses: user.purchasedCourses,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});
