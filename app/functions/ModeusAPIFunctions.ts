import {fetch} from "expo/fetch";
import {isLaterHHMM} from "@/app/functions/UtilityFunctions";

type getCalendarEventsParams = {
  token: string
  timeMin: string,
  timeMax: string,
  attendeePersonId: string[]
};

export const eventTypes = {
  "LECT": {
    "name": "Лекционное занятие",
    "color": "#FFDDC1"  // Light orange
  },
  "SEMI": {
    "name": "Практическое занятие",
    "color": "#C1FFD7"  // Light green
  },
  "LAB": {
    "name": "Лабораторное занятие",
    "color": "#C1D7FF"  // Light blue
  },
  "CUR_CHECK": {
    "name": "Текущий контроль",
    "color": "#FFC1E3"  // Light pink
  },
  "CONS": {
    "name": "Консультация",
    "color": "#E3C1FF"  // Light purple
  },
  "EVENT_OTHER": {
    "name": "Прочее",
    "color": "#D3D3D3"  // Light gray
  },
  "SELF": {
    "name": "Самостоятельная работа",
    "color": "#FFFFC1"  // Light yellow
  },
  "FINAL_CHECK": {
    "name": "Итоговая аттестация",
    "color": "#FFC1C1"  // Light red
  },
  "MID_CHECK": {
    "name": "Аттестация",
    "color": "#C1FFFF"  // Light cyan
  }
}

// @ts-ignore
export async function getCalendarEvents({token, timeMin, timeMax, attendeePersonId}: getCalendarEventsParams) {
  const preprocessing = (response: object) => { // absolute retardation of a function, at least it works.
    const final: { title: string; data: {}[]; }[] = []

    if (!Object.hasOwn(response, 'events')) {
      return [];
    }

    let unitNames = {};
    response['course-unit-realizations'].map((item: object) => {
      unitNames[item._links.self.href] = item.nameShort
    })

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
      const eventAttendeesLinks = eventOrganizer._links['event-attendees'];
      if (!eventAttendeesLinks) {
        return; // Skip if there are no event-attendees links
      }

      // Extract hrefs whether it's an array or a single object
      const hrefs = Array.isArray(eventAttendeesLinks)
        ? eventAttendeesLinks.map((link: any) => link.href)
        : [eventAttendeesLinks.href];

      eventOrganizer.name = []

      // Check each attendee for a matching href
      for (const attendee of attendees) {
        // if (hrefs.includes(attendee._links.self.href)) {
        //   eventOrganizer.name = attendee.name;
        //   break; // Stop after the first match
        // }
        for (const href of hrefs) {
          if (href == attendee._links.self.href) {
            eventOrganizer.name.push(attendee.name);
            if (eventOrganizer.name.length == hrefs.length) {
              break;
            }
          }
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
        id: event.id,
        title: event.name,
        unitShort: unitNames[event._links['course-unit-realization'].href],
        location: eventLocation,
        organizer: organizer,
        type: event.typeId,
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

    final.sort(function (a, b) {
      // @ts-ignore schizo error, it still could be subtracted.
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
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }
    throw new Error('something went wrong')
  }).then(res => res._embedded).then(res => preprocessing(res))
}
