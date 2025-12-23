const { app, connectDB } = require("./app");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Connect to database first
  await connectDB();
  
  // Then start the server
  app.listen(PORT, () => {
    console.log(`TicketBoss API running on http://localhost:${PORT}`);
    console.log(`Swagger Docs: http://localhost:${PORT}/docs`);
  });
};

startServer();
