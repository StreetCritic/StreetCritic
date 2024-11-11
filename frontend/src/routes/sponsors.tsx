import Container from "@/components/container";
import { P, H1 } from "@/components/typography";
import useMeta from "@/hooks/useMeta";

/* export const metadata: Metadata = {
 *   title: "Sponsors",
 *   description: "Our sponsors.",
 * };
 *  */
export default function Home() {
  useMeta({ title: "Our Sponsors" });
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
        <img
          src={new URL("bmbf_logo.jpg", import.meta.url)}
          width={402}
          height={343}
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
