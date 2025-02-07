export interface secondaryRequestBodyInterface {
  courseUnitRealizationId: string[]
  academicCourseId: string[]
  lessonId: string[]
  lessonRealizationTemplateId: string[]
  personId: string
  aprId: string
  academicPeriodStartDate: string
  academicPeriodEndDate: string
  studentId: string
}

export interface secondaryDataInterface {
  errors: any[]
  courseUnitRealizationAttendanceRates: CourseUnitRealizationAttendanceRate[]
  eventPersonAttendances: EventPersonAttendance[]
  academicCourseControlObjects: any[]
  courseUnitRealizationControlObjects: CourseUnitRealizationControlObject[]
  lessonControlObjects: LessonControlObject[]
}

export interface CourseUnitRealizationAttendanceRate {
  courseUnitRealizationId: string
  presentRate: number
  absentRate: number
  undefinedRate: number
}

export interface EventPersonAttendance {
  resultId?: string
  eventId: string
  lessonId: string
  createdTs: string
  createdBy: string
  updatedTs: string
  updatedBy: string
}

export interface CourseUnitRealizationControlObject {
  controlObjectId: string
  typeName: string
  typeShortName: any
  typeCode: string
  orderIndex: number
  courseUnitRealizationId: string
  mainGradingScaleCode: string
  resultCurrent?: ResultCurrent
  resultFinal: any
}

export interface ResultCurrent {
  id: string
  controlObjectId: string
  resultValue: string
  createdTs: string
  createdBy: string
  updatedTs: string
  updatedBy?: string
}

export interface LessonControlObject {
  controlObjectId: string
  typeName: string
  typeShortName: any
  typeCode: string
  orderIndex: number
  lessonId: string
  mainGradingScaleCode: string
  result?: Result
  resultRequired: boolean
}

export interface Result {
  id: string
  controlObjectId: string
  resultValue: string
  createdTs: string
  createdBy: string
  updatedTs: string
  updatedBy: any
}
