var eventModel = require('../model/eventModel');
var userModel = require('../model/userModel');
const historyStudentServices = require("../services/historyStudentServices");
const sendEmailService = require('../services/emailServices');
const moment = require('moment');

class eventServices {

  //Get all evetns
  async getEvents() {
    return await eventModel
      .find()
      .sort({ created: -1 })
      .populate({
        path: 'host',
        model: 'User'
      })
      .populate({
        path: 'participatingTeachers',
        model: 'User'
      });
  }

  //Get all events filter by user_id
  async getEventsByUserId(userId) {
    const user = await userModel.findOne({ _id: userId });
    if (user.role === 'student') {
      const events = await eventModel
        .find({
          $or: [
            { "participatingStudents": { $in: [user.email] } },
            { "listStudentRegistry": { $in: [user.email] } }
          ]
        })
        .sort({ created: -1 })
        .populate({
          path: 'host',
          model: 'User'
        })
        .populate({
          path: 'participatingTeachers',
          model: 'User'
        });
        return events
    }
    if (user.role === 'teacher') {
      const events = await eventModel
      .find({
        $or: [
          { "participatingTeachers": { $in: [userId] } },
          { "host": userId }
        ]
        
      })
      .sort({ created: -1 })
      .populate({
        path: 'host',
        model: 'User'
      })
      .populate({
        path: 'participatingTeachers',
        model: 'User'
      });
      return events
    }
    else {
      return await eventModel
        .find()
        .sort({ created: -1 })
        .populate({
          path: 'host',
          model: 'User'
        })
        .populate({
          path: 'participatingTeachers',
          model: 'User'
        });
    }
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

    return await eventModel
      .find(query)
      .populate({
        path: 'host',
        model: 'User'
      })
      .populate({
        path: 'participatingTeachers',
        model: 'User'
      });
  }

  //Get 10 newest events
  async getNewestEvents() {
    return await eventModel
      .find({})
      .sort({ created: -1 }) // Sort in descending order based on the "created" field
      .limit(10) // Limit the result to 10 events
      .populate({
        path: 'host',
        model: 'User'
      })
      .populate({
        path: 'participatingTeachers',
        model: 'User'
      });
  }

  //Get events summary in current year (total events, total finished events, total ongoing events, total unstarted events)
  async getSummaryEventsInYear() {
    const year = new Date().getFullYear();
    // total events
    const totalEvents = await eventModel.find({
      created: {
        $gte: new Date(year, 0, 1), // Start of the year
        $lt: new Date(year + 1, 0, 1), // Start of the next year
      },
    });
    // total finished events
    const totalFinishedEvents = await eventModel.find({
      created: {
        $gte: new Date(year, 0, 1), // Start of the year
        $lt: new Date(year + 1, 0, 1), // Start of the next year
      },
      status: "finished"
    });

    // total ongoing events
    const totalOngoingEvents = await eventModel.find({
      created: {
        $gte: new Date(year, 0, 1), // Start of the year
        $lt: new Date(year + 1, 0, 1), // Start of the next year
      },
      status: "ongoing"
    });

    // total undone events
    const totalTodoEvents = await eventModel.find({
      created: {
        $gte: new Date(year, 0, 1), // Start of the year
        $lt: new Date(year + 1, 0, 1), // Start of the next year
      },
      status: "todo"
    });

    return {
      totalEvents: totalEvents.length,
      totalFinishedEvents: totalFinishedEvents.length,
      totalOngoingEvents: totalOngoingEvents.length,
      totalTodoEvents: totalTodoEvents.length,
    }
  }

  //Get summary evetn in current month
  async getSummaryEventsInMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed month number

    // Start and end dates of the current month
    const startDate = new Date(year, month, 1); // Start of the month
    const endDate = new Date(year, month + 1, 0); // End of the month (day before next month)

