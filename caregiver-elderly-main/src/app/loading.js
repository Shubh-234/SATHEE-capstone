'use client'
import { Center, Flex, Spinner } from '@chakra-ui/react'
export default function Loading() {
    return (
        <Center height={'100vh'} width={'100%'} >
            <Spinner />
        </Center>
    )
}