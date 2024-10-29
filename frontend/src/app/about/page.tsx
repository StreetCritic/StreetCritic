import type { Metadata } from "next";
import Container from "@/components/container";
import { P, H1, H2 } from "@/components/typography";

export default function Home() {
  return (
    <main>
      <Container>
        <H1>We collect subjective data on traffic routes.</H1>
        <H2>Which societal challenge does StreetCritic address?</H2>
        <P>
          Sustainable mobility is a prerequisite for solving many societal
          challenges, such as climate change, reduced quality of life,
          particularly in urban areas, and limited mobility for an aging
          society. Many solutions require not only objective but also subjective
          route data: Do I feel safe on the route? Can I make good progress? Is
          the route pleasant? These questions depend on more factors than just
          path width, surface, traffic volume, etc., and are difficult to
          measure. We are developing a data format, processes, and tools to
          capture this data. Additionally, with a routing function, it should be
          possible to suggest particularly beautiful, safe, and/or fast routes.
        </P>
        <H2>How are we addressing the problem?</H2>
        <P>
          The core of the project is a specification of the database structure
          as well as processes and tools for collecting and evaluating this
          data. The data is stored in a geo-database and relates to specific
          objects within the OpenStreetMap. We provide an application interface
          through which the data can be accessed and supplemented by other
          projects. A web application allows intuitive evaluation of routes and
          paths in various dimensions, as well as navigation based on this data.
        </P>
        <H2>Who is StreetCritic aimed at?</H2>
        <P>
          The target groups are primarily pedestrians, cyclists, and wheelchair
          users. They will be particularly reached through the routing function,
          which calculates safe, fast, and/or beautiful routes. Additionally, we
          target initiatives and associations for sustainable mobility.
        </P>
      </Container>
    </main>
  );
}
