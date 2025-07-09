import moment from 'moment';

const timeZone = new Date().getTimezoneOffset();
export const calculateTimeAgo = (date: string) => {
    moment.locale('vi');

    const currentTime = moment();
    const inputTime = moment(date);

    return inputTime.from(currentTime);
};

export const convertTimeZoneToDefault = (time: any) => {
    if (time) {
        return moment(time).add(timeZone, "minutes").format("YYYY-MM-DD HH:mm:ss");
    } else {
        return "";
    }
};

export const convertDefaultToTimeZone = (time: any) => {
    return moment(time).add(-timeZone, "minutes").format("YYYY-MM-DD HH:mm:ss");
};
