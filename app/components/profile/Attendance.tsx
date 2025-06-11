import { View, Text } from "react-native";
import { AttendanceDataInterface } from "../../types/profile/Attendance";
import { objectIsEmpty } from "@/app/functions/UtilityFunctions";
import GenericLoader from "../GenericLoader";
import PieChart from "react-native-pie-chart";
import { useEffect, useState } from "react";

interface IAttendanceViewProps {
    attendanceData: AttendanceDataInterface
}

function AttendanceView({attendanceData} : IAttendanceViewProps) {

    const [seriesData, setSeriesData] = useState([]);

    useEffect(() => {
        let temp = []

        if (!objectIsEmpty(attendanceData)) {
            temp.push({value: attendanceData.absentRate * 100, color: 'red', label: {text: `${attendanceData.absentRate * 100}%`, fontWeight: 'bold'}});
            temp.push({value: attendanceData.presentRate * 100, color: 'green', label: {text: `${attendanceData.presentRate * 100}%`, fontWeight: 'bold'}});
            temp.push({value: attendanceData.undefinedRate * 100, color: 'gray'});

            setSeriesData(temp);
        }
    }, [attendanceData]);

    if (seriesData.length === 0) {
        return <GenericLoader/>
    }

    return (
        <View className={
            "my-2 py-1 px-2 rounded-t-md rounded-b-md flex bg-white gap-2"
          }>
            <Text>{attendanceData.academicPeriodRealization.name.split(',')[0]}</Text>
            <View className="flex flex-row align-middle items-center w-full justify-around">
                <PieChart widthAndHeight={150} series={seriesData} cover={0.45} padAngle={0.01}></PieChart>
                <View>
                    <View className="flex flex-row justify-start">
                        <View className="bg-red h-2 w-2"></View><Text>Absent: {attendanceData.absentRate * 100}%</Text>
                    </View>
                    
                    <Text>Present: {attendanceData.presentRate * 100}%</Text>
                    <Text>Undefined: {attendanceData.undefinedRate * 100}%</Text>
                </View>
            </View>
        </View> 
    )
}

export default AttendanceView;