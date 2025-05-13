import Container from "@/components/container";
import { Title, Text } from "@/components/typography";
import useMeta from "@/hooks/useMeta";

export default function About() {
  useMeta({ title: "Über StreetCritic" });
  return (
    <main>
      <Container>
        <Title>Über StreetCritic</Title>

        <Text>
          <strong>StreetCritic</strong> ist eine webbasierte Plattform, die dir
          hilft, Geh- und Radwege zu entdecken, zu bewerten und zu teilen – für
          alltägliche Wege, ob in der Stadt, zwischen Orten oder auf dem Land.
          Unser Ziel: angenehmere, sicherere und schönere Möglichkeiten, sich
          nachhaltig fortzubewegen.
        </Text>

        <Title order={2}>🗺️ Was bietet StreetCritic?</Title>

        <Text>
          Im Zentrum von StreetCritic steht eine Karte, die{" "}
          <em>für Menschen, nicht für Autos</em> gemacht ist. Anders als
          herkömmliche Karten, die für den Autoverkehr optimiert sind, zeigt
          unsere Karte, was für Fuß- und Radverkehr wichtig ist:
          <ul>
            <li>
              nationale und regionale Radrouten, sichere Übergänge, Bahnhöfe und
              ruhige Straßen.
            </li>
            <li>
              Autobahnen, Autotunnel und breite Hauptverkehrsstraßen sind
              zweitrangig.
            </li>
          </ul>
        </Text>

        <Text>
          Wege sind nach Qualität farblich markiert, und Icons zeigen echtes
          Nutzerfeedback: Problemstellen, Lob oder manuelle Bewertungen von
          Gehwegen, Radwegen und mehr.
        </Text>

        <Title order={2}>🚶🚴 Für wen ist das?</Title>

        <Text>
          Ob du zu Fuß gehst, Rad fährst oder beides – StreetCritic hilft dir,
          den besten Weg von A nach B zu finden. Du kannst deine
          Fortbewegungsart wählen und die Route nach dem anpassen, was dir am
          wichtigsten ist: <strong>Komfort</strong>, <strong>Sicherheit</strong>{" "}
          oder <strong>Schönheit</strong>.
        </Text>

        <Title order={2}>🧭 Klüger navigieren</Title>

        <Text>
          Die Routenfunktion zeigt dir nicht einfach irgendeine Route – sie
          zeigt dir <strong>deine</strong> beste Route. Indem du deine
          persönlichen Präferenzen in den Kategorien Komfort, Sicherheit und
          Schönheit festlegst, erhältst du Wege, die zu deinen Prioritäten
          passen – nicht nur die schnellste Option.
        </Text>

        <Text>
          StreetCritic kombiniert offene Daten (wie OpenStreetMap) mit
          Rückmeldungen aus der Community, um Wege zu bewerten, wie sie sich
          tatsächlich anfühlen.
        </Text>

        <Title order={2}>🤝 Aus der Community heraus entwickelt</Title>

        <Text>
          Du kannst direkt mitmachen: Wege bewerten, Probleme melden oder gutes
          Design loben. Organisationen und Initiativen können zudem lokale Pläne
          und Kampagnen teilen, indem sie Orte auf der Karte markieren und mit
          Vorschlägen oder Veranstaltungen verlinken. So erhalten Städte,
          Gemeinden und Planer direktes Feedback von den Menschen, die diese
          Wege tatsächlich nutzen – und erkennen besser, wo Verbesserungen am
          dringendsten gebraucht werden.
        </Text>

        <Title order={2}>🔓 Open Source. Offene Daten. Gemeinwohl.</Title>

        <Text>
          StreetCritic ist ein gemeinnütziges Open-Source- und
          Open-Data-Projekt. Alle Routenbewertungen (das{" "}
          <em>StreetCritic Rating</em>) sind frei verfügbar und können in
          anderen Apps und Diensten wiederverwendet werden.
        </Text>
      </Container>
    </main>
  );
}
