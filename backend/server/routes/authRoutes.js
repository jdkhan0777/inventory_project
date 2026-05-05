const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
// const user = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const user = require("../models/user");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword  ,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
});


// recieve login request
router.post("/login", async (req, res)=> {
  try {
    const{email,password} = req.body;

    const foundUser = await User.findOne({email});
    console.log("Found user:", foundUser);

    if(!foundUser) {
      return res.status(400).json({message: "Invalid email or password"});
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    console.log("Password match:", isMatch);

    if(!isMatch) {
      return res.status(400).json({message: "Invalid email or password"});
    }

    const token = jwt.sign( 
      { 
        userId:foundUser.id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    );

    res.status(200).json({message: "Login successful",token});  
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({message: "Login failed", token});
  }
});

module.exports = router;