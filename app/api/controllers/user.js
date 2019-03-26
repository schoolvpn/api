const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require('../../config')

const User = require("../models/user");
const uniqueString = require('unique-string');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.sendgrid);

// User Signup
exports.userSignup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      // Email Exist Check
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email Already Exists"
        });
      } 
      // Password Length Check
      if (req.body.password.length <= 3) {
        return res.status(409).json({
          message: "Password Must Be Longer Than 3 Characters"
        })
      }
      // Encrypt Password And Create User Account
      else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const authcode = uniqueString()
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              lastloginAt: undefined,
              updatedAt: undefined,
              verified: false,
              authCode: authcode,
              picture: "https://cdn2.iconfinder.com/data/icons/rcons-user/32/male-shadow-fill-circle-512.png",
              role: "user",
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                const msg = {
                  to: req.body.email,
                  from: 'noreply@schoolvpn.ca',
                  subject: 'Email Authentication',
                  text: `Here is your email authentication code https://api.schoolvpn.ca/user/verify/${authcode}`,
                  html: `Here is your email authentication code: https://api.schoolvpn.ca/user/verify/${authcode}`
                };
                sgMail.send(msg);
                res.status(201).json({
                  message: "Please Check Your Email For Verification Link."
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

// User Login
exports.userLogin = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      // Not Found
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth Failed"
        });
      }
      if (user[0].verified !== true) {
        return res.status(401).json({
          message: "Account Not Verified Please Check your Email."
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        // Incorrect Password
        if (err) {
          return res.status(401).json({
            message: "Auth Failed"
          });
        }
        if (result) {
          User.findOneAndUpdate({_id: user[0]._id}, {lastloginAt: new Date()})
            .then()
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id,
                role: user[0].role,
                lastloginAt: user[0].lastloginAt
              },
              config.jwt_secret,
              {
                expiresIn: "1d"
              }
            );
            return res.status(200).json({
              message: "Auth Successful",
              token: token
            });
        }
        res.status(401).json({
          message: "Auth Failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

// User Info
exports.userMe = (req, res, next) => {
  User.find({_id: req.userData.userId})
    .then(user => {
      res.status(200).json({
        _id: user[0]._id,
        createdAt: user[0].createdAt,
        lastloginAt: user[0].lastloginAt,
        updatedAt: user[0].updatedAt,
        picture: user[0].picture,
        role: user[0].role,
        firstname: user[0].firstname,
        lastname: user[0].lastname,
        email: user[0].email
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    })
};

// User Edit
exports.userEditme = (req, res, next) => {
  if (req.body.role !== undefined) {
    res.status(401).json({
      message: "Cannot Change role"
    });
  }
  else if (req.body._id !== undefined) {
    res.status(401).json({
      message: "Cannot Change _id"
    });
  }
  else if (req.body.createdAt !== undefined) {
    res.status(401).json({
      message: "Cannot Change createdAt"
    });
  }
  else if (req.body.password !== undefined) {
    res.status(401).json({
      message: "Cannot Change password"
    });
  }
  else if (req.body.lastloginAt !== undefined) {
    res.status(401).json({
      message: "Cannot Change lastloginAt"
    });
  }
  else if (req.body.updatedAt !== undefined) {
    res.status(401).json({
      message: "Cannot Change updatedAt"
    });
  }
  else if (req.body.authCode !== undefined) {
    res.status(401).json({
      message: "Cannot Change authCode"
    });
  }
  else if (req.body.verified !== undefined) {
    res.status(401).json({
      message: "Cannot Change verified state"
    });
  }
  else {
    var request = req.body
    request.updatedAt = new Date()
    User.findOneAndUpdate({_id: req.userData.userId}, request)
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
  }
};

exports.userChangepassword = (req, res, next) => {
  User.find({ _id: req.userData.userId })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth Failed"
        });
      }
      bcrypt.compare(req.body.oldpassword, user[0].password, (err, result) => {
        if (!result) {
          return res.status(401).json({
            message: "oldpassword Does not match current password"
          });
        }
        if (result) {
          if (req.body.newpassword.length <= 3) {
            res.status(401).json({
              message: "Password must be longer than 3 characters"
            })
          }
          else {
            bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
              User.findOneAndUpdate({_id: req.userData.userId}, {password: hash})
              .then(
                res.status(200).json({
                  message: "Password Changed"
                })
              );
            })
          }
        }
      })
  })
};

exports.userChangepassword = (req, res, next) => {
  User.find({ _id: req.userData.userId})
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth Failed"
        });
      }
      bcrypt.compare(req.body.oldpassword, user[0].password, (err, result) => {
        if (!result) {
          return res.status(401).json({
            message: "oldpassword Does not match current password"
          });
        }
        if (result) {
          if (req.body.newpassword.length <= 3) {
            res.status(401).json({
              message: "Password must be longer than 3 characters"
            })
          }
          else {
            bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
              User.findOneAndUpdate({_id: req.userData.userId}, {password: hash})
              .then(
                res.status(200).json({
                  message: "Password Changed"
                })
              );
            })
          }
        }
      })
  })
};

exports.userVerifyAccount = (req, res, next) => {
  User.find({ authCode: req.params.authCode })
    .exec()
    .then(code => {
      if (req.params.authCode === code[0].authCode) {
        User.findOneAndUpdate({_id: code[0]._id}, {verified: true})
          .then(
            res.status(200).json({
              message: "Account Successfully Verified"
            })
          );
      } else {
        res.status(401).json({
          message: "Incorrect Verification Code"
        })
      }
  })
};