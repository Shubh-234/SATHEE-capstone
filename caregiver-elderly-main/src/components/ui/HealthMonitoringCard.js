import { Box, HStack, VStack, Stack, Icon, Text } from '@chakra-ui/react';
import { MdWarningAmber } from 'react-icons/md';
import { BsHeartPulse } from 'react-icons/bs';
import { IoSpeedometerOutline } from 'react-icons/io5';
import { LiaTemperatureHighSolid } from 'react-icons/lia';
import { FiWind } from 'react-icons/fi';
import moment from 'moment';

export const HealthMonitoringCard = ({ data }) => {

    const Alert = ({ name, type }) => {
        return (
            <HStack py={'2px'} px={'8px'} gap={'8px'} bg={'#FFE5E5'} borderRadius={'20px'} animation="bounce 1s infinite alternate">
                <Icon color={'#FF616D'} as={MdWarningAmber} />
                <Text fontSize={'14px'} fontWeight={'700'} color={'#FF616D'}>{type} {name}</Text>
            </HStack>
        )
    }

    function checkBloodPressure(item) {
        const temp = item?.split('/');
        const isHigh = Number(temp[0]) > 125;
        const isLow = Number(temp[0]) < 90;

        return (
            <HStack width={'100%'} p={4} borderRadius={'16px'} bg={isHigh || isLow ? '#FFEDF0' : '#EBF8FF'}>
                <Icon boxSize={10} color={isHigh || isLow ? '#FF616D' : '#4A90E2'} as={BsHeartPulse} />
                <VStack align={'flex-start'}>
                    <Text color={isHigh || isLow ? '#FF616D' : '#333'} fontWeight={'600'} fontSize={'16px'}>Blood Pressure</Text>
                    <Text color={isHigh || isLow ? '#FF616D' : '#666'} fontWeight={'400'} fontSize={'14px'}>{item} mmHg</Text>
                    {isHigh && <Alert type={'High'} name={'blood pressure'} />}
                    {isLow && <Alert type={'Low'} name={'blood pressure'} />}
                </VStack>
            </HStack>
        );
    }

    function checkHeartRate(item) {
        const isHigh = item > 100;
        const isLow = item < 60;

        return (
            <HStack width={'100%'} p={4} borderRadius={'16px'} bg={isHigh || isLow ? '#FFEDF0' : '#EBF8FF'}>
                <Icon boxSize={10} color={isHigh || isLow ? '#FF616D' : '#4A90E2'} as={IoSpeedometerOutline} />
                <VStack align={'flex-start'}>
                    <Text color={isHigh || isLow ? '#FF616D' : '#333'} fontWeight={'600'} fontSize={'16px'}>Heart Rate</Text>
                    <Text color={isHigh || isLow ? '#FF616D' : '#666'} fontWeight={'400'} fontSize={'14px'}>{item} bpm</Text>
                    {isHigh && <Alert type={'High'} name={'heart rate'} />}
                    {isLow && <Alert type={'Low'} name={'heart rate'} />}
                </VStack>
            </HStack>
        );
    }

    function checkTemperature(item) {
        const isHigh = item > 99.1;
        const isLow = item < 97.8;

        return (
            <HStack width={'100%'} p={4} borderRadius={'16px'} bg={isHigh || isLow ? '#FFEDF0' : '#EBF8FF'}>
                <Icon boxSize={10} color={isHigh || isLow ? '#FF616D' : '#4A90E2'} as={LiaTemperatureHighSolid} />
                <VStack align={'flex-start'}>
                    <Text color={isHigh || isLow ? '#FF616D' : '#333'} fontWeight={'600'} fontSize={'16px'}>Temperature</Text>
                    <Text color={isHigh || isLow ? '#FF616D' : '#666'} fontWeight={'400'} fontSize={'14px'}>{item}°F</Text>
                    {isHigh && <Alert type={'High'} name={'temperature'} />}
                    {isLow && <Alert type={'Low'} name={'temperature'} />}
                </VStack>
            </HStack>
        );
    }

    function checkRespiratoryRate(item) {
        const isHigh = item > 100;
        const isLow = item < 90;

        return (
            <HStack width={'100%'} p={4} borderRadius={'16px'} bg={isHigh || isLow ? '#FFEDF0' : '#EBF8FF'}>
                <Icon boxSize={10} color={isHigh || isLow ? '#FF616D' : '#4A90E2'} as={FiWind} />
                <VStack align={'flex-start'}>
                    <Text color={isHigh || isLow ? '#FF616D' : '#333'} fontWeight={'600'} fontSize={'16px'}>SpO₂</Text>
                    <Text color={isHigh || isLow ? '#FF616D' : '#666'} fontWeight={'400'} fontSize={'14px'}>{item} %</Text>
                    {isHigh && <Alert type={'High'} name={'SpO₂'} />}
                    {isLow && <Alert type={'Low'} name={'SpO₂'} />}
                </VStack>
            </HStack>
        );
    }

    return (
        <Box borderRadius={'20px'} p={6} m={2} boxShadow={'xl'} bg={'#FFFFFF'}>
            <VStack spacing={6} align={'flex-start'} width={'100%'}>
                <Stack width={'100%'} flexDir={{ base: 'column', md: 'row' }} spacing={4}>
                    {checkBloodPressure(data?.bloodPressure || '/')}
                    {checkHeartRate(data?.heartRate)}
                </Stack>
                <Stack width={'100%'} flexDir={{ base: 'column', md: 'row' }} spacing={4}>
                    {checkTemperature(data?.temperature)}
                    {checkRespiratoryRate(data?.respiratoryRate)}
                </Stack>
                <Text fontSize={'14px'} color={'#999'}>{`${data?.created && moment(new Date(data.created)).format("DD/MM/YYYY hh:mm A")}`}</Text>
            </VStack>
        </Box>
    );
};
