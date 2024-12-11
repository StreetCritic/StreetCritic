import { Accordion as MAccordion } from "@mantine/core";

export type Item = {
  value: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

type Props = {
  items: Item[];
};

export default function Accordion({ items }: Props) {
  // See groceries data above
  const accordionItems = items.map((item) => (
    <MAccordion.Item key={item.value} value={item.value}>
      <MAccordion.Control icon={item.icon}>{item.value}</MAccordion.Control>
      <MAccordion.Panel>{item.content}</MAccordion.Panel>
    </MAccordion.Item>
  ));

  return <MAccordion variant="default">{accordionItems}</MAccordion>;
}
