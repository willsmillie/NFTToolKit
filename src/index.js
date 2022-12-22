const { Main, Start } = require("./tools");

(async () => {
  try {
    await Main();
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
})();
