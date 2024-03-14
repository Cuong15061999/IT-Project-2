const nodemailer = require("nodemailer");
const moment = require('moment');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "phamvqcuong99@gmail.com",
        pass: "isgjfkrctmzhpiss",
    },
});

const newEventContent = (eventName, host, location, startTime, endTime) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px">
        <h2 style="color: #333;">Dear Teachers.</h2>
        <p>You have been invited to participate in the Event: ${eventName}.</p>
        <p><strong>Hosted by:</strong> ${host}.</p>
        <p><strong>Location:</strong> ${location}.</p>
        <p><strong>Time:</strong> ${moment(startTime).format('DD-MM-YYYY h:mm a')} to ${moment(endTime).format('DD-MM-YYYY h:mm a')}.</p>
        <p>Please take some time and join with us. We are delighted with your apperance in the Event.</p>
        <p>Sincerely Best Regards.</p>
        <p><strong>Faculty IT.</strong></p>
    </div>
    `
}

const editEventContent = (eventName, host, location, startTime, endTime) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px">
        <h2 style="color: #333;">Dear Teachers and Students.</h2>
        <p>Your Event: ${eventName} which you have been invited to have some change please notice.</p>
        <p><strong>Hosted by:</strong> ${host}.</p>
        <p><strong>Location:</strong> ${location}.</p>
        <p><strong>Time:</strong> ${moment(startTime).format('DD-MM-YYYY h:mm a')} to ${moment(endTime).format('DD-MM-YYYY h:mm a')}.</p>
        <p>We are delighted with your apperance in the Event.</p>
        <p>Sincerely Best Regards.</p>
        <p><strong>Faculty IT.</strong></p>
    </div>
    `
}

class sendEmailService {

    async sendNewEventEmail (Event) {
        const hostEmail = Event.host.email;
        const teacherEmailList = Event.participatingTeachers.map(teacher => teacher.email);
        const listEmail = [hostEmail, ...teacherEmailList].join(', ');

        const subject = `Event: ${Event.name} invited mail`;

        const info = await transporter.sendMail({
            from: 'phamvqcuong99@gmail.com', // sender address
            to: listEmail, // list of receivers
            subject: subject? subject : 'Event notification email', // Subject line
            text: "Event invited email", // plain text body
            html: newEventContent(Event.name, Event.host.name, Event.location, Event.startAt, Event.endAt),
        })
    }

    async sendEditEventEmail (Event) {
        const hostEmail = Event.host.email;
        const teacherEmailList = Event.participatingTeachers.map(teacher => teacher.email);
        const listEmail = [hostEmail, ...teacherEmailList, ...Event.listStudentRegistry].join(', ');

        const subject = `Event: ${Event.name} CHANGED notification!!!`;

        const info = await transporter.sendMail({
            from: 'phamvqcuong99@gmail.com', // sender address
            to: listEmail, // list of receivers
            subject: subject? subject : 'Event notification email', // Subject line
            text: "Event notification email when changes", // plain text body
            html: editEventContent(Event.name, Event.host.name, Event.location, Event.startAt, Event.endAt),
        })
    } 
}
module.exports = new sendEmailService();
