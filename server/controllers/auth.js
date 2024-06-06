const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { db } = require("../connect");

const register = async (req, res) => {
  const query = "SELECT * FROM user WHERE username = ?";
  db.query(query, [req.body.username], (err, data) => {
    console.log(data.length);
    if (err) {
      return res.status(500).json(err);
    }
    if (data.length) {
      return res.status(409).json("User already exists!");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashpassword = bcrypt.hashSync(req.body.password, salt);

    const query =
      "INSERT INTO user (`name`, `password`, `username`, `email`) VALUE (?, ?, ?, ?)";
    // const query = `SELECT * FROM user;`;

    db.query(
      query,
      [req.body.name, hashpassword, req.body.username, req.body.email],
      (err, data) => {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(200).json("User has been created");
      }
    );
  });
};

const login = async (req, res) => {
  const { username } = req.body;

  const query = "SELECT * FROM user  WHERE username = ?";

  db.query(query, [username], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (data.length === 0) {
      return res.status(400).json("user not found");
    }

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword) {
      return res.status(400).json("Wrong password or username");
    }

    const token = jwt.sign({ id: data[0].id }, "secretKey");

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been looged out");
};

module.exports = {
  login,
  register,
  logout,
};
