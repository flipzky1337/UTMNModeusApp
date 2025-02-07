import {useEffect, useState} from "react";
import {useSession} from "@/app/providers/authctx";
import {getPostPrimaryResults, getPrimaryResults, postSecondaryResults} from "@/app/functions/ModeusAPIFunctions";
import {View, Text} from "react-native";
import {dateStringToIsoString, objectIsEmpty, toRussianDateShort} from "@/app/functions/UtilityFunctions";
import {FontAwesome} from "@expo/vector-icons";
import {AcademicPeriodRealization, postPrimaryDataInterface, primaryDataInterface} from "@/app/types/profile/Primary";
import {secondaryDataInterface} from "@/app/types/profile/Secondary";
import {diff, diffLinesRaw, diffLinesUnified} from "jest-diff";

function Profile() {
  const {session} = useSession();
  const [primaryData, setPrimaryData] = useState({} as primaryDataInterface);
  const [postPrimaryData, setPostPrimaryData] = useState({} as postPrimaryDataInterface);
  const [secondaryData, setSecondaryData] = useState({} as secondaryDataInterface);

  if (session) {
    // useEffect(() => { // preloading with nesting bracket hell
    //   getPrimaryResults(session).then((resPr) => {
    //     setPrimaryData(res);
    //     if (!objectIsEmpty(primaryData)) { // idk how to handle this otherwise
    //       const lastApr = primaryData.academicPeriodRealizations.at(-1) as AcademicPeriodRealization;
    //       getPostPrimaryResults(session, {
    //         personId: primaryData.personId,
    //         studentId: primaryData.id,
    //         aprId: lastApr.id,
    //         curriculumPlanId: lastApr.curriculumPlanId,
    //         curriculumFlowId: lastApr.curriculumFlowId,
    //         withMidcheckModulesIncluded: false,
    //         academicPeriodStartDate: lastApr.startDate,
    //         academicPeriodEndDate: lastApr.endDate
    //       }).then(res => {
    //         setPostPrimaryData(res);
    //         if (!objectIsEmpty(postPrimaryData)) { // same
    //           const lessonIdArray: string[] = []
    //           const academicCourseArray: string[] = []
    //           const courseUnitRealizationIdArray: string[] = []
    //           const lessonRealizationTemplateIdArray: string[] = []
    //
    //           postPrimaryData.academicCourses.map((acadCourse) => {
    //             academicCourseArray.push(acadCourse.id);
    //             courseUnitRealizationIdArray.push(...acadCourse.courseUnitRealizationIds)
    //           })
    //
    //           postPrimaryData.courseUnitRealizations.map((realization) => {
    //             courseUnitRealizationIdArray.push(realization.id);
    //
    //             const tempLessonIdArray: string[] = [];
    //             const tempLessonRealizationTemplateIdArray: string[] = [];
    //
    //             realization.lessons.map((lesson) => {
    //               tempLessonIdArray.push(lesson.id);
    //               tempLessonRealizationTemplateIdArray.push(lesson.lessonRealizationTemplateId);
    //             });
    //
    //             lessonIdArray.push(...tempLessonIdArray);
    //             lessonRealizationTemplateIdArray.push(...tempLessonRealizationTemplateIdArray);
    //           })
    //
    //
    //           postSecondaryResults(session, {
    //             personId: primaryData.personId,
    //             studentId: primaryData.id,
    //             aprId: lastApr.id,
    //             academicPeriodStartDate: lastApr.startDate,
    //             academicPeriodEndDate: lastApr.endDate,
    //             lessonId: lessonIdArray,
    //             academicCourseId: academicCourseArray,
    //             courseUnitRealizationId: courseUnitRealizationIdArray,
    //             lessonRealizationTemplateId: lessonRealizationTemplateIdArray
    //           }).then((res) => {
    //             console.log(res);
    //             setSecondaryData(res)
    //           }) // TODO: check why empty
    //         }
    //       });
    //     }
    //   });
    // }, []);

    useEffect(() => {
      getPrimaryResults(session).then((resPrimaryData: primaryDataInterface) => {
        setPrimaryData(resPrimaryData);
        const lastApr = resPrimaryData.academicPeriodRealizations.at(-1) as AcademicPeriodRealization;

        return getPostPrimaryResults(session, {
          personId: resPrimaryData.personId,
          studentId: resPrimaryData.id,
          aprId: lastApr.id,
          curriculumPlanId: lastApr.curriculumPlanId,
          curriculumFlowId: lastApr.curriculumFlowId,
          withMidcheckModulesIncluded: false,
          academicPeriodStartDate: dateStringToIsoString(lastApr.startDate),
          academicPeriodEndDate: dateStringToIsoString(lastApr.endDate)
        })
      }).then((resPostPrimary: postPrimaryDataInterface) => {
        setPostPrimaryData(resPostPrimary);

        const lastApr = primaryData.academicPeriodRealizations.at(-1) as AcademicPeriodRealization;
        const lessonIdArray: string[] = []
        const academicCourseArray: string[] = []
        const courseUnitRealizationIdArray: string[] = []
        const lessonRealizationTemplateIdArray: string[] = []

        resPostPrimary.academicCourses.map((acadCourse) => {
          academicCourseArray.push(acadCourse.id);
        })

        resPostPrimary.courseUnitRealizations.map((realization) => {
          courseUnitRealizationIdArray.push(realization.id);

          const tempLessonIdArray: string[] = [];
          const tempLessonRealizationTemplateIdArray: string[] = [];

          realization.lessons.map((lesson) => {
            tempLessonIdArray[lesson.orderIndex] = lesson.id;
            tempLessonRealizationTemplateIdArray[lesson.orderIndex] = lesson.lessonRealizationTemplateId;
          });

          lessonIdArray.push(...tempLessonIdArray);
          lessonRealizationTemplateIdArray.push(...tempLessonRealizationTemplateIdArray);
        })

        const asdf = {
          personId: primaryData.personId,
          studentId: primaryData.id,
          aprId: lastApr.id,
          academicPeriodStartDate: dateStringToIsoString(lastApr.startDate),
          academicPeriodEndDate: dateStringToIsoString(lastApr.endDate),
          lessonId: lessonIdArray,
          academicCourseId: academicCourseArray,
          courseUnitRealizationId: courseUnitRealizationIdArray,
          lessonRealizationTemplateId: lessonRealizationTemplateIdArray
        }

        const compare = {
          "courseUnitRealizationId": [
            "2b6d0470-2224-4604-b5a2-aa3eed90305b",
            "6153b349-f9da-4877-99dd-7ec1f6e58942",
            "7b565781-9b9b-4108-9d19-cce86193b767",
            "8256942a-8ffe-4dfa-90da-d0fa83b6ff77",
            "8ec7b8f9-31f9-4f29-b32f-b13dc440dd67",
            "cc112944-d2cc-4107-a77e-b5034ccbe807",
            "f609df9e-754d-4d17-9ffa-765ceffac469"
          ],
          "academicCourseId": [
            "6f968ad1-08f6-4cc3-b9de-fed225851437",
            "0f37bf9d-3a75-449e-9118-96d3f8e24978"
          ],
          "lessonId": [
            "534c8257-8256-439a-8cee-8418026ef1ac",
            "5c9479b6-b314-4bcc-b7ea-9d704ad13d1a",
            "f9294441-1f41-4844-9de9-28331fdf7c7b",
            "6c243c01-ae06-49c4-aa2e-464f5962fedd",
            "da6ace93-b0b5-4162-a686-5c9cced0253b",
            "1fccb456-c8b2-416e-97ff-43c6ccb966dd",
            "a230f6d1-7c8a-450e-818d-6efeeb130f58",
            "fc00a75f-0aba-44db-bb54-cad7efba221e",
            "7b810045-835b-40b0-b4ab-246037af684c",
            "fa4c8494-3669-4c64-b9f6-d32bfc813745",
            "add57dba-19a8-4985-9371-32199c407836",
            "76e460af-d2c4-4d5f-864b-832b09202026",
            "fb77d7e6-2c91-4c3a-9cfa-34ac329fc4b0",
            "7f329809-1586-4308-adf1-54997c247a9d",
            "621d2f65-7356-461d-9933-86028c4b4b03",
            "568d0f19-f90b-4f0c-bd95-a4be69468691",
            "176f4dcf-b0b5-4918-a8c5-e4e786c73873",
            "59b5dde5-edfb-4e78-a915-a8e8fbddc735",
            "a48d7df8-a318-44ee-88c4-4fd53c027989",
            "871d0d60-c494-41ef-96c7-0ca171fbe041",
            "538ba437-29f6-4e1a-a8d9-7114773698c5",
            "c7109da1-6646-4370-8389-507d5a36f063",
            "727f2aed-e1c9-4c32-903b-6c02b574d95e",
            "bee1ee80-29ee-495a-9cb9-da442958d04f",
            "7ed3f2d1-ccfa-462f-8a0b-e5c8490ff188",
            "8901db98-5de4-4e3a-82df-4aed8a5cb6b9",
            "8150f346-d7d7-4fcc-bb71-c9bf15483ff5",
            "c6bcbb54-1b9b-47d8-8252-415f1be8edf5",
            "aa9e45f7-bc38-4a18-98d9-bddf51d85177",
            "a34f93f7-5aba-2d75-1349-cddd00662f19",
            "6b895f8e-1471-8c60-1c1b-da50afc02ba4",
            "0d2b6e5c-7833-42f7-9e4b-c46cbcadfd56",
            "fa62cbea-e269-43bc-acf4-2e10b81cec7d",
            "8a754043-e837-d24b-0df5-c2b35522828f",
            "ea630497-89d9-4505-beaf-f3fe7b91e1db",
            "e05faf4a-32ff-d1ba-314d-7371ceff96d9",
            "6d9c82c2-0a3b-48df-975b-3ce50f3ed4e8",
            "16b65417-31b6-489b-a2ad-091c8665c3aa",
            "0a969b7a-8a53-b8e7-2be3-0ac2ec546a87",
            "68885436-62e7-454e-81a8-fea8b041ba8a",
            "ff23027b-3a83-d1a7-74fc-c4f7c510b67c",
            "51542a53-c396-4e0f-96b3-29d6930a0d76",
            "72360117-459f-4d10-90a7-e5a7e69b1d04",
            "5bf4a76f-3f76-462b-93fc-576472c3f100",
            "979199f7-33f9-3a79-9e1b-7d3df539ecd8",
            "3ad4077d-e088-4c12-a08c-28fcc4724799",
            "2fed363c-670e-38f5-d6cf-c74b44b41ba2",
            "b2dee008-9bce-4a01-8e0f-bc1357eb89f1",
            "42888bab-9979-4b6f-b2d6-9f1699529e1f",
            "7281a1dd-04ca-45c3-a66d-136bcfc0cb4c",
            "75abfa6c-0037-07d4-469a-a2d6628d0109",
            "b5313a87-41a9-43c1-9d68-9b7569913ee9",
            "c6326a5f-51ba-e186-ca63-70604dbf6dfa",
            "007d7151-f843-4646-21a0-88abe947bdfe",
            "4664a92f-a1cc-4644-b0ec-fee284ccabf4",
            "9b5979a6-6282-4f46-a66c-7103f5350b4c",
            "46cba583-72ac-452a-a89d-bfc3277f0095",
            "bdd4d1c0-3d33-4e93-926e-45e34df3e131",
            "7e9f7b1c-ca2d-45ed-9b79-91fb96935ab7",
            "3137a752-c712-4628-b8b0-9b66431fe15e",
            "e94df719-e127-49a6-afa8-d5cccb6da12f",
            "0cb9913d-e21a-43e4-bc52-b07523b987a5",
            "93bc2ee1-837e-4a62-a822-128048f0235e",
            "69f41f2e-fc56-4075-9398-0015cd7720f3",
            "ef357632-9ec2-47f9-a300-8406b9911e80",
            "137d5ba8-71d0-4130-9a6d-c8a8fa2db3ab",
            "60ae675a-e358-45c1-b20d-adf47adb5a36",
            "a08acc07-2594-448a-9128-1e519e81a039",
            "2435f6dc-726f-44ac-bfd2-7380e3584a69",
            "1508aab4-20be-4b45-ac03-f73324f24100",
            "efbccea2-9e46-4f8c-bbe7-1c362462cfab",
            "172268ba-9410-443b-98e0-d655f806efaa",
            "b5cf4bc6-60b9-49c7-bc86-fe2cf486727c",
            "48ab9f68-862c-464b-88ae-22d41faf624c",
            "1cb337e4-3bb6-4991-a28b-4b8b2828b68b",
            "8b50b334-363e-48bb-b929-1ebc7c2df586",
            "efa9a964-8da0-4852-b1e2-90a64887ebdb",
            "db7982d9-d024-4c4c-8484-8b6c3ea6d869",
            "e9fae16e-39fa-4d47-8fef-ba28b29339a8",
            "5823514f-bdea-4014-ae31-c38ee560d821",
            "4df263ac-1b7b-4de6-9d61-d050f20ea024",
            "c9b254af-2076-4096-b5d6-96dc06767357",
            "1a2ff0b4-b92a-4c95-a31b-eb8d580fb370",
            "81278965-b57e-47bf-a031-2a876080a62f",
            "782f70dc-e885-4796-a074-3e03bc02944f",
            "e6599e63-4d0c-43db-b91c-e2fe35919570",
            "e3eefe1c-94fb-4b9b-887b-b7e323f683d3",
            "2ec63a82-47c2-4784-89f4-422ef4c401e3",
            "30996fc6-bf09-44b7-8b94-721445a043ac",
            "19bc67cc-3929-4c22-b071-55010aa7f648",
            "f1bf9594-f6e8-4f75-9ea1-09dbcd776e04",
            "9622c9e5-87ac-419c-b5b1-43f017f7a7fd",
            "9ce1c738-dbb8-40f3-8406-a6d6f435fcf3",
            "32b739f4-450d-4a6a-b353-acd3663b4be1",
            "05ad79e7-94d6-4c06-b732-e20069e4bf8a",
            "29364518-5aee-4242-ba84-0bd9a3a499d5",
            "2b7e558e-a99c-43f2-96e5-80808493a753",
            "e2c61819-1a1d-4b82-a322-0631d7ce46e3",
            "e0a919ee-add3-41dc-9576-fcfc7fdc1024",
            "a97f37e5-11be-4580-8014-9f8f81468e61",
            "b1aed338-806c-4a78-a33b-b5a64282644b",
            "a654d7ae-b576-4906-bd02-56366cfe7e94",
            "624ebff2-e3ac-4720-a7b3-0ebae1489682",
            "4fcc5fb2-29ff-4385-a74c-a091a8908d25",
            "7c32c2a1-b5d1-4c7c-afa7-e483cf59dc8d",
            "119a9e2c-8d1a-4aab-9d54-58108fb1b66a",
            "d0f1f7c2-8e5c-4de6-8ff8-5a376b3749be",
            "bfae547f-48fa-41db-9b58-4bc3b57d61ba",
            "913fc1e8-0cca-45e6-9af0-8199c71b1fb3",
            "f10ea5b6-02e5-4c4f-acee-0d42c1c47b32",
            "2cdae13f-90fb-485e-a0a5-fa98c4c67bca",
            "84c989b7-9268-4917-8f0d-f4d4ab1a6f64",
            "fd6d9ebe-6baf-4945-be7c-5cb42f96242f",
            "aca482ec-bd8e-4431-b21a-fed37cf2f7a0",
            "e24a9db6-c47b-4e6c-8c39-a4affe26e66a",
            "7d9720d7-9ed0-4e11-bc94-93f2274bc3a0",
            "7cca671a-8fab-4976-a2ed-6ddd624bf95a",
            "eca17f93-a181-4511-9021-990d9bfafee4",
            "be5afbcd-db10-43ce-a7e5-45dde4ac7577",
            "89e6dbe9-dce2-41c0-af55-7823abe77474",
            "6c6b9d31-4615-458a-a6ed-0af99b56335e",
            "c89511b7-eeee-443c-8930-67a8748745fb",
            "3a08ba1c-4418-4955-9e77-3945e141f249",
            "2b48d19a-6de9-4ce4-afe9-be9fd2b027f9",
            "3891bc59-c2c7-4772-8365-491802835a32",
            "f03e0b8b-3171-42ba-aee1-b1c1e253fc0f",
            "3748d97e-a06c-4f1d-b23b-06855904813a",
            "c2c33851-cc43-4f19-812c-d05e4b4f96b4",
            "1aa5cef4-faae-49d3-812f-82ec691fa1e9",
            "ca106213-32f1-4789-bb0f-d3424ed29847",
            "75e251e0-82df-4516-87a8-d235f1d99680",
            "16b7ebae-fe6b-4b53-9493-93fc3e175432",
            "e4ce450b-6528-48b8-95a7-6987a24e28bf",
            "43c26450-6f44-4983-a0b4-3e5c8e6ab7cd",
            "11f07af8-f54f-4985-9e33-1d33b8e8b940",
            "5158932e-fcb1-47b1-b54f-437710ce411b",
            "4ce309cf-89c6-4dd5-a7de-a62fc5a52da4",
            "22cf0ff9-f210-2556-5e66-86cfc199dcc5",
            "7d655228-7ef9-4f73-b9b1-2b3f3ae2cea7",
            "a119dd0f-3766-4f2f-a1fe-54b853b05798",
            "e4187e4a-9e75-f659-20a6-ecb712ef38b1",
            "865ca9f9-bd27-416d-9ba7-446a15d3fa7f",
            "32dacada-f879-4c6c-8a99-848c1c1255f6",
            "280c6ead-dc1a-434f-8db3-206246967c0a",
            "1f135508-1a38-4052-870d-2090dee0be05",
            "24abe784-85ad-41e7-ab03-18ae136a492f",
            "86268a80-46c3-43a9-a48e-a6bf80272d95",
            "8e5fd93b-d89d-41b4-9060-853771acfee1",
            "153642c2-043e-4638-a686-c27ea969c951",
            "7b7ed0e9-dfa3-416e-b45f-099d8082bc8e",
            "c5981d0e-c5bf-4178-adc7-fd3e6e3ddffd",
            "72aad415-7b48-4abf-9b35-21086f6b10ae",
            "81fb86ff-6ef2-4e5b-8180-2f31a2b48ee4",
            "b38f0801-d67a-4d45-9538-942a9d0f986e",
            "faa7b3be-3f23-476d-aa24-9394d5b51da8",
            "30111b7d-b806-41f8-b807-3af6e4d6b97c",
            "b9dbdfe8-c1e6-45fc-b2f4-71c0ac6dd787",
            "827bd4c6-d05d-454d-a281-24024dc96402",
            "e4d1b8f2-ddec-43fa-bf8e-b64aaaf5f900",
            "db7fdf7b-2b60-45a3-9dc6-c967473daa1d",
            "e1baafb5-af36-4f4b-8980-14a4eb5630c8",
            "bdc08529-b93b-4295-a63e-fdd45c2a98e3",
            "c48fd8b0-af6d-4c32-b810-ad423b3daae2",
            "a809df13-f6e7-4906-a9d7-a5853bb539c8",
            "ccbbefd3-0a91-42fb-b0f2-6f5e7ee3e5dd",
            "7bf25484-5b99-40e6-b8f9-4ef27d05fb3a",
            "604c08e1-035f-4074-9221-8a39064bb914",
            "6e244d03-20f1-4dea-8271-c13d5272e277",
            "b52d24d0-6721-4942-9380-419522fbd3dd",
            "11ca380b-885e-4ab8-af16-28f0dc6f7d8b",
            "68e09749-f8c6-4db8-b0ec-2942e2229633",
            "1bb5caf5-fdaf-48c8-9f22-b37d86c8b3c1",
            "0c662b30-e4d2-4623-a57f-8fd94e71e081",
            "25c3c4df-f9d2-1971-5267-6ef981ae48a9",
            "f7d130b8-4ba0-4f49-85bb-e474c213dc55",
            "1b134fe4-7853-436b-a934-bc64a53e6fc7",
            "da8b14e9-8923-4f56-9a10-15298524dadc"
          ],
          "lessonRealizationTemplateId": [
            "6f091752-62a6-46d0-b95e-68d7ec2a057c",
            "2d6075ac-8671-44c9-a021-709ef12b630c",
            "8078a2d5-fd8c-4f6c-b28a-8235e694e90d",
            "2ac9e52e-32ae-438d-a13f-8cc8750a477a",
            "a5422f76-5067-4a94-8ae9-3ac440bc8617",
            "10cb5a5b-64f8-4326-a9e5-5ca2c341c28c",
            "ae02e1e1-9c54-4190-8ef4-4b4d8ceaef91",
            "2a965d6a-d9e1-4e1d-8d66-6ee5db52a3b1",
            "1ead25ff-499f-4a8f-ad39-f9b8dc83c9ae",
            "9af1a16e-5a6e-4bd5-9228-8a6e1e218b87",
            "1869c556-d7cf-49f2-814e-8dab8e2f30d6",
            "45910a2f-6980-4012-811d-d1481d3798d0",
            "8b65a270-b5a2-47da-87e2-19046a1dca38",
            "4b097138-418f-4ae6-bff1-e6586689c8a9",
            "a3bba919-1f8a-428f-94cf-c7cb658b58f7",
            "395dbdff-f20d-4b37-a698-1deda698f777",
            "9c22ed35-4492-40d2-8f7c-9928ec21a575",
            "fe081b3c-c4ef-49df-a3ec-710ab88479fd",
            "6538656d-41e8-43e3-9fa6-1db5f848d53f",
            "8a53b186-69b8-483e-bb59-90861dcb8bb4",
            "61ff557c-8bff-4cc0-98ee-abd7e5a958ad",
            "3cef7648-a58b-4b41-b4ff-37f69b66d5f1",
            "5c53652c-0e6a-4c14-8b72-fd0609cbc0c9",
            "b264bfc9-ebd6-4139-ac02-94a31368f315",
            "faae00d0-e11c-4a8f-af9c-a6d83a6632fe",
            "9dabfedf-d4e2-4e86-a198-b29a8b7d4796",
            "f64a0308-2665-45b6-8528-9d6b04217db3",
            "79a16a46-4c4a-428f-94de-5f63cccfd60f",
            "64b852db-f33c-4288-a01d-70f0d11f8cdc",
            "bfa0e3ce-95ed-430b-9de1-d53f4cda8200",
            "3f148f98-4987-4b1f-80b9-081251faa8a7",
            "2b551a2e-7717-4dc6-8b52-ac5a3b437938",
            "3002e9ad-adaa-4654-a296-d14c137ecf0d",
            "d66e3ca7-390c-4766-8d08-a97863f77aee",
            "91c6867d-1561-401d-9c04-a07cb6f6a5e4",
            "1a2266ea-6b11-4679-9d76-2a8a4472c7ae",
            "04207fa0-3e5e-4cdf-b656-447ed419f14c",
            "1ec69743-19e3-49f6-97b2-fdd087f38c9f",
            "c440ec02-3776-4093-9467-fc5a56776a51",
            "86a3f0b9-3976-49df-8807-367356d0e268",
            "e658938c-364d-4b72-b616-f649e66e365f",
            "c382f6f4-1309-4b40-932a-199b6e9bb560",
            "eb0f9de8-58d5-4dff-942f-5bfd165ecdac",
            "53d68371-4740-425c-89d3-8eeef1d65bb0",
            "9cf31572-934a-491b-9c5d-68cab59c255b",
            "becd516d-eba5-4582-a7e9-feaec2a7f34b",
            "0be14560-ace2-4fa3-bc5b-52e92580a380",
            "8fc69c37-4aaf-4afe-95c8-a97a3a369359",
            "3ac89849-277f-4918-a6d7-a59366b33c9e",
            "b292a86d-c6b8-4ddd-b797-0797162487fa",
            "e6a85350-bfbd-45fe-b2fc-0c36d7fdb919",
            "115451ef-883f-4226-91d5-cadcd579cc91",
            "872a0c39-0349-46b7-aefb-1a007db2171e",
            "bf925871-f308-4f06-ad6e-0b0bb956f7f1",
            "bd43d203-0fb3-49b3-8247-fead2d2bcb8a",
            "934b4b50-85f3-4643-b026-42692abeea16",
            "66728163-7782-4b5e-8fdf-323b865f48aa",
            "8fef0412-6489-4152-96b0-dc3577fba7c6",
            "bca1ce33-9e24-49c7-b52d-c44645120a54",
            "45b35c5b-1e02-4bdb-acb9-9092c2563e3e",
            "e2a4f1d4-7073-4141-ac85-489ef8155539",
            "18d10cda-e347-49f1-9026-e1e6eb9e0959",
            "dbd20c9f-1e8b-423f-b73e-cf19e150bf89",
            "04453dfd-cdbd-4490-97ee-1f6054109214",
            "20f84cab-f0cf-42b9-8dcd-b310c4ac562b",
            "2b88ec47-ee36-45f7-9dfe-f768ff989295",
            "0e215133-2bd0-4006-a456-693d7aa411e1",
            "24f039e9-14c6-4fdf-b936-65f0d096d3e7",
            "740812cd-c2a7-4587-892d-62808e63dd4b",
            "731c294c-2d8a-44b7-8cae-476650004e2f",
            "79664f5b-39fe-4210-a660-12a31a21fd3e",
            "d76e73a6-d3d7-4d07-a16c-5e343ddac678",
            "bac9e45a-c027-4e09-8556-697120ee760a",
            "a92f0f80-9ffe-445b-9e37-90656344cc15",
            "32e8e11f-e76e-4300-bffa-2dcdba8f58bc",
            "30b084f2-7bcb-403c-8bf5-5995aaf5902d",
            "7b4f3df1-ac8a-439f-a026-8569fb943341",
            "49484caf-696d-448a-8b64-afcc9543c1ae",
            "4cfaa992-c7fe-46a3-8814-cd2101571cf1",
            "dca8bc01-2c3d-4fe3-bd8e-ea93868efd04",
            "9cbc2880-7554-40b8-b534-ca9983e1507e",
            "029d13c5-5afc-401c-85d2-0ec0afaa5fd8",
            "9c842cf5-0d9a-407b-ba4e-478529d1048c",
            "4d9aa4c6-ddfe-4a6d-903c-6629867991c2",
            "e9abe33d-3a2b-4351-839d-5a449defb116",
            "f7eb31cf-1681-4957-9309-6e91abde485f",
            "a6ef1a7d-f2b9-44e9-9dec-c69bca1aef34",
            "d1fc96a0-4a58-4052-b52b-427aef550cfc",
            "edfd392e-abc9-4d77-b9ec-7179f4c6373d",
            "c4900f5f-0878-4e54-8bd0-3de84887b65e",
            "1298219c-1026-4a2b-a4ec-d9f3722fdb89",
            "f0757e73-02e7-4d0b-aea2-b49ca792a247",
            "2bc4afb7-2962-4344-a89c-1569485a1364",
            "de618737-9f43-44dc-ac18-6a3f3031a623",
            "bbd67d50-050f-491a-8cb5-208f1b28a00a",
            "731b9af5-0a8f-4755-a53a-f5385f172415",
            "1d898650-9dd0-4394-ab33-cd84490e3c84",
            "51476173-1910-4bc2-9025-177e0b7354e1",
            "7d9f2b3a-a6b3-4721-a713-39b8548b9229",
            "e75a99ed-f794-490e-bb91-99d5d3d9e50b",
            "bdd11079-fbbd-443d-843a-7e5924235798",
            "5bed753c-d062-481c-8bc4-01a8add66b96",
            "d1ef3bde-4752-4868-86fa-45a36c85a04f",
            "fe13ac7e-3c9e-4e91-aace-62dec91b1380",
            "ee477ddb-5c99-4fe3-aa07-07b4b5f8b63c",
            "09252924-b924-4756-b7dd-a3df4feb595b",
            "6835e3c2-bec2-43c1-b27f-bb0e32ddccf0",
            "db455e12-23e3-4289-802c-65e068d0aa86",
            "c7b057e4-efb9-4ecd-9d85-8963847cc074",
            "d3901e74-3243-461c-8c98-e33eca3273ae",
            "4c0288b6-0297-4b28-a701-f950f8fd40de",
            "eba7837d-7a06-47c0-9b22-d97e7f6ccffc",
            "f33374ac-97d8-4d5d-8f03-3d4b88f37556",
            "861ae061-c781-436a-a019-061b309e64f6",
            "8e5911ae-31fb-44db-8bdb-64cf04b2ab9b",
            "17c67cd2-db37-47e8-be20-6a6aaf313ea3",
            "da30745b-247f-4632-931a-08733d0c06c2",
            "39916b62-3acc-455b-8730-b4a9c01207da",
            "207fc800-d477-4076-8979-8c30bbadb236",
            "77b6e0fc-edc5-4abf-bd17-39230a85cc6e",
            "699dcebc-c0bd-49c0-b745-df0fca995844",
            "12f3cd2e-e08a-4c32-bf63-d68792d56067",
            "a4d516c8-38d7-4111-b90e-f73ec5747ad5",
            "affca271-5780-4523-bbe7-ef750797ea15",
            "f4648487-a1e8-47d0-8629-941da34609c1",
            "358be8ed-b24c-4ecb-9be8-53b9a04ade3b",
            "4dc92ff1-d6a5-479e-9758-8ada0c104fc9",
            "0457077e-d9b5-4b08-bf84-8c1fc75be094",
            "d461db7e-5def-41a1-97ff-922ec7afc14d",
            "2ef7abf5-77eb-480e-90c3-faddcfd63b23",
            "4e098313-b763-49c1-a6cb-f8953ad3b799",
            "d11a2bc3-ee75-4a2f-867b-3eac7325ee34",
            "44414dba-9b08-48f1-8bd2-c014b5c419bc",
            "40e1b16b-e0a0-40fa-bdcc-aae7bf51f6f3",
            "ec983ee5-bbc5-47f1-a7bb-97aed5475b8a",
            "698fd226-14d0-4b30-9138-1b88306c0675",
            "b3234956-dee7-4bb8-b511-ddf2af9fd950",
            "ced00bb1-b987-4eb5-85ab-7617f66d03ff",
            "62b529a4-6a55-474a-bc26-6fdd476b8464",
            "f88a6950-25c7-4e89-91c2-8782c5462af6",
            "5db81383-d3fe-4dfc-9a83-73677124f868",
            "ac60cae4-5f97-466f-ba22-a323a0c3666a",
            "c63012ed-733c-4045-9edf-3ec55c5a0e6c",
            "a4eddfc9-908f-474c-b5d7-31b256461fc2",
            "b753eca5-f7e1-481e-9fd8-70274d6088da",
            "559ddc14-666e-4b39-8c59-a35f90869382",
            "6335b233-e02f-42b5-b14b-c7fb1e519c89",
            "a0ab4d1a-efde-40e3-a8b2-3c2babd79f43",
            "aa7a1b59-76e4-44fe-86b5-47371f0d9314",
            "4050488d-126f-424d-a740-e53391d1b806",
            "7c75e9f1-d468-4558-8739-34596c5666d4",
            "bbb42e8f-2f9c-40cf-afb9-f9bf51d4cd87",
            "804f362c-988c-4657-ba00-ea51bd7b0738",
            "7708ff3c-3575-4e06-a178-569170edc219",
            "56af2181-a25d-4748-976e-40b6c1140b82",
            "6004a60b-4ca2-475b-bf1a-f31f98e66283",
            "d0f35578-7324-4ea4-9b8b-59b8de778207",
            "8e546b12-5d30-4a1f-ac50-822de584e9bf",
            "b9113775-05a0-4b25-9c37-bfd4f862d4cd",
            "b63d09be-ba4d-482c-836c-2b900f1b1d40",
            "f5a61f66-c4ff-467c-8800-62694aecb4f9",
            "c66be1db-1021-450b-a2b4-2015495f60fd",
            "fcb3427c-58a8-432c-878b-c7af589264f7",
            "ef1e5430-1f5d-406f-a81e-86513fa3da65",
            "93a90137-d317-4f55-8f35-bbb3fc2a87a4",
            "75aa0a8a-21d0-4690-9409-148a7f5a0ee7",
            "80702bda-7830-4873-9b35-9ed78265b9ad",
            "6b8741fa-45db-44b4-8bc5-dc0bf32c3948",
            "a7da9011-61ed-4d72-8428-242478077445",
            "964f367b-9e3d-4086-a67d-a67b33ed2d87",
            "b1b9b4de-ac15-484e-94eb-8529a35fa653",
            "eb983778-fbfc-40d4-9ed8-06350a65bd08",
            "ead0f805-e2e1-4180-b0aa-c4c5754ad96f",
            "7aef3147-7bea-4ee3-ab49-c4e4bb151c11",
            "4801f377-0d96-48de-86a6-c8fd6e8dab77",
            "3f9a7e2e-81c3-4a05-915e-3e69f71f011d",
            "260484f5-e615-4a9d-9bd9-c83be5dda29b"
          ],
          "personId": "aec5e701-3ab7-4238-b419-78eff1afe3fe",
          "aprId": "5a1e9091-e60c-4bdb-bbb8-d4f059c74adb",
          "academicPeriodStartDate": "2025-02-03T00:00:00.000Z",
          "academicPeriodEndDate": "2025-08-31T00:00:00.000Z",
          "studentId": "cf868eb6-800f-470c-8cfb-712ab7a02cf2"
        }

        // console.log(diffLinesUnified(compare.lessonId, asdf.lessonId))

        postSecondaryResults(session, {
          personId: primaryData.personId,
          studentId: primaryData.id,
          aprId: lastApr.id,
          academicPeriodStartDate: dateStringToIsoString(lastApr.startDate),
          academicPeriodEndDate: dateStringToIsoString(lastApr.endDate),
          lessonId: lessonIdArray,
          academicCourseId: academicCourseArray,
          courseUnitRealizationId: courseUnitRealizationIdArray,
          lessonRealizationTemplateId: lessonRealizationTemplateIdArray
        }).then((res) => {
          setSecondaryData(res);
          console.log(res);
        })
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