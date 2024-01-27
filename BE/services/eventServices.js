var eventModel = require('../model/eventModel');
var notificationModel = require('../model/notificationModel')

class eventServices {
  //Get all events in DB
  async getEvents() {
    return await eventModel.find();
  }

  //Get all event in specific year
  async getEventsInYear(targetYear, status) {
    const startYear = new Date(targetYear, 0, 1); // January 1st of the target year
    const nextYear = parseInt(targetYear) + 1;
    const endYear = new Date(nextYear.toString(), 0, 1); // January 1st of the next year

    const query = {
      $and: [
        { created: { $gte: startYear } },
        { created: { $lt: endYear } }
      ]
    };

    if (status) {
      query.$and.push({ status: status });
    }

    return await eventModel.find(query);
  }

  //Get 10 newest events
  async getNewestEvents() {
    return await eventModel
      .find({})
      .sort({ created: -1 }) // Sort in descending order based on the "created" field
      .limit(10); // Limit the result to 10 events
  }

  //Get specific event
  async getEvent(id) {
    const event = await eventModel.findById(id);
    return event;
  }


  //Add new event
  async addEvent(req) {
    const event = await eventModel.findOne({ name: req.body.name });
    if (!event) {
      // create default 2 notification 1 at begin of event one in deadline of event
      const newEvent = await new eventModel(req.body).save();
      await new notificationModel({
        name: newEvent.name + '_Begin Event',
        eventId: newEvent._id,
        content: "This is notification for event",
        notificationTime: newEvent.startAt,
      }).save();
      await new notificationModel({
        name: newEvent.name + '_Deadline Event',
        eventId: newEvent._id,
        content: "This is notification deadline for event",
        notificationTime: newEvent.endAt,
      }).save();
      return newEvent
    }
  }

  //Edit event
  async editEvent(req) {
    const findEvent = await eventModel.findOne({ _id: req.params.id })
    if (findEvent) {
      await eventModel.updateOne({ _id: req.params.id }, { $set: req.body });
      return req.body
    }
    return
  }

  //Delete event
  async delEvent(id) {
    const event = await eventModel.findOne({ _id: id });
    if (event) {
      await eventModel.deleteOne({ _id: id })
      return event
    }
    return
  }
}

module.exports = new eventServices();