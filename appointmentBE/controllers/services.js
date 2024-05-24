const express = require("express");
const serviceRouter = express.Router();
const Service = require("../models/service");

serviceRouter.post("/api/service", async (request, response) => {
  try {
    const { name, duration, price, description } = request.body;

    if (!name || !duration || !price) {
      return response.status(400).json({ error: "Missing required fields" });
    }
    const newService = new Service({
      name,
      duration,
      price,
      description
    });

    const savedService = await newService.save();

    response.status(201).json(savedService);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

serviceRouter.get("/api/service", async (request, response) => {
  try {
    // Pronalaženje svih usluga
    const services = await Service.find();

    response.status(200).json(services);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
});


serviceRouter.get("/api/service/:id", async (request, response) => {
  try {
    const serviceId = request.params.id;
    const service = await Service.findById(serviceId);

    if (!service) {
      return response.status(404).json({ error: "Service not found" });
    }

    response.status(200).json(service);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = serviceRouter;
