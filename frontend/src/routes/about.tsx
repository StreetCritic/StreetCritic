import Container from "@/components/container";
import { P, H1, H2 } from "@/components/typography";
import useMeta from "@/hooks/useMeta";

export default function About() {
  useMeta({ title: "About" });
  return (
    <main>
      <Container>
        <H1>
          StreetCritic collects data and builds digital tools to support
          sustainable mobility
        </H1>

        <H2>Gathering insights about streets</H2>

        <P>
          Is a street comfortable, safe, and beautiful for cyclists or
          pedestrians? StreetCritic is a crowdsourcing platform that collects
          this kind of subjective feedback. This data can be used to enhance
          digital tools such as online maps and navigation systems.
          Additionally, it serves as a valuable resource for initiatives,
          researchers, and transportation planners aiming to create sustainable
          transportation and urban environments.
        </P>

        <H2>Smarter digital tools for cyclists and pedestrians</H2>

        <P>
          StreetCritic is focused on improving digital tools like online maps
          and navigation services for sustainable transportation, with a special
          focus on cyclists and pedestrians. Our goal is to help you identify
          pleasant routes, avoid unsafe streets, and make your journey easier
          and more enjoyable.
        </P>

        <H2>Let's start conversations about our streets!</H2>

        <P>
          StreetCritic aims to inspire discussions about how our streets are
          designed and used. Questions like: Do we need so much parking space?
          How can we address pollution? How can we design streets to be more
          beautiful and welcoming? Why is infrastructure uncomfortable in
          certain areas?
        </P>

        <H2>Open Source, Open Data</H2>

        <P>
          StreetCritic builds on principles of transparency and collaboration by
          creating and sharing Open Source Software and Open Data.
        </P>
      </Container>
    </main>
  );
}
