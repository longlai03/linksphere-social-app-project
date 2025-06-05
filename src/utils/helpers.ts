import moment from 'moment';

export const calculateTimeAgo = (date: string) => {
    moment.locale('vi');

    const currentTime = moment();
    const inputTime = moment(date);

    return inputTime.from(currentTime);
};
