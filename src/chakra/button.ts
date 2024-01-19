import { ComponentStyleConfig } from "@chakra-ui/theme";

export const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "60px",
    fontsize: "10pt",
    fontWeight: 700,
    _focus: {
      boxShadow: "none",
    },
  },
  sizes: {
    sm: {
      fontsize: "8pt",
    },
    md: {
      fontsize: "10pt",
    },
  },
  variants: {
    solid: {
      color: "white",
      bg: "green.500",
      _hover: {
        bg: "green.400",
      },
    },
    outline: {
      color: "green.500",
      border: "1px solid",
      borderColor: "green.500",
    },
    oauth: {
      height: "34px",
      border: "1px solid",
      borderColor: "gray.300",
      _hover: {
        bg: "gray.50",
      },
    },
  },
};
