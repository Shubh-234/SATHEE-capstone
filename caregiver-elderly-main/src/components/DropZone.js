
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Center, Image, Spinner, Text } from "@chakra-ui/react";
import { theme } from "@/data/data";

const Dropzone = ({ onDrop, title, subheading, description, drag, loading }) => {
    const onDropAccepted = useCallback(
        (acceptedFiles) => {
            onDrop(acceptedFiles[0]);
        },
        [onDrop]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDropAccepted,
        accept: "image/*",
        multiple : false
    });

    return (
        loading ?
            <Center>
                <Spinner />
            </Center>
            :
            <Box
                {...getRootProps()}
                width={"100%"}
                border={"1px solid"}
                borderColor={theme.color.shadowColor}
                borderRadius={"8px"}
                display={"flex"}
                flexDir={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                padding={"16px"}
                cursor={'pointer'}
                height={'120px'}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "5px",
                        backgroundColor: theme.icon.background,
                        borderRadius: "50px",
                    }}
                >
                    <Image
                        src="/assets/upload-cloud-02.png"
                        height={"20px"}
                        width={"20px"}
                    />
                </div>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <Text variant="description" fontWeight={'500'} fontSize={'14px'} mt={'10px'}> {drag}</Text>
                ) : (
                    <div style={{ display: "flex", flexDirection: 'column' }}>
                        <div style={{ display: 'flex' }}>
                            <Text variant="link" fontWeight={'500'} fontSize={'14px'}>
                                {title}
                            </Text>
                            <Text variant={'description'} ml={1} fontSize={"14px"}>
                                {subheading}
                            </Text>
                        </div>
                        <Text variant={'description'} fontSize={"11px"}>
                            {description}
                        </Text>
                    </div>
                )}
            </Box>
    );
};

export default Dropzone;
