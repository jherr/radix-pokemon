import { Box, Avatar, Button, Heading, Flex } from "@radix-ui/themes";
import { getUser, signOut } from "@workos-inc/authkit-nextjs";
import Link from "next/link";

import styles from "./header.module.css";

export default async function () {
  const { user } = await getUser();

  return (
    <Box p="2" className={styles.header} mb="3">
      <Flex>
        <Box flexGrow="1" p="2">
          <Link href="/">
            <Heading highContrast>Pokemon Deck Builder</Heading>
          </Link>
        </Box>
        {user && (
          <Flex gap="2">
            <Avatar
              src={user?.profilePictureUrl ?? undefined}
              fallback={user?.firstName ?? ""}
              size="3"
            />
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button size="3" type="submit">
                Sign out
              </Button>
            </form>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
