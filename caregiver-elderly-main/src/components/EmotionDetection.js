import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Box, Text, Flex, Spinner } from "@chakra-ui/react";

const EmotionDetection = () => {
  const [emotionData, setEmotionData] = useState(null); // Store the received emotion data
  const [isWebSocketOpen, setIsWebSocketOpen] = useState(false); // Track WebSocket connection status
  const [loading, setLoading] = useState(false); // To show loading spinner if necessary
  const socketRef = useRef(null); // Reference to the WebSocket connection

  // Initialize WebSocket connection when the component mounts
  useEffect(() => {
    socketRef.current = new WebSocket("wss://pythonwebsocket.onrender.com"); // Use your FastAPI WebSocket URL here

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setIsWebSocketOpen(true);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      setIsWebSocketOpen(false);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.predictions) {
        setEmotionData(data);
        setLoading(false); // Hide loading spinner once data is received
      } else if (data.error) {
        console.error("Error from WebSocket:", data.error);
        setLoading(false);
      }
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const webcamRef = useRef(null);

  // Capture the video frame and send it to the server
  const captureAndSendFrame = () => {
    if (webcamRef.current && isWebSocketOpen) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const payload = JSON.stringify({
          data: { image: imageSrc },
        });
        socketRef.current.send(payload);
        setLoading(true); // Show loading spinner while waiting for prediction
      }
    }
  };

  // Capture frame every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      captureAndSendFrame();
    }, 500); // Adjust the interval as needed (500ms here)

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [isWebSocketOpen]);

  return (
    <Box position="fixed" left="20px" bottom="20px" zIndex="10">
      {/* Camera feed window */}
      <Box position="relative">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          width="200px"
          height="150px"
          style={{ borderRadius: "8px", border: "2px solid #ccc" }}
        />

        {/* Emotion percentages display */}
        {emotionData && (
          <Box
            position="absolute"
            top="-40px"
            left="0"
            width="100%"
            bg="rgba(0, 0, 0, 0.5)"
            color="white"
            p="4px"
            borderRadius="8px"
            textAlign="center"
          >
            <Text fontWeight="bold" fontSize="14px">
              Emotion Percentages
            </Text>
            {Object.keys(emotionData.percentages).map((emotion) => (
              <Text key={emotion} fontSize="12px">
                {emotion.charAt(0).toUpperCase() + emotion.slice(1)}:{" "}
                {emotionData.percentages[emotion]}%
              </Text>
            ))}
          </Box>
        )}
      </Box>

      {/* Loading spinner when waiting for response */}
      {loading && (
        <Flex
          justify="center"
          align="center"
          direction="column"
          position="absolute"
          top="0"
          left="50%"
          transform="translateX(-50%)"
          width="100%"
        >
          <Spinner color="blue.500" size="xl" />
          <Text color="blue.500" fontSize="14px" mt={2}>
            Detecting Emotion...
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default EmotionDetection;
