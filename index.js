require("dotenv").config();
const apps = require("./src/app");
const port = process.env.APP_PORT || 5555;

apps.app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
