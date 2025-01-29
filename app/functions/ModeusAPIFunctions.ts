import {fetch} from "expo/fetch";

type getCalendarEventsParams = {
  token: string
  timeMin: string,
  timeMax: string,
  attendeePersonIDs: string[]
}

export async function getCalendarEvents({token, timeMin, timeMax, attendeePersonIDs}: getCalendarEventsParams) {
  console.log('fetching', timeMin, timeMax, attendeePersonIDs);
  console.log(JSON.stringify({timeMin, timeMax, 'attendeePersonId': attendeePersonIDs}));
  const res = fetch('https://utmn.modeus.org/schedule-calendar-v2/api/calendar/events/search', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }, method: 'POST', body: JSON.stringify({timeMin, timeMax, attendeePersonIDs})
  }).then(res => res.json()).then(res => res._embedded).then(console.log); // TODO: alert when token expired
}
