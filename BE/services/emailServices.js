const nodemailer = require("nodemailer");
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const exceljs = require('exceljs');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "phamvqcuong99@gmail.com",
        pass: "isgjfkrctmzhpiss",
    },
});

const createXLSXFile = async (participateStudent) => {
    try {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Emails');
        const headerRow = ['Stt', 'Email', 'MSSV'];
        worksheet.addRow(headerRow);

        participateStudent.forEach((student, index) => {
            const rowData = [index + 1, student, student.split('@')[0]]
            worksheet.addRow(rowData, index + 2);
        });

        const uploadsFolder = path.join(__dirname, '../uploads')

        const fs = require('fs');
        if (!fs.existsSync(uploadsFolder)) {
            fs.mkdirSync(uploadsFolder);
        }

        const filePath = path.join(uploadsFolder, 'Participate_Student.xlsx');
        await workbook.xlsx.writeFile(filePath);
        console.log('XLSX file created successfully:', filePath);
        return filePath

    } catch (error) {
        console.error('Error creating XLSX file:', error);
    }
}

const createNotAttendFile = async (participatingStudents, listStudentRegistry) => {
    try {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Not Attend');
        const headerRow = ['Stt', 'Email', 'MSSV'];
        worksheet.addRow(headerRow);
        const participatingStudentsSet = new Set(participatingStudents);

        const studentsNotParticipating = listStudentRegistry.filter(student => !participatingStudentsSet.has(student));

        studentsNotParticipating.forEach((student, index) => {
            const rowData = [index + 1, student, student.split('@')[0]]
            worksheet.addRow(rowData, index + 2);
        });

        const uploadsFolder = path.join(__dirname, '../uploads')

        const fs = require('fs');

        if (!fs.existsSync(uploadsFolder)) {
            fs.mkdirSync(uploadsFolder);
        }

        const filePath = path.join(uploadsFolder, 'Not_Attend_Student.xlsx');
        await workbook.xlsx.writeFile(filePath);
        console.log('XLSX Attend file created successfully:', filePath);
        return filePath
    } catch (error) {
        console.error('Error creating XLSX file:', error);
    }
}

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

const finishedEventContent = (eventName, activitiesPoint) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px">
        <h2 style="color: #333;">Dear Host & Teachers</h2>
        <p>Your Event: ${eventName} which you have been participate in have finished Successfully!!!</p>
        <p>Activities Point for this Event is: <strong> ${activitiesPoint} </strong></p>
        <p>We are delighted with your apperance in the Event.</p>
        <p>Sincerely Best Regards.</p>
        <p><strong>Faculty IT.</strong></p>
    </div>
    `
}


class sendEmailService {

    async sendNewEventEmail(Event) {
        const hostEmail = Event.host.email;
        const teacherEmailList = Event.participatingTeachers.map(teacher => teacher.email);
        const listEmail = [hostEmail, ...teacherEmailList].join(', ');

        const subject = `Event: ${Event.name} invited mail`;

        const info = await transporter.sendMail({
            from: 'no-reply@yourdomain.com',
            to: listEmail,
            subject: subject ? subject : 'Event notification email',
            text: "Event invited email",
            html: newEventContent(Event.name, Event.host.name, Event.location, Event.startAt, Event.endAt),
        })
    }

    async sendEditEventEmail(Event) {
        const hostEmail = Event.host.email;
        const teacherEmailList = Event.participatingTeachers.map(teacher => teacher.email);
        const listEmail = [hostEmail, ...teacherEmailList, ...Event.listStudentRegistry].join(', ');

        const subject = `Event: ${Event.name} CHANGED notification!!!`;

        const info = await transporter.sendMail({
            from: 'phamvqcuong99@gmail.com', // sender address
            to: listEmail, // list of receivers
            subject: subject ? subject : 'Event notification email', // Subject line
            text: "Event notification email when changes", // plain text body
            html: editEventContent(Event.name, Event.host.name, Event.location, Event.startAt, Event.endAt),
        })
    }

    async sendFinishedEventEmail(Event) {
        const hostEmail = Event.host.email;
        const teacherEmailList = Event.participatingTeachers.map(teacher => teacher.email);
        const listEmail = [hostEmail, ...teacherEmailList].join(', ');

        const subject = `Congratulation Event: ${Event.name} finished SUCCESSFULLY`;


        const filePath = await createXLSXFile(Event.participatingStudents);
        const fileAttendPath = await createNotAttendFile(Event.participatingStudents, Event.listStudentRegistry);
        const fileContent = fs.readFileSync(filePath);
        const fileContentAttend = fs.readFileSync(fileAttendPath);

        await transporter.sendMail({
            from: 'phamvqcuong99@gmail.com', // sender address
            to: listEmail, // list of receivers
            subject: subject ? subject : 'Event notification email', // Subject line
            text: "Event notification email when event finished", // plain text body
            html: finishedEventContent(Event.name, Event.activitiesPoint),
            attachments: [
                {
                    filename: 'report.xlsx',
                    content: fileContent,
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                {
                    filename: 'Not_Attend_Report.xlsx',
                    content: fileContentAttend,
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            ]
        })
            .then(
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully');
                    }
                }),
                fs.unlink(fileContentAttend, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully');
                    }
                })
            );
    }
}
module.exports = new sendEmailService();
