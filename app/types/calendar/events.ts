export interface getCalendarEventsParams {
  token: string;
  timeMin: string;
  timeMax: string;
  attendeePersonId: string[];
};

export interface CalendarEvents {
  _embedded: Embedded;
  page:      Page;
}

export interface Embedded {
  events:                     Event[];
  "course-unit-realizations": CourseUnitRealization[];
  "cycle-realizations":       CycleRealization[];
  "lesson-realization-teams": LessonRealizationTeam[];
  "lesson-realizations":      LessonRealization[];
  "event-locations":          EventLocation[];
  durations:                  Duration[];
  "event-rooms":              EventRoom[];
  rooms:                      Room[];
  buildings:                  BuildingElement[];
  "event-teams":              EventTeam[];
  "event-organizers":         EventOrganizer[];
  "event-attendees":          EventAttendee[];
  persons:                    Person[];
}

export interface BuildingElement {
  name:              string;
  nameShort:         string;
  address:           string;
  searchableAddress: string;
  displayOrder:      number;
  _links:            BuildingLinks;
  id:                string;
}

export interface BuildingLinks {
  self: Self;
}

export interface Self {
  href: string;
}

export interface CourseUnitRealization {
  name:        string;
  nameShort:   string;
  prototypeId: string;
  _links:      CourseUnitRealizationLinks;
  id:          string;
}

export interface CourseUnitRealizationLinks {
  self:              Self;
  "planning-period": Self;
}

export interface CycleRealization {
  name:                           string;
  nameShort:                      string;
  code:                           string;
  courseUnitRealizationNameShort: string;
  _links:                         CycleRealizationLinks;
  id:                             string;
}

export interface CycleRealizationLinks {
  self:                      Self;
  "course-unit-realization": Self;
}

export interface Duration {
  eventId:    string;
  value:      number;
  timeUnitId: string;
  minutes:    number;
  _links:     DurationLinks;
}

export interface DurationLinks {
  self:        Self[];
  "time-unit": Self;
}

export interface EventAttendee {
  roleId:           string
  roleName:         string
  roleNamePlural:   string
  roleDisplayOrder: number;
  _links:           EventAttendeeLinks;
  id:               string;
}

export interface EventAttendeeLinks {
  self:   Self;
  event:  Self;
  person: Self;
}

export interface EventLocation {
  eventId:        string;
  customLocation: null | string;
  _links:         EventLocationLinks;
}

export interface EventLocationLinks {
  self:           Self[];
  "event-rooms"?: Self;
}

export interface EventOrganizer {
  eventId: string;
  _links:  EventOrganizerLinks;
}

export interface EventOrganizerLinks {
  self:               Self;
  event:              Self;
  "event-attendees"?: Self;
}

export interface EventRoom {
  _links: EventRoomLinks;
  id:     string;
}

export interface EventRoomLinks {
  self:  Self;
  event: Self;
  room:  Self;
}

export interface EventTeam {
  eventId: string;
  size:    number;
  _links:  EventTeamLinks;
}

export interface EventTeamLinks {
  self:  Self;
  event: Self;
}

export interface Event {
  name:                      string;
  nameShort:                 string;
  description:               null;
  typeId:                    string;
  formatId:                  string;
  start:                     string;
  end:                       string;
  startsAtLocal:             string;
  endsAtLocal:               string;
  startsAt:                  string;
  endsAt:                    string;
  holdingStatus:             HoldingStatus;
  repeatedLessonRealization: null;
  userRoleIds:               string[];
  lessonTemplateId:          string;
  __version:                 number;
  _links:                    { [key: string]: Self };
  id:                        string;
}

export interface HoldingStatus {
  id:                  string;
  name:                string;
  audModifiedAt:       null;
  audModifiedBy:       null;
  audModifiedBySystem: null;
}

export interface LessonRealizationTeam {
  name:               string;
  cycleRealizationId: string;
  _links:             BuildingLinks;
  id:                 string;
}

export interface LessonRealization {
  name:        string;
  nameShort:   string;
  prototypeId: string;
  ordinal:     number;
  _links:      BuildingLinks;
  id:          string;
}

export interface Person {
  lastName:   string;
  firstName:  string;
  middleName: string;
  fullName:   string;
  _links:     BuildingLinks;
  id:         string;
}

export interface Room {
  name:               string;
  nameShort:          string;
  building:           RoomBuilding;
  projectorAvailable: boolean;
  totalCapacity:      number;
  workingCapacity:    number;
  deletedAtUtc:       null;
  _links:             RoomLinks;
  id:                 string;
}

export interface RoomLinks {
  self:     Self;
  type:     Self;
  building: Self;
}

export interface RoomBuilding {
  id:           string;
  name:         string;
  nameShort:    string;
  address:      string;
  displayOrder: number;
}

export interface Page {
  size:          number;
  totalElements: number;
  totalPages:    number;
  number:        number;
}
