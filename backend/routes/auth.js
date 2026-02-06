const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_TOKEN } = require('./config');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

router.post('/createuser', [
    body('name').isLength({ min: 6 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('cnfpassword').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if the user already exists
        let user = await User.findOne({ name: req.body.name });
        if (user) {
            return res.status(400).json({ error: "User already exists, please use another name." });
        }

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const hashedCnfPassword = await bcrypt.hash(req.body.cnfpassword, salt);

        // Create new user
        const userdata = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            cnfpassword: hashedCnfPassword
        });

        await userdata.save(); // Save user to DB

        // Generate JWT token
        const data = {
            user: {
                id: userdata.id
            }
        };
        const authtoken = jwt.sign(data, JWT_TOKEN);

        res.json({ authtoken });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post('/login', [
    body('name'),
    body('password')
], async (req, res) => {
    try {

        let { name, password } = req.body

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if the user already exists
        let user = await User.findOne({ name: req.body.name });
        if (!user) {
            return res.status(400).json({ error: "No User existence ." });
        }

        let passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ error: "Password is incorrect, please try again" });
        }

        // Generate JWT token
        const data = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, JWT_TOKEN);

        res.json({ authtoken, name: req.body.name });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/getuser', fetchuser, async (req, res) => {
    try {
        let userid = req.user.id;
        let user = await User.findById(userid).select('-password -cnfpassword');


        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.put('/update/:id', fetchuser, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body
        const newdata = {}
        if (name) {
            newdata.name = name
        }
        if (!req.params) {
            return res.status(404).json({ error: "User not found" });
        }
        let dataupadte = await User.findById(req.params.id).select('-password -cnfpassword');

        dataupadte = await User.findByIdAndUpdate(id, { $set: newdata }, { new: true }).select('-password -cnfpassword')

        res.json(dataupadte);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {

        const { id } = req.params

        if (!req.params) {
            return res.status(404).json({ error: "User not found" });
        }
        let Datadelete = await User.findById(req.params.id);

        Datadelete = await User.findByIdAndDelete(id)

        res.status(200).json({ Datadelete: 'Deleted Data !' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/search/:key', fetchuser, async (req, res) => {
    try {

        const key  = req.params.key

        let search = await User.find({

            '$or': [
                { 'name': { $regex: key, $options: "i" } }


            ]

        })

        if (search.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }



        res.status(200).json({ search });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




module.exports = router;