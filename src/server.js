const { app, connectDB } = require("./app");

const startServer = async () => {
  // Connect to database first
  await connectDB();
  
  // Then start the server
  app.listen(3000, () => {
    console.log("TicketBoss API running on http://localhost:3000");
    console.log("Swagger Docs: http://localhost:3000/docs");
  });
};

startServer();
