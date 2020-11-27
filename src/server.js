require("dotenv/config");
import app from "./app";

app.listen(3001, () => {
  process.stdout.write("\x1Bc");
  console.log(`🚀 Seu-Barriga is running on port ${3001}!`);
});
