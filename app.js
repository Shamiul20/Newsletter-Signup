const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const MailerLite = require("@mailerlite/mailerlite-nodejs").default;
const port = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize MailerLite client
const mailerlite = new MailerLite({
  api_key: (process.env.MAILERLITE_API_KEY =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiZmQyZTNhN2QyNmFlZTAzMGFiN2QwNzM2ZTdiYWE0Zjc5ZWJhNTY2NjRmMTRkOGE5NDcyMjIwY2JiZmU0MWQyN2QwZjIxNTgxNDNiMWM4MGEiLCJpYXQiOjE3MjU2MTkyNzcuMjgyNzM4LCJuYmYiOjE3MjU2MTkyNzcuMjgyNzQxLCJleHAiOjQ4ODEyOTI4NzcuMjc5MDExLCJzdWIiOiIxMTAyMzkwIiwic2NvcGVzIjpbXX0.IhcC647VfrNyhJrd3Gxp3A0d1x-w2T6DQrFchzbk2eoMq0zTVNLuvRZCt3NVSIlHJ_Htf_yEMHxzkTzCYyF_agx1ljm40oRCL4iXkHzOFoe0KJRMuDEMGpsuGJdDC90tj8gSIngxbLyDxXUP8BkAmM8Xg9XD0YfpQkJgiT3u1IPxk5EC0wabya6Dl1yljAzIRAccZ5F7LrE7GiGnaB3y89LNBgacG7rxfPUl_cO1ImjFAti7gdsj6kzFxjMQdB-ezGtzfpcfGFgJYvTOunvQRXf5zjUb44D_gsyPwd3jI9GVhWDBfCBT1Ku1jrjzS-uSRfQHvQJ2L-qxczbqWZJvnianKstMamxOLSgjSeHOE8gvLH_Q4LGlMzwhRmTl8ws_zDNoopnMdODnLP4s0yu-PkU-Er1PnJjGju3xoqLE2kkIyxaKqUTO68tIClA7PRpQUEeWmBlIUtQ6Jcd2dOBfpIoV3Mr8qEPRz56nY41wN-1zkZTDJr52rpqvkCkiuh2VDRqb4NDTtnOn_9ZAs9U7CWgzi5WORFupAuivoVpw_YDFhfKGEjrL2lHKLu7SjdsGYxtwSa8SeDraY-MKkwrLOjZ_s_JLdFufMm1D_lstXrBqCuCpJx5wdyQQIiJVHL-5x9-xL0bX3HUPP264B6hUFY7apyOLGi8Z32k4B0ch-BI"),
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", async function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const params = {
    email: email,
    fields: {
      name: `${firstName} ${lastName}`,
      last_name: lastName,
    },
    groups: ["131723726149387610"], // Replace with your actual group ID
  };

  try {
    const response = await mailerlite.subscribers.createOrUpdate(params);
    console.log("Subscriber added/updated:", response);
    res.sendFile(__dirname + "/success.html");
  } catch (error) {
    console.error("Error adding subscriber:", error);
    res.status(500).sendFile(__dirname + "/failure.html");
  }
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
