import { useEffect, useState } from "react";
import { useSession } from "@/app/providers/authctx";
import {
  getAttendanceData,
  getPostPrimaryResults,
  getPrimaryResults,
  postSecondaryResults,
} from "@/app/functions/ModeusAPIFunctions";
import { View, Text } from "react-native";
import {
  dateStringToIsoString,
  objectIsEmpty,
  toRussianDateShort,
} from "@/app/functions/UtilityFunctions";
import { FontAwesome } from "@expo/vector-icons";
import {
  AcademicPeriodRealization,
  postPrimaryDataInterface,
  primaryDataInterface,
} from "@/app/types/profile/Primary";
import { AttendanceDataInterface } from "../types/profile/Attendance";
import { secondaryDataInterface } from "@/app/types/profile/Secondary";
import GenericLoader from "../components/GenericLoader";

function Profile() {
  const { session } = useSession();
  const [primaryData, setPrimaryData] = useState({} as primaryDataInterface);
  const [postPrimaryData, setPostPrimaryData] = useState(
    {} as postPrimaryDataInterface
  );
  const [secondaryData, setSecondaryData] = useState(
    {} as secondaryDataInterface
  );
  const [attendanceData, setAttendanceData] = useState(
    [] as AttendanceDataInterface[]
  );

  if (session) {
    useEffect(() => {
      getPrimaryResults(session)
        .then((resPrimaryData: primaryDataInterface) => {
          setPrimaryData(resPrimaryData);
          const lastApr = resPrimaryData.academicPeriodRealizations.at(
            -1
          ) as AcademicPeriodRealization;

          return getPostPrimaryResults(session, {
            personId: resPrimaryData.personId,
            studentId: resPrimaryData.id,
            aprId: lastApr.id,
            curriculumPlanId: lastApr.curriculumPlanId,
            curriculumFlowId: lastApr.curriculumFlowId,
            withMidcheckModulesIncluded: false,
            academicPeriodStartDate: dateStringToIsoString(lastApr.startDate),
            academicPeriodEndDate: dateStringToIsoString(lastApr.endDate),
          });
        })
        .then((resPostPrimary: postPrimaryDataInterface) => {
          setPostPrimaryData(resPostPrimary);
          console.log("here");

          const lastApr = primaryData.academicPeriodRealizations.at(
            -1
          ) as AcademicPeriodRealization;
          const lessonIdArray: string[] = [];
          const academicCourseArray: string[] = [];
          const courseUnitRealizationIdArray: string[] = [];
          const lessonRealizationTemplateIdArray: string[] = [];

          resPostPrimary.academicCourses.map((acadCourse) => {
            academicCourseArray.push(acadCourse.id);
          });

          resPostPrimary.courseUnitRealizations.map((realization) => {
            courseUnitRealizationIdArray.push(realization.id);

            const tempLessonIdArray: string[] = [];
            const tempLessonRealizationTemplateIdArray: string[] = [];

            realization.lessons.map((lesson) => {
              tempLessonIdArray[lesson.orderIndex] = lesson.id;
              tempLessonRealizationTemplateIdArray[lesson.orderIndex] =
                lesson.lessonRealizationTemplateId;
            });

            lessonIdArray.push(...tempLessonIdArray);
            lessonRealizationTemplateIdArray.push(
              ...tempLessonRealizationTemplateIdArray
            );
          });

          postSecondaryResults(session, {
            personId: primaryData.personId,
            studentId: primaryData.id,
            aprId: lastApr.id,
            academicPeriodStartDate: dateStringToIsoString(lastApr.startDate),
            academicPeriodEndDate: dateStringToIsoString(lastApr.endDate),
            lessonId: lessonIdArray,
            academicCourseId: academicCourseArray,
            courseUnitRealizationId: courseUnitRealizationIdArray,
            lessonRealizationTemplateId: lessonRealizationTemplateIdArray,
          }).then((res) => {
            setSecondaryData(res);
            console.log(res);
          });
        });

      getAttendanceData(session, primaryData.id).then((res) =>
        setAttendanceData(res)
      );
    }, []);
  }

  return objectIsEmpty(primaryData) &&
    objectIsEmpty(postPrimaryData) &&
    objectIsEmpty(secondaryData) && objectIsEmpty(attendanceData) ? (
    <GenericLoader />
  ) : (
    <View className={"flex px-2"}>
      <View
        className={
          "my-2 py-1 px-2 rounded-t-md rounded-b-md flex bg-white gap-1"
        }
      >
        <View className={"flex-row gap-2"} style={{ alignItems: "center" }}>
          <FontAwesome name={"id-card"} />
          <Text className={"font-bold"}>Персональные данные</Text>
        </View>
        <Text className={"font-bold"}>ФИО: </Text>
        <Text>{primaryData.fullName}</Text>
        <Text className={"font-bold"}>Специальность: </Text>
        <Text numberOfLines={3} style={{ flexWrap: "wrap" }}>
          {primaryData.specialtyCode} {primaryData.specialtyName}:{" "}
          {primaryData.profile.name}
        </Text>
        <Text className={"font-bold"}>Дата начала обучения: </Text>
        <Text>{toRussianDateShort(primaryData.learningStartDate)}</Text>
        <Text className={"font-bold"}>Дата окончания обучения: </Text>
        <Text>
          {primaryData.learningEndDate
            ? toRussianDateShort(primaryData.learningEndDate)
            : "Неизвестно"}
        </Text>
      </View>

      <View
        className={
          "my-2 py-1 px-2 rounded-t-md rounded-b-md flex bg-white gap-1"
        }
      >
        <Text>{attendanceData.at(0)?.academicPeriodRealization.name.split(',')[0]}</Text>
      </View>
    </View>
  );
}

export default Profile;
