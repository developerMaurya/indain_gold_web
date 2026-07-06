import { UTCDate } from 'utc-date';
export class DateTimeService {
    static generateOrderNo(CustomerId) {
        const timestamp = Date.now(); // Current timestamp
        const random = Math.floor(Math.random() * 10000); // Random number for uniqueness
        return `${CustomerId}${timestamp}${random}`;
    }

    static getCurrentDateTime() {
        //  const now = new Date();
        const now = new UTCDate();
        now.setMinutes(now.getMinutes() + 330);
        return now;
    }

    static getCurrentDateTimeString(commingdate) {
        let date;
        if (commingdate) {
            date = new Date(commingdate);
        } else {
            date = new Date();
        }
        // Add 330 minutes (5.5 hours) for IST
        date.setMinutes(date.getMinutes() + 330);
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    static getCurrentTimestamp() {
        return this.getCurrentDateTime().getTime();
    }

    static formatDateForSQL(date) {
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }
}