const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.listen(5000, () => {
  console.log("http://127.0.0.1:5000");
});

// 创建数据库连接
const mysql = require("mysql2");
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "node",
});
// 解析表单的body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
// 解析请求体并设置req.body属性，必须在使用req前使用
app.use(express.json())

// 配置跨域
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method == "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
  else next();
});

// 登录
app.post("/api/login", (req, res) => {
    console.log(req.body);
  const sqlStr =
    "select * from login where username = ? and password = ?";
  conn.query(sqlStr, [req.body.username,req.body.password], (err, results) => {
    if (err)
      return res.json({ status_code: 1, message: "获取数据失败", err, sqlStr });
    if (results.length !== 1)
      return res.json({ status_code: 1, message: "数据不存在", sqlStr });
    else {
      const token = jwt.sign(
        { username: req.body.username },
        //2. 私钥
        "secret12345",
        //3. 过期时间
        {
          expiresIn: 3600 * 24 * 3,
        }
      );
      res.json({
        status_code: 200,
        message: results[0],
        token: token,
      });
    }
  });
});

// 获取所有的数据
app.get("/api/getuser", (req, res) => {
  const sqlStr = "select * from user";
  conn.query(sqlStr, (err, results) => {
    console.log(results);
    if (err)
      return res.json({ err_code: 1, message: "获取失败", affectedRows: 0 });
    res.json({
      err_code: 0,
      message: results,
      affectedRows: 0,
    });
  });
});

// 添加数据
app.post("/api/adduser", (req, res) => {
  const user = req.body;
  console.log(user);
  const sqlStr = "insert into user set ?";
  conn.query(sqlStr, user, (err, results) => {
    if (err)
      return res.json({ err_code: 1, message: "添加失败", affectedRows: 0 });
    if (results.affectedRows !== 1)
      return res.json({ err_code: 1, message: "添加失败", affectedRows: 0 });
    res.json({
      err_code: 0,
      message: "添加成功",
      affectedRows: results.affectedRows,
    });
  });
});

// 根据ID 获取相关数据
app.get("/api/getuserbyid", (req, res) => {
  const id = req.query.id;
  const sqlStr = "select * from user where id = ?";
  conn.query(sqlStr, id, (err, results) => {
    if (err)
      return res.json({
        err_code: 1,
        message: "获取数据失败",
        affectedRows: 0,
      });
    if (results.length !== 1)
      return res.json({ err_code: 1, message: "数据不存在", affectedRows: 0 });
    res.json({
      err_code: 0,
      message: results[0],
      affectedRows: 0,
    });
  });
});

// 根据ID 删除数据
app.delete("/api/deluserbyid", (req, res) => {
  const id = req.query.id;
  const sqlStr = "delete from user where id = ?";
  conn.query(sqlStr, id, (err, results) => {
    if (err)
      return res.json({ err_code: 1, message: "删除失败", affectedRows: 0 });
    if (results.affectedRows !== 1)
      return res.json({ err_code: 1, message: "删除失败", affectedRows: 0 });
    res.json({
      err_code: 0,
      message: "删除成功",
      affectedRows: results.affectedRows,
    });
  });
});

// 根据id修改数据
app.post("/api/updateuser", (req, res) => {
  const sqlStr = "update user set ? where id = ?";
  conn.query(sqlStr, [req.body, req.body.id], (err, results) => {
    if (err)
      return res.json({ err_code: 1, message: "更新失败", affevtedRows: 0 });
    //影响行数不等于1
    if (results.affectedRows !== 1)
      return res.json({
        err_code: 1,
        message: "更新的信息不存在",
        affectedRows: 0,
      });
    res.json({
      err_code: 0,
      message: "更新成功",
      affectedRows: results.affectedRows,
    });
  });
});
