var mongoose = require('mongoose');var EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  host: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }, // the one who create this event
  participatingTeachers: [{ type: mongoose.Types.ObjectId, default: [], ref: 'User' }], // list of teacher who join this event
  participatingStudents: [{ type: mongoose.Types.ObjectId, default: [], ref: 'User' }], // list of student who join this event
  linkEvents: [{ type: mongoose.Types.ObjectId, default: [], ref: 'Event' }], // sub events or sub job for this event
  trainingPoints: { type: Number, required: true, default: 0 }, // diem ren luyen 
  status: { type: String, required: true, default: 'undone' }, // undone, ongoing, finished

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

