import dateFormat from './dateFormat'
import moment from 'moment'

export const getWeekRange= (week = 0, content) => {
  let currentStart = moment().add(week, 'weeks').startOf('isoWeek');
  let endWeek = moment().startOf('isoWeek')
  let weeks = []
  while (currentStart.isBefore(endWeek, '[]')) {
    console.log(currentStart.format(dateFormat))
    weeks.push({
      date: currentStart.format(dateFormat),
      ...content
    })
    currentStart = currentStart.add(1, 'week')
  }
  return weeks
}