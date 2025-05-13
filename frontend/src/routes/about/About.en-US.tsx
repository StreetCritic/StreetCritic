import Container from "@/components/container";
import { Title, Text } from "@/components/typography";
import useMeta from "@/hooks/useMeta";

export default function About() {
  useMeta({ title: "About" });
  return (
    <main>
      <Container>
        <Title>About StreetCritic</Title>

        <Text>
          <strong>StreetCritic</strong> is a web-based platform that helps you
          discover, rate, and share walking and cycling routes – for everyday
          travel, whether in the city, between towns, or in rural areas. Our
          goal: more comfortable, safer, and more enjoyable ways to get around
          sustainably.
        </Text>

        <Title order={2}>🗺️ What does StreetCritic offer?</Title>

        <Text>
          At the heart of StreetCritic is a map that’s built{" "}
          <em>for people, not cars</em>. Unlike conventional maps optimized for
          driving, our map highlights what matters for walking and cycling:
          <ul>
            <li>
              national and regional bike routes, safe crossings, train stations,
              and quiet streets.
            </li>
            <li>
              Highways, car tunnels, and wide arterial roads take a back seat
            </li>
          </ul>
        </Text>

        <Text>
          Paths are color-coded by quality, and icons show real user input:
          problem spots, praise, or manual evaluations of sidewalks, bike paths,
          and more.
        </Text>

        <Title order={2}>🚶🚴 Who is it for?</Title>

        <Text>
          Whether you walk, cycle, or both – StreetCritic helps you find the
          best way from A to B. You can choose your travel mode and adjust your
          route based on what matters most to you: <strong>Comfort</strong>,{" "}
          <strong>Safety</strong>, or <strong>Beauty</strong>.
        </Text>

        <Title order={2}>🧭 Navigate smarter</Title>

        <Text>
          The routing feature doesn’t just show you a route – it shows{" "}
          <strong>your</strong> best route. By setting your personal preferences
          across the categories of Comfort, Safety, and Beauty, you get paths
          that fit your priorities, not just the fastest option.
        </Text>

        <Text>
          StreetCritic combines open data (like OpenStreetMap) with community
          feedback to evaluate routes that actually reflect how they feel on the
          ground.
        </Text>

        <Title order={2}>🤝 Built by the community</Title>

        <Text>
          You can contribute directly: rate paths, report issues, or give kudos
          for great infrastructure. Organizations and initiatives can also share
          local plans and campaigns by marking spots on the map and linking to
          their proposals or events. This way, cities, municipalities, and
          planners get direct feedback from the people who actually use these
          routes – helping them understand where improvements are needed most.
        </Text>

        <Title order={2}>🔓 Open source. Open data. Public good.</Title>

        <Text>
          StreetCritic is a nonprofit, open source, and open data project. All
          route ratings (the <em>StreetCritic Rating</em>) are freely available
          and can be reused in other apps and services.
        </Text>
      </Container>
    </main>
  );
}
