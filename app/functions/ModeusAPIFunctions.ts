import {fetch} from "expo/fetch";
import {isLaterHHMM} from "@/app/functions/UtilityFunctions";
import {ToastAndroid} from "react-native";
import {Embedded, getCalendarEventsParams} from "@/app/types/calendar/events";
import {postPrimaryRequestBodyInterface} from "@/app/types/profile/Primary";
import {secondaryRequestBodyInterface} from "@/app/types/profile/Secondary";
import { AttendanceDataInterface } from "../types/profile/Attendance";

const showUnauthorizedToast = () => {
  ToastAndroid.show("Проблемы с авторизацией, пожалуйста перезайдите в приложение.", ToastAndroid.SHORT);
}

const showUnknownErrorToast = () => {
  ToastAndroid.show("Неизвестная ошибка.", ToastAndroid.SHORT);
}

// @ts-ignore
export async function getCalendarEvents({token, timeMin, timeMax, attendeePersonId}: getCalendarEventsParams) {
  const preprocessing = (response: Embedded) => { // absolute retardation of a function, at least it works.
    const final: { title: string; data: {}[]; }[] = []

    if (!Object.hasOwn(response, 'events')) {
      return [];
    }

    let unitNames: {} = {};
    response['course-unit-realizations'].map((item) => {
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

    const date = new Date(response.events[0].startsAtLocal);
    const endDate = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59));

    let tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
    while (tempDate <= endDate) {
      final.push({title: tempDate.toISOString().split('T')[0], data: []});
      tempDate.setDate(tempDate.getDate() + 1);
    }
    // final.push({title: response.events[0].startsAtLocal.split('T')[0], data: []});

    response.events.forEach((event, index) => {
      const dateString = <string>event.startsAtLocal.split('T')[0];
      const dateObj = new Date(dateString);

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

      let flagLater = true;
      for (let i = 0; i < final[dateObj.getDate() - 1].data.length; i++) {
        // @ts-ignore no its not undefined??????
        if (isLaterHHMM(final[dateObj.getDate() - 1].data.at(i).timeEnd, readyObj.timeEnd)) {
          final[dateObj.getDate() - 1].data.splice(i, 0, readyObj)
          flagLater = false;
          break;
        }
      }

      if (flagLater) {
        final[dateObj.getDate() - 1].data.push(readyObj)
      }
    });
    return final;
  }

  return await fetch('https://utmn.modeus.org/schedule-calendar-v2/api/calendar/events/search', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }, method: 'POST', body: JSON.stringify({timeMin, timeMax, attendeePersonId, size: 250})
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }

    if (res.status == 401) {
      showUnauthorizedToast();
    }

    showUnknownErrorToast();
    throw new Error('something went wrong while getting primary results')
  }).then(res => res._embedded).then(res => preprocessing(res));
}

export async function getPrimaryResults(token: string) {
  return await fetch('https://utmn.modeus.org/students-app/api/pages/student-card/my/primary', {
    headers: {'Authorization': `Bearer ${token}`},
    method: 'GET'
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }

    if (res.status == 401) {
      showUnauthorizedToast();
    }

    showUnknownErrorToast();
    throw new Error('something went wrong while getting primary results')
  })
}

export async function getPostPrimaryResults(token: string, {
  personId,
  academicPeriodStartDate,
  academicPeriodEndDate,
  curriculumFlowId,
  curriculumPlanId,
  withMidcheckModulesIncluded,
  studentId,
  aprId
}: postPrimaryRequestBodyInterface) {
  return await fetch('https://utmn.modeus.org/students-app/api/pages/student-card/my/academic-period-results-table/primary', {
    headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': '*/*'},
    method: 'POST',
    body: JSON.stringify({
      personId,
      withMidcheckModulesIncluded,
      aprId,
      academicPeriodStartDate,
      academicPeriodEndDate,
      studentId,
      curriculumFlowId,
      curriculumPlanId
    })
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }

    if (res.status == 401) {
      showUnauthorizedToast();
    }

    showUnknownErrorToast();
    throw new Error('something went wrong while getting post primaryData request')
  });
}

export async function postSecondaryResults(token: string, {
  courseUnitRealizationId,
  academicCourseId,
  lessonId,
  lessonRealizationTemplateId,
  personId,
  aprId,
  academicPeriodStartDate,
  academicPeriodEndDate,
  studentId
}: secondaryRequestBodyInterface) {
  return await fetch('https://utmn.modeus.org/students-app/api/pages/student-card/my/academic-period-results-table/secondary', {
    headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
    method: 'POST',
    body: JSON.stringify({
      courseUnitRealizationId,
      academicCourseId,
      lessonId,
      lessonRealizationTemplateId,
      personId,
      aprId,
      academicPeriodStartDate,
      academicPeriodEndDate,
      studentId
    })
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }

    if (res.status == 401) {
      showUnauthorizedToast();
    }

    showUnknownErrorToast();
    throw new Error('something went wrong while getting post secondaryData request')
  })
}

export async function getAttendanceData(token: string, studentId: string) {

  function mandatorySort(attendanceRates: AttendanceDataInterface[]) { // API was developed by a complete retard, so it IS MANDATORY to sort these;
    return attendanceRates.sort((a, b) => b.academicPeriodRealization.number - a.academicPeriodRealization.number)
  }


  return await fetch('https://utmn.modeus.org/students-app/api/pages/student-card/my/attendance-rates', {
    headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
    method: 'POST',
    body: JSON.stringify({
      studentId
    })
  }).then((res) => {
    if (res.ok) {
      return res.json().then(data => mandatorySort(data));
    }

    if (res.status == 401) {
      showUnauthorizedToast();
    }

    showUnknownErrorToast();
    throw new Error('something went wrong while getting attendance rates');
  });
}