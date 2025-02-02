import {fetch} from "expo/fetch";
import {isLaterHHMM} from "@/app/functions/UtilityFunctions";

type getCalendarEventsParams = {
  token: string
  timeMin: string,
  timeMax: string,
  attendeePersonId: string[]
}

// @ts-ignore
export async function getCalendarEvents({token, timeMin, timeMax, attendeePersonId}: getCalendarEventsParams) {
  const preprocessing = (response: object) => { // absolute retardation of a function, at least it works.
    const final: { title: string; data: {}[]; }[] = []

    if (!Object.hasOwn(response, 'events')) {
      return [];
    }

    const eventRooms = response['event-rooms'];
    for (const eventRoom of eventRooms) {
      for (room of response['rooms']) {
        if (room._links.self.href == eventRoom._links.room.href) {
          eventRoom.customLocation = room.name;
          break;
        }
      }
    }

    const eventLocations = response['event-locations'];
    eventLocations.map((eventLocation: any) => {
      if (eventLocation.customLocation) {
        return;
      }

      for (const eventRoom of eventRooms) {
        if (eventRoom._links.self.href == eventLocation._links['event-rooms'].href) {
          eventLocation.customLocation = eventRoom.customLocation;
          break;
        }
      }
    });

    const attendees = response['event-attendees'];
    for (const attendee of attendees) {
      for (const person of response.persons) {
        if (person._links.self.href == attendee._links.person.href) {
          attendee.name = person.fullName;
          break;
        }
      }
    }

    const eventOrganizers = response['event-organizers'];
    eventOrganizers.map((eventOrganizer: any) => {
      for (const attendee of attendees) {
        if (!eventOrganizer._links['event-attendees']) {
          return;
        }

        if (eventOrganizer._links['event-attendees'].href == attendee._links.self.href) {
          eventOrganizer.name = attendee.name;
          break;
        }
      }
    });

    final.push({title: response.events[0].startsAtLocal.split('T')[0], data: []})

    response.events.forEach((event, index) => {
      const dateString = <string>event.startsAtLocal.split('T')[0];

      // @ts-ignore
      const eventLocation = response['event-locations'][index].customLocation;
      const organizer = response['event-organizers'][index].name;

      const readyObj = {
        title: event.name,
        location: eventLocation,
        organizer: organizer,
        timeStart: event.startsAtLocal.split('T')[1],
        timeEnd: event.endsAtLocal.split('T')[1],
      };


      let flagFound = false;
      for (const day of final) {
        if (day.title == dateString) {
          let flagLater = true;
          for (let i = 0; i < day.data.length; i++) {
            // @ts-ignore no its not undefined??????
            if (isLaterHHMM(day.data.at(i).timeEnd, readyObj.timeEnd)) {
              day.data.splice(i, 0, readyObj)
              flagLater = false;
              break;
            }
          }

          if (flagLater) {
            day.data.push(readyObj)
          }

          flagFound = true;
          break;
        }
      }


      if (!flagFound) {
        final.unshift({title: dateString, data: [readyObj]})
      }

    });

    final.sort(function(a, b) {
      return new Date(a.title) - new Date(b.title);
    });
    return final;
  }


  // TODO: alert when token expired
  return await fetch('https://utmn.modeus.org/schedule-calendar-v2/api/calendar/events/search', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }, method: 'POST', body: JSON.stringify({timeMin, timeMax, attendeePersonId, size: 250})
  }).then(res => res.json()).then(res => res._embedded).then(res => preprocessing(res))
}
