import { AcademicPeriodRealization } from "./Primary"

export interface AttendanceDataInterface {
    id: string
    academicPeriodRealization: AcademicPeriodRealization
    studentId: string
    personId: any
    presentRate: number
    absentRate: number
    undefinedRate: number
  }