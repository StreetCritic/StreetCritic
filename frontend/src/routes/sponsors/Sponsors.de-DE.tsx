import Container from "@/components/container";
import { P, Title } from "@/components/typography";
import useMeta from "@/hooks/useMeta";

export default function Home() {
  useMeta({ title: "Unsere Sponsoren" });
  return (
    <main>
      <Container>
        <Title>Unsere Sponsoren</Title>
        <P>
          Von September 2024 bis Februar 2025 wurde die Entwicklung des
          Prototyps von StreetCritic vom Bundesministerium für Bildung und
          Forschung (Förderkennzeichen: SubjectiveWays) und dem{" "}
          <a target="_blank" href="https://prototypefund.de/">
            PrototypeFund
          </a>{" "}
          gefördert.
        </P>
        <img
          src={new URL("bmbf_logo.jpg", import.meta.url).href}
          width={402}
          height={343}
          alt="Gefördert vom Bundesministerium für Bildung und Forschung"
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </Container>
    </main>
  );
}
