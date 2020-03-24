const logger = require("./src/config/appconfig").logger;
const app = require("./src/config/app");

app.on("appready", function() {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    logger.info(`server is listening on port ${PORT}`);
  });
});

// Do addition (database) setup here

// emit appready
app.emit("appready");
