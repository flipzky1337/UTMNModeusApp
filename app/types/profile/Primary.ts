export interface ContactInformation {
  id: string | null;
  email: string;
  phone: string;
  otherContacts: string | null;
}

export interface Profile {
  name: string;
}

export interface Citizenship {
  code: string;
  name: string;
}

export interface PlanningPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface AcademicPeriodRealization {
  id: string;
  name: string;
  fullName: string;
  curriculumId: string;
  curriculumPlanId: string;
  curriculumFlowId: string;
  startYear: number;
  startDate: string;
  endDate: string;
  number: number;
  yearNumber: number;
  numberInYear: number;
  type: string;
  planningPeriodId: string;
  planningPeriod: PlanningPeriod;
}

export interface CurriculumFlow {
  id: string;
  code: string;
  curriculumPlanId: string;
  learningStartDate: string;
  learningEndDate: string;
  studentId: string;
  studentLearningStartDate: string;
  studentLearningEndDate: string | null;
  specialtyCode: string;
  specialtyName: string;
  profile: Profile;
}

export interface primaryDataInterface {
  id: string;
  personId: string;
  fullName: string;
  surname: string;
  name: string;
  middleName: string;
  birthDate: string;
  contactInformation: ContactInformation;
  learningStartDate: string;
  learningEndDate: string | null;
  learningEndReason: string | null;
  specialtyCode: string;
  specialtyName: string;
  profile: Profile;
  citizenship: Citizenship;
  curriculumFlow: CurriculumFlow;
  academicPeriodRealizations: AcademicPeriodRealization[];
  curriculumFlows: CurriculumFlow[];
  errors: any[];
}

export interface postPrimaryRequestBodyInterface {
  personId: string
  withMidcheckModulesIncluded: boolean
  aprId: string
  academicPeriodStartDate: string
  academicPeriodEndDate: string
  studentId: string
  curriculumFlowId: string
  curriculumPlanId: string
}

export interface postPrimaryDataInterface {
  academicCourses: AcademicCourse[]
  courseUnitRealizations: CourseUnitRealization[]
  gradingScales: GradingScale[]
  errors: any[]
  eventId: string[]
}

export interface AcademicCourse {
  id: string
  name: string
  courseUnitRealizationIds: string[]
}

export interface CourseUnitRealization {
  id: string
  courseUnitId: string
  name: string
  lessons: Lesson[]
  trainingTeams: TrainingTeam[]
  midCheckModule: boolean
  learningPathElementActive: boolean
}

export interface Lesson {
  id: string
  lessonRealizationTemplateId: string
  name: string
  orderIndex: number
  teamName?: string
  lessonType: string
  typeName: string
  eventId?: string
  eventFormat?: string
  eventHoldingStatus?: string
  eventStartsAtLocal?: string
  eventEndsAtLocal?: string
  eventTimeZoneName?: string
  learningPathElementActive: boolean
}

export interface TrainingTeam {
  id: string
  cycleRealizationId: string
}

export interface GradingScale {
  uniqueCode: string
  title: string
  totalDeterminationMethod: string
  scale: Scale
}

export interface Scale {
  from?: string
  to?: string
  step?: string
  "@type": string
}
