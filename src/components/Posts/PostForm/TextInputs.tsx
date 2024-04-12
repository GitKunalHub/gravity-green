import { Button, Flex, Input, Stack, Switch, Textarea } from "@chakra-ui/react";
import React, { useState } from "react";

type TextInputsProps = {
  textInputs: {
    aititle: string;
    title: string;
    body: string;
  };
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCreatePost: () => void;
  loading: boolean;
  // useHuggingFaceModel: boolean;
  // setUseHuggingFaceModel: (value: boolean) => void;
};

const TextInputs: React.FC<TextInputsProps> = ({
  textInputs,
  onChange,
  handleCreatePost,
  loading,
  // useHuggingFaceModel,
  // setUseHuggingFaceModel,
}) => {
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  return (
    <Stack spacing={3} width="100%">
      <Input
        name="title"
        value={textInputs.title}
        onChange={onChange}
        fontSize="10pt"
        borderRadius={4}
        placeholder="Title"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />
      {isAiGenerated && (
        <Input
          name="aititle"
          value={textInputs.aititle}
          onChange={onChange}
          fontSize="10pt"
          borderRadius={4}
          placeholder="AI-Title"
          _placeholder={{ color: "gray.500" }}
          _focus={{
            outline: "none",
            bg: "white",
            border: "1px solid",
            borderColor: "black",
          }}
        />
      )}

      <Textarea
        name="body"
        value={textInputs.body}
        onChange={onChange}
        fontSize="10pt"
        borderRadius={4}
        height="100px"
        placeholder="Text (optional)"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />
      <Flex justify="flex-end">
        <Switch
          isChecked={isAiGenerated}
          onChange={() => setIsAiGenerated(!isAiGenerated)}
          colorScheme="teal"
          size="lg"
        >
          AI-Generated
        </Switch>
        <Button
          height="34px"
          padding="0px 30px"
          disabled={false}
          isLoading={loading}
          onClick={() => {
            handleCreatePost();
          }}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};
export default TextInputs;
