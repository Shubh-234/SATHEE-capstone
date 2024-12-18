"use client";
import Button from "@/components/ui/Button";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Center,
  HStack,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Flex,
  Wrap,
  Spacer,
  WrapItem,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  Input,
  VStack,
  AlertDialogFooter,
  Box,
  Image,
  Spinner,
  useToast,
  Heading,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Dropzone from "@/components/DropZone";
import { theme } from "@/data/data";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "@/config/firebase";
import { showToastSuccess } from "@/utils/toastUtils";
import Loading from "@/app/loading";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";
import { Calendar } from "primereact/calendar";
import { CiCalendar } from "react-icons/ci";
import { and, collection, getDocs, query, where } from "firebase/firestore";
import moment from "moment";
import { LineChart } from "@/components/Charts";
import { FaChartLine } from "react-icons/fa";

export default function ChartPage({ id, onBackClick }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  async function fetchRecord() {
    // console.log(id);

    getDocs(
      query(
        collection(db, "record"),
        and(
          //   where("elderlyId", "==", id),
          where("created", ">=", moment(startDate).startOf("day").valueOf()),
          where("created", "<=", moment(endDate).endOf("day").valueOf())
        )
      )
    )
      .then((snapshot) => {
        setLoading(false);
        let list = [];
        snapshot.forEach((docs) => {
          list.push(docs.data());
        });

        list.sort((a, b) => a.created - b.created);

        setData([...list]);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  return (
    <Flex
      flex={1}
      gap={"20px"}
      p={"32px"}
      flexDir="column"
      overflowX={"auto"}
      bgColor="#F9FAFB"
      borderRadius="md"
      boxShadow="md"
      minH={"100vh"}
    >
      <HStack mb={5}>
        <Icon
          as={IoIosArrowBack}
          boxSize={10}
          color="#2B6CB0"
          _hover={{ cursor: "pointer" }}
          onClick={() => {
            onBackClick();
          }}
        />
        <Icon as={FaChartLine} boxSize={10} color="#2B6CB0" />
        <Heading color="#2B6CB0">Charts</Heading>
      </HStack>
      <Wrap mb={5} align={"flex-end"}>
        <WrapItem>
          <Stack dir="column" spacing={1}>
            <Text variant="subheading">Start Date</Text>
            <Box
              display={"flex"}
              width={"100%"}
              height={10}
              borderRadius={"0.375rem"}
              outline={"2px solid transparent"}
              border={"1px solid"}
              borderColor={theme.color.shadowColor}
              paddingInlineStart={"1rem"}
              paddingInlineEnd={"1rem"}
              alignItems={"center"}
              _hover={{ borderColor: theme.color.shadowColor }}
              _focusWithin={{
                boxShadow: `0px 0px 3px 3px ${theme.color.shadowColor}`,
                borderColor: theme.color.shadowColor,
              }}
            >
              <Calendar
                className="custom-datepicker"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.value);
                }}
              />
              <Icon as={CiCalendar} size={20} />
            </Box>
          </Stack>
        </WrapItem>
        <WrapItem>
          <Stack dir="column" spacing={1}>
            <Text variant="subheading">End Date</Text>
            <Box
              display={"flex"}
              width={"100%"}
              height={10}
              borderRadius={"0.375rem"}
              outline={"2px solid transparent"}
              border={"1px solid"}
              borderColor={theme.color.shadowColor}
              paddingInlineStart={"1rem"}
              paddingInlineEnd={"1rem"}
              alignItems={"center"}
              _hover={{ borderColor: theme.color.shadowColor }}
              _focusWithin={{
                boxShadow: `0px 0px 3px 3px ${theme.color.shadowColor}`,
                borderColor: theme.color.shadowColor,
              }}
            >
              <Calendar
                className="custom-datepicker"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.value);
                }}
              />
              <Icon as={CiCalendar} size={20} />
            </Box>
          </Stack>
        </WrapItem>

        <WrapItem>
          <Button
            isDisabled={!id}
            isLoading={loading}
            onClick={() => {
              setLoading(true);
              setData([]);
              fetchRecord();
            }}
          >
            Fetch Record
          </Button>
        </WrapItem>
      </Wrap>
      {data.length === 0 ? (
        <Center>
          <Text fontSize="16px" color="#6B7280">
            No record found
          </Text>
        </Center>
      ) : (
        <>
          <div>
            <Center>
              <Text variant={"heading"}>Temperature °F</Text>
            </Center>
            <LineChart
              title={"Temperature °F"}
              id={`line-chart-1`}
              data={data.map((item) => Number(item.temperature))}
              label={data.map((item) =>
                moment(new Date(item.created)).format("DD/MM/YYYY hh:mm A")
              )}
            />
          </div>
          <div>
            <Center>
              <Text variant={"heading"}>SpO₂ %</Text>
            </Center>
            <LineChart
              title={"SpO₂ %"}
              id={`line-chart-2`}
              data={data.map((item) => Number(item.respiratoryRate))}
              label={data.map((item) =>
                moment(new Date(item.created)).format("DD/MM/YYYY hh:mm A")
              )}
            />
          </div>
        </>
      )}
    </Flex>
  );
}
