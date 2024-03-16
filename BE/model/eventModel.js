var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  host: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },

  participatingTeachers: [{ type: mongoose.Types.ObjectId, default: [], ref: 'User' }],
  participatingStudents: [{ type: String, default: [], required: false }],
  listStudentRegistry:  [{ type: String, default: [], required: false }],

  linkEvents: [{ type: mongoose.Types.ObjectId, default: [], ref: 'Event' }], // links a sub events

  linkFormRegistry: {type : String, required: false, default: ''},

  location: {type : String, required: true, default: ''},
  activitiesPoint: { type: Number, required: true, default: 0 },
  status: { type: String, required: true, default: 'todo' },

  registryList: { type: String, required: false },
  participationList: { type: String, required: false },

  startAt: { type: Date, required: true, default: new Date().toJSON().slice(0, 10) },
  endAt: {
    type: Date, required: true, default: () => {
      const currentDate = new Date();
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);
      return nextDay.toJSON().slice(0, 10);
    }
  },
  created: { type: Date, required: true, default: new Date() },
});

EventSchema.index({ name: 1});
EventSchema.index({ created: 1 });

var Event = mongoose.model('Event', EventSchema);
module.exports = Event;

