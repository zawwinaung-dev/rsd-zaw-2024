const jwt = require("jsonwebtoken")

const user = { id: 1, name: "Alice", username: "alice"};
const secret = "some secret";

const token = jwt.sign(user, secret);
// console.log(token);

const output = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFsaWNlIiwidXNlcm5hbWUiOiJhbGljZSIsImlhdCI6MTczNTM3NjMyOH0.eZaHW8hheU-yf3iBeWKnOG9w0axAB_Kik4ffPrAbUng"
console.log(jwt.verify(output, secret));