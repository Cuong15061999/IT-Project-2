const historyStudent = require('../model/historyStudentModel')
const userServices = require('../services/userServices')

class historyStudentServices {
    async addHistoryStudent(svList, event) {
        const results = [];
        for (const email of svList) {
            try {
                const userId = await userServices.getUserIdByEmail(email);
                const result = await historyStudent.updateOne(
                    { emailUser: email, eventId: event.id },
                    {
                        $set: {
                            userId: userId,
                            statusEvent: event.status
                        }
                    },
                    { upsert: true }
                );
                results.push(result);
            } catch (error) {
                console.error(`Error processing MSSV ${mssv}:`, error);
            }
        }
        return results;
    }
}

module.exports = new historyStudentServices();