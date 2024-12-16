import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Box, Text } from "@chakra-ui/react";

const EmotionDetection = () => {
  // State to store the current predicted emotion
  const [currentEmotion, setCurrentEmotion] = useState("neutral"); // Default emotion is 'neutral'
  const [isWebSocketOpen, setIsWebSocketOpen] = useState(false); // WebSocket connection status
  const socketRef = useRef(null); // WebSocket reference

  useEffect(() => {
    // Create WebSocket connection to backend
    socketRef.current = new WebSocket(
      "wss://emotion-detection-server.onrender.com"
    ); // Update with your local WebSocket server URL

    // WebSocket onopen event
    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setIsWebSocketOpen(true);
    };

    // WebSocket onclose event
    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      setIsWebSocketOpen(false);
    };

    // WebSocket onmessage event to handle incoming messages
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received WebSocket message:", data.emotion);

      if (data.emotion) {
        console.log("Predicted Emotion:", data.emotion);
        if (data !== currentEmotion) {
          setCurrentEmotion(data.emotion);
        }
      } else if (data.error) {
        console.error("Error from WebSocket:", data.error);
      }
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [currentEmotion]); // Use currentEmotion in the dependency array to avoid re-render unless emotion changes

  const webcamRef = useRef(null);

  // Capture the video frame and send it to the server
  const captureAndSendFrame = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const payload = JSON.stringify({
          data: { image: imageSrc },
        });

        // Ensure WebSocket is open before sending
        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          socketRef.current.send(payload); // Send captured frame to the server
        } else {
          console.log(
            "WebSocket is not open. Current state:",
            socketRef.current?.readyState
          );
        }
      }
    }
  }, [isWebSocketOpen]);

  // Capture frame every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      captureAndSendFrame();
    }, 500); // Capture frame every 500ms

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [captureAndSendFrame]);

  return (
    <Box ml={10}>
      {/* Emotion Display Above the Camera Window */}
      <Box
       
        width="100%"
        bg="rgba(0, 0, 0, 0.5)"
        color="white"
        p="4px"
        borderRadius="8px"
        textAlign="center"
      >
        <Text fontWeight="bold" fontSize="14px">
          Predicted Emotion:
        </Text>
        <Text fontSize="12px">{currentEmotion}</Text>
      </Box>

      {/* Camera feed window */}
      <Box position="relative">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          width="400px"
          height="400px"
          style={{ borderRadius: "8px", border: "2px solid #ccc" }}
        />
      </Box>
    </Box>
  );
};

export default EmotionDetection;
