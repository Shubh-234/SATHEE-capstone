import { theme } from "@/data/data";
import { forwardRef, useCheckbox, Box, chakra, Text, Icon } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

const Checkbox = forwardRef((props, ref) => {
    const { getInputProps, getCheckboxProps, getLabelProps, state } = useCheckbox(props);

    return (
        <chakra.label display="flex" alignItems="center" {...getLabelProps()}>
            <input {...getInputProps()} hidden ref={ref} />
      <Box
        {...getCheckboxProps()}
        display="flex"
        alignItems="center"
        justifyContent="center"
        border="1px"
        borderRadius="4px"
        borderColor={state.isChecked ? theme.color.border : "#D0D5DD"}
        bg={"#EFF4FF"}
        w="16px"
        h="16px"
        color={state.isChecked ? theme.color.border : "white"}
      >
        {state.isChecked && <FaCheck size={9} />}
      </Box>
            <Box ml={2}>
                <Text fontSize={"16px"} fontWeight={"500"} variant='subheading'>{props.children}</Text></Box>
        </chakra.label>
    );
});

export default Checkbox;
