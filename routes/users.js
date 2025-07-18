import express from 'express';
import { pool } from '../queries.js';
import { sendEmail } from '../sendMail.js';
import { sendEmailPug } from '../sendMailPug.js';
import { sendEmailHandleBar } from '../sendMailHandleBar.js';

const router = express.Router();

// Add users - Create
router.post('/user/add', (req, res) => {
    const {
        first_name, 
        last_name, 
        email
    } = req.body;
    pool.query(`insert into usercollectionv1(first_name, last_name, email) values ($1, $2, $3)`, [first_name, last_name, email])
    res.send(`${first_name} has been added to the Database`);
    sendEmail(first_name, email); // using HTML template for email
    // sendEmailPug(first_name, email); // using Pug template for email
    // sendEmailHandleBar(first_name, email); // using Handlebars template for email
})  

// Get user list - Read
router.get('/get/user', async (req, res) => {
    const result = await pool.query(`select * from public.usercollectionv1`)
    res.send(result.rows);
})

// Get user by id - Read
router.get('/get/user/by/:user_id', async (req, res) => {
    const user_Id = parseInt(req.params.user_id);
    console.log(user_Id, "Requested user ID");
    const result = await pool.query(`select * from public.usercollectionv1 where user_id = $1`, [user_Id]);
    if (result.rows.length > 0) {
        res.send(result.rows);
    } else {
        res.status(404).send({ error: "User not found" });
    }
});

// Update user by id - Update
router.patch('/update/user/:user_id', async (req, res) => {
    try {
        const user_Id = parseInt(req.params.user_id);
        const { first_name, last_name, email } = req.body;

        const result = await pool.query(
            `UPDATE public.usercollectionv1 
            SET first_name = $1, last_name = $2, email = $3 
            WHERE user_id = $4`,
            [first_name, last_name, email, user_Id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({ error: "User not found" });
        }

        res.send(`User with ID ${user_Id} has been updated successfully`);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});


// To delete user by id - Delete
router.delete('/delete/user/:user_Id', async (req, res) => {
    const user_Id = parseInt(req.params.user_Id);
    console.log(user_Id, "Requested user ID");
    pool.query(`delete from public.usercollectionv1 where user_id = $1;`, [user_Id]);
    res.send(`${user_Id} deleted successfully from database`);
});

export default router