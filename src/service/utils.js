import moment from "moment-timezone";

export const convertExcelDateToJSDate = (excelDate) => {
    const baseDate = new Date(1899, 11, 30);

    const date = new Date(baseDate.getTime() + (excelDate * 24 * 60 * 60 * 1000));

    const day = date.getDate();
    const month = date.getMonth() + 1; // Monate sind 0-basiert, daher +1
    const year = date.getFullYear();

    const formattedDate = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
    return formattedDate;
};

export function convertExcelTimeToReadableTime(excelTime) {
    const fractionalDay = excelTime - Math.floor(excelTime) + 0.0000001;
    let totalSeconds = Math.floor(86400 * fractionalDay); // Ändern Sie 'const' in 'let'
    const seconds = totalSeconds % 60;
    totalSeconds -= seconds; // Hier wird der Wert geändert, daher ist 'let' erforderlich
    const hours = Math.floor(totalSeconds / (60 * 60));
    const minutes = Math.floor(totalSeconds / 60) % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function convertDurationToUnixTimestamp(duration) {
    const [hours, minutes] = duration.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const totalSeconds = totalMinutes * 60;
    return totalSeconds;
}

export function excelDateToUnixTime(excelDate) {
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(excelDate)) {
        throw new Error("Invalid date format. Please use dd.mm.yyyy format.");
    }

    const dateComponents = excelDate.split('.');

    const day = parseInt(dateComponents[0], 10);
    const month = parseInt(dateComponents[1], 10);
    const year = parseInt(dateComponents[2], 10);

    const jsDate = new Date(year, month - 1, day);

    const unixTimeInMilliseconds = jsDate.getTime();

    return unixTimeInMilliseconds;
}

export
function getUnixTimestamp(date, time) {
    const dateTimeString = `${date} ${time}`;
    const format = "DD.MM.YYYY HH:mm:ss";
    const dateTime = moment.tz(dateTimeString, format, "Europe/Berlin");
    return dateTime.unix()*1000;
}

