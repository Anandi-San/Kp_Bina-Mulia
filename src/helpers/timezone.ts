import moment from 'moment-timezone';

export const convertToMakassarTime = (date: Date): Date => {
  return moment(date).tz('Asia/Makassar').toDate();
}