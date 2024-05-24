const express = require("express");
const User = require("../models/user");
const orderRouter = express.Router();
const Order = require("../models/order");
const Employee = require("../models/employee");
const { userExtractor } = require("../utils/middleware");

orderRouter.post("/api/order", userExtractor, async (request, response) => {
  try {
    const { employeeId, serviceId, date, time } = request.body;
    const userId = request.user.id;

    if (!employeeId || !serviceId || !date || !time) {
      return response.status(400).json({ error: "Missing required fields" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return response.status(404).json({ error: "Service not found" });
    }

    const selectedDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(
      selectedDateTime.getTime() + service.duration * 60000
    ); 
    const existingOrders = await Order.find({
      employee: employeeId,
      date: date,
      time: { $lt: endDateTime },
    });

    if (existingOrders.length > 0) {
      return response
        .status(400)
        .json({ error: "Selected time slot is already taken" });
    }

    const order = new Order({
      employee: employeeId,
      user: userId,
      service: serviceId,
      date: date,
      time: time,
      duration: service.duration,
    });

    const savedOrder = await order.save();
    const user = await User.findById(userId);
    const responseOrder = {
      user: {
        id: user._id,
        name: user.name,
      },
      time: savedOrder.time,
      date: savedOrder.date,
    };
    response.status(201).json(responseOrder);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//POST
// {
//     "employeeId": "123456789012345678901234", // ID zaposlenika
//     "date": "2024-03-20", // Datum narudžbe
//     "time": "10:00" // Vrijeme narudžbe
//   }

orderRouter.get(
  "/api/employee/:employeeId/availability",
  async (request, response) => {
    const { employeeId } = request.params;
    const { date } = request.query;

    try {
      const selectedDate = new Date(date);
      if (isNaN(selectedDate.getTime())) {
        return response.status(400).json({ error: "Invalid date" });
      }

      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return response.status(404).json({ error: "Employee not found" });
      }

      const orders = await Order.find({
        employee: employeeId,
        date: selectedDate,
        time: { $exists: true, $ne: null },
      }).populate("user", "name");

      const currentDay = selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const workingDay = employee.working_days.find(
        (day) => day.day === currentDay
      );
      if (!workingDay) {
        return response
          .status(400)
          .json({ error: "Employee does not work on selected day" });
      }

      response.status(200).json(orders);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);
// GET /api/employee/:employeeId/orders - 
orderRouter.get(
  "/api/employee/:employeeId/orders",
  async (request, response) => {
    try {
      const { employeeId } = request.params;

      const orders = await Order.find({ employee: employeeId }).populate(
        "user",
        "name"
      );

      response.status(200).json(orders);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

//GET /api/employee/employeeId/availability?date=2024-03-20
module.exports = orderRouter;
