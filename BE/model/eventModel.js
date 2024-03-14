var mongoose = require('mongoose');var EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  host: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }, // the one who create this event
  
  participatingTeachers: [{ type: mongoose.Types.ObjectId, default: [], ref: 'User' }], // list of teacher who join this event
  participatingStudents: [{ type: String, default: [], required: false }], // list of student who join this event
  listStudentRegistry:  [{ type: String, default: [], required: false }], // list of student who register this event

  linkEvents: [{ type: mongoose.Types.ObjectId, default: [], ref: 'Event' }], //chưa đụng tới
  
  location: {type : String, required: true, default: ''}, // location where hold this events
  activitiesPoint: { type: Number, required: true, default: 0 },
  status: { type: String, required: true, default: 'todo' }, // todo, ongoing, finished

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

var Event = mongoose.model('Event', EventSchema);
module.exports = Event;

