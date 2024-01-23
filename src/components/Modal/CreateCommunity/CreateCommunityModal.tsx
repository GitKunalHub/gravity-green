import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Input,
  Divider,
  Stack,
  Checkbox,
  Flex,
  Icon,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BiMovie, BiTv } from "react-icons/bi";
import { PiTelevision } from "react-icons/pi";

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  open,
  handleClose,
}) => {
  const [communityName, setCommunityName] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState("Movie");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;

    setCommunityName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const onCommunityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityType(event.target.name);
  };

  const handleCreateCommunity = async () => {};

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Create a community
          </ModalHeader>
          <Box pl={3} pr={3}>
            <Divider />
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text fontSize={11} color="gray.500">
                Community names including capitalization cannot be changed
              </Text>
              <Text
                position="relative"
                top="28px"
                left="10px"
                width="20px"
                color="gray.400"
              >
                g/
              </Text>
              <Input
                position="relative"
                value={communityName}
                size="sm"
                pl="25px"
                onChange={handleChange}
              />
              <Text
                fontSize="9pt"
                color={charsRemaining === 0 ? "red" : "gray.500"}
              >
                {charsRemaining} Characters remaining
              </Text>
              <Box mt={4} mb={4}>
                <Text fontWeight={600} fontSize={15}>
                  Community Type
                </Text>
                <Stack spacing={2}>
                  <Checkbox
                    name="movie"
                    isChecked={communityType === "movie"}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BiMovie} color="gray.500" mr={2}></Icon>
                      <Text fontSize="10pt" mr={1}>
                        Movie
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Create a community for your favourite Movie!
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="tvshow"
                    isChecked={communityType === "tvshow"}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={PiTelevision} color="gray.500" mr={2}></Icon>
                      <Text fontSize="10pt" mr={1}>
                        TV Show
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Create a community for your favourite TV Show!
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
            <ModalCloseButton />
          </Box>

          <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              colorScheme="blue"
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button height="30px" onClick={() => {}}>
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModal;
