import { Center } from "@mantine/core";
import { Loader } from "@/components";

/**
 * A loading page, just a centered loading animation.
 */
export default function LoadingPage() {
  return (
    <main>
      <Center h={120}>
        <Loader />
      </Center>
    </main>
  );
}
