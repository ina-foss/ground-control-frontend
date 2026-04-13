/**
 * Utility functions for time formatting
 */

export function formatTime(ms: number, majorLabel = false) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (majorLabel) {
        return `${pad(hours)}:${pad(minutes)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
}

export function formatDate(date:Date){
  return (date.getMilliseconds() / 1000) + date.getSeconds() + (date.getMinutes() * 60) + (date.getUTCHours() * 3600)
}

export function formatTimeDetailed(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
}

function pad(num, size = 2) {
    return num.toString().padStart(size, '0');
}
