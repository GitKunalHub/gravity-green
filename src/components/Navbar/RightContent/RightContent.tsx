import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import AuthButtons from "./AuthButtons";
import AuthModal from "@/components/Modal/Auth/AuthModal";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import UserMenu from "./UserMenu";

type RightContentProps = {
  user: any;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? "" : <AuthButtons />}
      </Flex>
      <UserMenu user={user} />
    </>
  );
};
export default RightContent;
