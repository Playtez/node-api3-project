// code away!
const server = require("./server");

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log("\n* Server Running on http://localhost:8000 *\n");
});
