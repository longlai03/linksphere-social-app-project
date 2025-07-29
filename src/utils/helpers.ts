import type { MediaItem, AttachtmentItem } from '@/context/interface';
import moment from 'moment';

const timeZone = new Date().getTimezoneOffset();

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

export const convertMediaToAttachment = (media: MediaItem[]): AttachtmentItem[] => {
    return media.map(item => ({
        position: item.position,
        tagged_user: item.tagged_user || undefined,
        base64: item.attachment?.file_url ? `http://localhost:8000/${item.attachment.file_url}` : undefined
    }));
};

export const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const localTime = convertDefaultToTimeZone(dateString);
    const date = new Date(localTime);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
        return 'Hôm qua';
    } else {
        return date.toLocaleDateString('vi-VN');
    }
};

export const formatMessageTime = (dateString: string) => {
    if (!dateString) return "";
    const localTime = convertDefaultToTimeZone(dateString);
    const date = new Date(localTime);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 1) {
        return "Vừa xong";
    } else if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)} phút trước`;
    } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
        return date.toLocaleDateString('vi-VN');
    }
};
