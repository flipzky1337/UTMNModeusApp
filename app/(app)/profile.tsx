import {useEffect, useState} from "react";
import {useSession} from "@/app/providers/authctx";
import {getPostPrimaryResults, getPrimaryResults, postSecondaryResults} from "@/app/functions/ModeusAPIFunctions";
import {View, Text} from "react-native";
import {objectIsEmpty, toRussianDateShort} from "@/app/functions/UtilityFunctions";
import {FontAwesome} from "@expo/vector-icons";
import {AcademicPeriodRealization, postPrimaryDataInterface, primaryDataInterface} from "@/app/types/profile/Primary";
import {secondaryDataInterface} from "@/app/types/profile/Secondary";

function Profile() {
  const {session} = useSession();
  const [primaryData, setPrimaryData] = useState({} as primaryDataInterface);
  const [postPrimaryData, setPostPrimaryData] = useState({} as postPrimaryDataInterface);
  const [secondaryData, setSecondaryData] = useState({} as secondaryDataInterface);

  if (session) {
    useEffect(() => { // preloading with nesting bracket hell
      getPrimaryResults(session).then((res) => {
        setPrimaryData(res);
        if (!objectIsEmpty(primaryData)) { // idk how to handle this otherwise
          const lastApr = primaryData.academicPeriodRealizations.at(-1) as AcademicPeriodRealization;
          getPostPrimaryResults(session, {
            personId: primaryData.personId,
            studentId: primaryData.id,
            aprId: lastApr.id,
            curriculumPlanId: lastApr.curriculumPlanId,
            curriculumFlowId: lastApr.curriculumFlowId,
            withMidcheckModulesIncluded: false,
            academicPeriodStartDate: lastApr.startDate,
            academicPeriodEndDate: lastApr.endDate
          }).then(res => {
            setPostPrimaryData(res);
            if (!objectIsEmpty(postPrimaryData)) { // same
              const lessonIdArray: string[] = []
              const academicCourseArray: string[] = []
              const courseUnitRealizationIdArray: string[] = []
              const lessonRealizationTemplateIdArray: string[] = []

              postPrimaryData.academicCourses.map((acadCourse) => {
                academicCourseArray.push(acadCourse.id);
                courseUnitRealizationIdArray.push(...acadCourse.courseUnitRealizationIds)
              })

              postPrimaryData.courseUnitRealizations.map((realization) => {
                courseUnitRealizationIdArray.push(realization.id);

                const tempLessonIdArray: string[] = [];
                const tempLessonRealizationTemplateIdArray: string[] = [];

                realization.lessons.map((lesson) => {
                  tempLessonIdArray.push(lesson.id);
                  tempLessonRealizationTemplateIdArray.push(lesson.lessonRealizationTemplateId);
                });

                lessonIdArray.push(...tempLessonIdArray);
                lessonRealizationTemplateIdArray.push(...tempLessonRealizationTemplateIdArray);
              })


              postSecondaryResults(session, {
                personId: primaryData.personId,
                studentId: primaryData.id,
                aprId: lastApr.id,
                academicPeriodStartDate: lastApr.startDate,
                academicPeriodEndDate: lastApr.endDate,
                lessonId: lessonIdArray,
                academicCourseId: academicCourseArray,
                courseUnitRealizationId: courseUnitRealizationIdArray,
                lessonRealizationTemplateId: lessonRealizationTemplateIdArray
              }).then((res) => {console.log(res); setSecondaryData(res)}) // TODO: check why empty
            }
          });
        }
      });
    }, []);
  }

  if (!objectIsEmpty(primaryData)) {
    return (
      <View className={'flex px-2'}>
        <View className={'my-2 py-1 px-2 rounded-t-md rounded-b-md flex bg-white gap-1'}>
          <View className={'flex-row gap-2'} style={{alignItems: 'center'}}><FontAwesome name={'id-card'}/><Text
            className={'font-bold'}>Персональные данные</Text></View>
          <Text className={'font-bold'}>ФИО: </Text><Text>{primaryData.fullName}</Text>
          <Text className={'font-bold'}>Специальность: </Text><Text numberOfLines={3}
                                                                    style={{flexWrap: 'wrap'}}>{primaryData.specialtyCode} {primaryData.specialtyName}: {primaryData.profile.name}</Text>
          <Text className={'font-bold'}>Дата начала
            обучения: </Text><Text>{toRussianDateShort(primaryData.learningStartDate)}</Text>
          <Text className={'font-bold'}>Дата окончания
            обучения: </Text><Text>{primaryData.learningEndDate ? toRussianDateShort(primaryData.learningEndDate) : 'Неизвестно'}</Text>
        </View>
      </View>
    )
  }

  return (
    <View>

    </View>
  )

}

export default Profile;