import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/container";
import { P, H1 } from "@/components/typography";

export const metadata: Metadata = {
  title: "Sponsors",
  description: "Our sponsors.",
};

export default function Home() {
  return (
    <main>
      <Container>
        <H1>Our Sponsors</H1>
        <P>
          From September 2024 to February 2025, the development of the prototype
          of StreetCritic is sponsered by the German Ministry of Education and
          Research (Code: SubjectiveWays) and the{" "}
          <a target="_blank" href="https://prototypefund.de/">
            PrototypeFund
          </a>
          .
        </P>
        <Image
          unoptimized={true}
          width={402}
          height={343}
          src="/images/bmbf_logo.jpg"
          alt="Sponsored by the Federal Ministry of Education and Research"
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </Container>
    </main>
  );
}
