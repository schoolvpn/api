const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// Admin List
exports.adminUserList = (req, res, next) => {
    User.find({})
      .then(users => {
        newdata = [];
        for (const user in users) {
          const data = users[user]
          newdata.push(
            {
              id: data._id,
              createdAt: data.createdAt,
              lastloginAt: data.lastloginAt,
              updatedAt: data.updatedAt,
              picture: data.picture,
              role: data.role,
              firstname: data.firstname,
              lastname: data.lastname,
              email: data.email,
              password: data.password,
              authCode: data.authCode,
              resetCode: data.resetCode,
              verified: data.verified
            })
        }
        res.status(200).json(newdata)
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      })
};
  
// Admin Edit
exports.adminUserEdit = (req, res, next) => {
User.findOneAndUpdate({_id: req.params.userId}, req.body)
    .exec()
    .then(user => {
    res.status(200).json({
        message: 'Account Eddited'
    })
    })
    .catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
    })
};

// Admin Delete
exports.adminUserDelete = (req, res, next) => {
User.find({_id: req.params.userId})
    .exec()
    .then(user => {
    if (user[0].role === 'admin') {
        res.status(500).json({
        message: "Cannot Delete Admin Account"
        })
    }
    else {
        User.deleteOne({_id: req.params.userId})
        .exec()
        .then(
            res.status(202).json({
            message: 'User Account Deleted'
            })
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({
            error: err
            });
        })
    }
    })
    .catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
    })
};