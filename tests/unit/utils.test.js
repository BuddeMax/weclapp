import {convertExcelDateToJSDate} from "@/service/utils";


describe('convertExcelDateToJSDate', () => {
    it('should convert Excel date to JS date correctly', () => {
        const excelDate = 45383; // Dies entspricht dem 1. Januar 2021
        const expectedDate = '01.04.2024';

        const result = convertExcelDateToJSDate(excelDate);

        expect(result).toEqual(expectedDate);
    });

    it('should return a string', () => {
        const excelDate = 45383;

        const result = convertExcelDateToJSDate(excelDate);

        expect(typeof result).toBe('string');
    });

    it('should handle leap year correctly', () => {
        const excelDate = 43890; // 29. Februar 2020
        const expectedDate = '29.02.2020';

        const result = convertExcelDateToJSDate(excelDate);

        expect(result).toEqual(expectedDate);
    });

    it('should handle dates in 20th century correctly', () => {
        const excelDate = 21916; // 1. Januar 1960
        const expectedDate = '01.01.1960';

        const result = convertExcelDateToJSDate(excelDate);

        expect(result).toEqual(expectedDate);
    });

    it('should handle negative dates correctly', () => {
        const excelDate = -1; // Ungültiges Datum
        const expectedDate = '29.12.1899';

        const result = convertExcelDateToJSDate(excelDate);

        expect(result).toEqual(expectedDate);
    });
});


import { convertExcelTimeToReadableTime } from '@/service/utils';

describe('convertExcelTimeToReadableTime', () => {
    it('should convert Excel time to readable time correctly', () => {
        const excelTime = 0.5; // Dies entspricht 12:00:00
        const expectedTime = '12:00:00';

        const result = convertExcelTimeToReadableTime(excelTime);

        expect(result).toEqual(expectedTime);
    });

    it('should return a string', () => {
        const excelTime = 0.5;

        const result = convertExcelTimeToReadableTime(excelTime);

        expect(typeof result).toBe('string');
    });

    it('should handle zero time correctly', () => {
        const excelTime = 0; // 00:00:00
        const expectedTime = '00:00:00';

        const result = convertExcelTimeToReadableTime(excelTime);

        expect(result).toEqual(expectedTime);
    });

    it('should handle fractional seconds correctly', () => {
        const excelTime = 0.500001; // knapp nach 12:00:00
        const expectedTime = '12:00:00';

        const result = convertExcelTimeToReadableTime(excelTime);

        expect(result).toEqual(expectedTime);
    });

    it('should handle negative time correctly', () => {
        const excelTime = -0.5; // Ungültige Zeit
        const expectedTime = '12:00:00';

        const result = convertExcelTimeToReadableTime(excelTime);

        expect(result).toEqual(expectedTime);
    });
    it('should handle non-standard times correctly', () => {
        const excelTime = 0.75625; // 18:09:00
        const expectedTime = '18:09:00';

        const result = convertExcelTimeToReadableTime(excelTime);

        expect(result).toEqual(expectedTime);
    });

    it('should handle times greater than one correctly', () => {
        const excelTime = 1.5; // 1 Tag und 12:00:00
        const expectedTime = '12:00:00';

        const result = convertExcelTimeToReadableTime(excelTime);

        expect(result).toEqual(expectedTime);
    });

});


import { convertDurationToUnixTimestamp } from '@/service/utils';

describe('convertDurationToUnixTimestamp', () => {
    it('should convert duration to Unix timestamp correctly', () => {
        const duration = '1:30'; // 1 Stunde und 30 Minuten
        const expectedTimestamp = 5400; // 1 Stunde und 30 Minuten entsprechen 5400 Sekunden

        const result = convertDurationToUnixTimestamp(duration);

        expect(result).toEqual(expectedTimestamp);
    });

    it('should return a number', () => {
        const duration = '1:30';

        const result = convertDurationToUnixTimestamp(duration);

        expect(typeof result).toBe('number');
    });

    it('should handle zero duration correctly', () => {
        const duration = '0:00';
        const expectedTimestamp = 0;

        const result = convertDurationToUnixTimestamp(duration);

        expect(result).toEqual(expectedTimestamp);
    });

    it('should handle duration with only minutes correctly', () => {
        const duration = '0:45'; // 45 Minuten
        const expectedTimestamp = 2700; // 45 Minuten entsprechen 2700 Sekunden

        const result = convertDurationToUnixTimestamp(duration);

        expect(result).toEqual(expectedTimestamp);
    });

    it('should handle invalid duration format correctly', () => {
        const duration = '1:70'; // Ungültiges Format

        const result = convertDurationToUnixTimestamp(duration);

        expect(result).toBeNaN();
    });

    it('should handle duration with only hours correctly', () => {
        const duration = '2:00'; // 2 Stunden
        const expectedTimestamp = 7200; // 2 Stunden entsprechen 7200 Sekunden

        const result = convertDurationToUnixTimestamp(duration);

        expect(result).toEqual(expectedTimestamp);
    });

    it('should handle negative duration correctly', () => {
        const duration = '-1:30'; // Ungültige Dauer

        const result = convertDurationToUnixTimestamp(duration);

        expect(result).toBeNaN();
    });

});


import { excelDateToUnixTime } from '@/service/utils';

describe('excelDateToUnixTime', () => {
    it('should convert Excel date to Unix timestamp correctly', () => {
        const excelDate = '01.04.2024';
        const expectedTimestamp = 1711929600000;

        const result = excelDateToUnixTime(excelDate);

        expect(result).toEqual(expectedTimestamp);
    });

    it('should throw an error for invalid date format', () => {
        const invalidExcelDate = '2024-04-01'; // Ungültiges Format

        expect(() => excelDateToUnixTime(invalidExcelDate)).toThrowError("Invalid date format. Please use dd.mm.yyyy format.");
    });

    it('should return a number', () => {
        const excelDate = '01.04.2024';

        const result = excelDateToUnixTime(excelDate);

        expect(typeof result).toBe('number');
    });

    it('should throw an error for invalid date format with slashes', () => {
        const invalidExcelDate = '01/04/2024'; // Ungültiges Format

        expect(() => excelDateToUnixTime(invalidExcelDate)).toThrowError("Invalid date format. Please use dd.mm.yyyy format.");
    });
});


import { getUnixTimestamp } from '@/service/utils';


describe('getUnixTimestamp', () => {
    it('should convert date and time to Unix timestamp correctly', () => {
        const date = '01.04.2024';
        const time = '12:00:00';
        const expectedTimestamp = 1711965600000;

        const result = getUnixTimestamp(date, time);

        expect(result).toEqual(expectedTimestamp);
    });

    it('should return a number', () => {
        const date = '01.04.2024';
        const time = '00:00:00';

        const result = getUnixTimestamp(date, time);

        expect(typeof result).toBe('number');
    });


    it('should handle invalid time correctly', () => {
        const date = '01.04.2024';
        const time = '25:00:00'; // Ungültige Zeit

        expect(() => getUnixTimestamp(date, time)).toThrowError("Invalid date or time format.");
    });

    it('should handle invalid date and time combination correctly', () => {
        const date = '32.13.2024'; // Ungültiges Datum
        const time = '00:00:00';

        expect(() => getUnixTimestamp(date, time)).toThrowError("Invalid date or time format.");
    });
});