    // Get total events for current month
    const totalEvents = await eventModel.find({
      created: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    // Get finished events for current month
    const totalFinishedEvents = await eventModel.find({
      created: {
        $gte: startDate,
        $lt: endDate,
      },
      status: "finished",
    });

    // Get ongoing events for current month
    const totalOngoingEvents = await eventModel.find({
      created: {
        $gte: startDate,
        $lt: endDate,
      },
      status: "ongoing",
    });

    // Get todo events for current month
    const totalTodoEvents = await eventModel.find({
      created: {
        $gte: startDate,
        $lt: endDate,
      },
      status: "todo",
    });

    return {
      totalEvents: totalEvents.length,
      totalFinishedEvents: totalFinishedEvents.length,
      totalOngoingEvents: totalOngoingEvents.length,
      totalTodoEvents: totalTodoEvents.length,
    };
  }

  //Get specific event
  async getEvent(id) {
    const event = await eventModel
      .findById(id)
      .populate({
        path: 'host',
        model: 'User'
      })
      .populate({
        path: 'participatingTeachers',
        model: 'User'
      });
    return event;
  }


  //Add new event
  async addEvent(req) {
    const event = await eventModel.findOne({ name: req.body.name });
    if (!event) {
      const newEvent = await new eventModel(req.body).save();
      return newEvent
    }
  }

  //Edit event
  async editEvent(req) {
    const findEvent = await eventModel.findOne({ _id: req.params.id });
    if (findEvent) {
      //update event
      await eventModel.updateOne({ _id: req.params.id }, { $set: req.body });

      //if event status set to finished then send finised mail
      if (findEvent.status !== 'finished' && req.body.status === 'finished') {
        const updatedEvent = await eventModel
          .findOne({ _id: req.params.id })
          .populate({
            path: 'host',
            model: 'User'
          })
          .populate({
            path: 'participatingTeachers',
            model: 'User'
          });;
        await sendEmailService.sendFinishedEventEmail(updatedEvent);
      }

      return req.body
    }
    return
  }

  async delEvent(id) {
    const event = await eventModel.findOne({ _id: id });
    if (event) {
      await eventModel.deleteOne({ _id: id })
      return event
    }
    return
  }

  async uploadExcelEvent(req, mssvList) {
    const eventId = req.params.eventId
    const isCheckingFileString = req.query.isCheckingFile
    const isCheckingFile = isCheckingFileString === "true";
    try {
      const findEvent = await eventModel.findOne({ _id: eventId });
      if (!findEvent) {
        throw new Error(`Event not found: Event with ID ${eventId} does not exist.`);
      }

      if (req.file) {
        if (isCheckingFile) {
          await eventModel.updateOne({ _id: eventId }, { participationList: req.file.filename, participatingStudents: mssvList });
        } else if (!isCheckingFile) {
          await eventModel.updateOne({ _id: eventId }, { registryList: req.file.filename, listStudentRegistry: mssvList });
        } else {
          throw new Error('Invalid request: Specify either "registryList" in request params.');
        }

        await historyStudentServices.addHistoryStudent(mssvList, findEvent)
      } else {
        throw new Error('No file uploaded!');
      }

      return eventId;
    } catch (error) {
      console.error(error.message);
    }
  }

  async checkEventDaily() {
    const startOfToday = moment().startOf('day');
    const endOfToday = moment().endOf('day');

    const events = await eventModel.aggregate([
      {
        $match: {
          startAt: {
            $gte: startOfToday.toDate(), // Start date is today or after start of today
            $lt: endOfToday.toDate() // Start date is before the end of today
          },
          status: 'todo' // Include only events with status 'todo'
        }
      },
      {
        $lookup: {
          from: 'users', // Assuming 'User' is the collection name for the User model
          localField: 'host',
          foreignField: '_id',
          as: 'host'
        }
      },
      {
        $unwind: "$host" // unwind host array
      },
    ]);

    events.forEach(async event => {
      const participatingTeachersInfo = [];

      await Promise.all(event.participatingTeachers.map(async teacherId => {
        const teacherInfo = await userModel.findOne({ _id: teacherId });
        participatingTeachersInfo.push(teacherInfo);
      }));

      event.participatingTeachers = participatingTeachersInfo;
      sendEmailService.sendNotificationBeginEventEmail(event);
    });

    return 'Success';
  }
}

module.exports = new eventServices();