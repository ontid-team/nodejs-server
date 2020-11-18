import { format, addMinutes } from 'date-fns';
import { appConfig } from '../config/AppConfig';

const serverTimeZoneOffset = new Date().getTimezoneOffset();

export function getDateWithFormat(date, timeZone) {
  const utcOffset = timeZone >= 0 ? '+' : '-';
  const absTimeZone = Math.abs(timeZone);
  const utcOffsetHours = `${Math.floor(absTimeZone / 60)}`.padStart(2, '0');
  const utcOffsetMinutes = `${absTimeZone % 60}`.padStart(2, '0');

  return `${format(
    addMinutes(date, timeZone + serverTimeZoneOffset),
    appConfig.formatDate
  )} (${utcOffset}${utcOffsetHours}:${utcOffsetMinutes} UTC)`;
}
