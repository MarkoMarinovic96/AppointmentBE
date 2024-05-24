const employeeRouter = require("express").Router();
const Employee = require("../models/employee");
const { userExtractor } = require("../utils/middleware");

employeeRouter.post(
  "/api/employee",
  userExtractor,
  async (request, response) => {
    const body = request.body;
    try {
      const employee = new Employee({
        name: body.name,
        img_url: body.img_url,
        working_days: body.working_days.map(day => ({
          day: day.day,
          type: day.type,
          start_time: day.start_time,
          end_time: day.end_time
        }))
      });
      const savedEmployee = await employee.save();
      response.status(201).json(savedEmployee);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

employeeRouter.get(
  "/api/employee",
  userExtractor,
  async (request, response) => {
    try {
      const employees = await Employee.find({});
      response.status(200).json(employees);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);
employeeRouter.post("/api/employee/:employeeId/service/:serviceId", async (request, response) => {
  try {
    const { employeeId, serviceId } = request.params;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return response.status(404).json({ error: "Employee not found" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return response.status(404).json({ error: "Service not found" });
    }

    if (!employee.services.includes(serviceId)) {
      employee.services.push(serviceId);
      await employee.save();
    }

    response.status(200).json(employee);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

employeeRouter.delete("/api/employee/:employeeId/service/:serviceId", async (request, response) => {
  try {
    const { employeeId, serviceId } = request.params;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return response.status(404).json({ error: "Employee not found" });
    }

    employee.services = employee.services.filter(id => id !== serviceId);
    await employee.save();

    response.status(200).json(employee);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = employeeRouter;
