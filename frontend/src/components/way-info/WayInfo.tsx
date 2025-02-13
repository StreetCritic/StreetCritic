"use client";

import { useState } from "react";

import { Button, RatingForm, SidebarContent } from "@/components";
import { Text, Title, P } from "@/components/typography";
import { Group, Rating, Badge } from "@mantine/core";
import { Way as APIWay } from "@/api-bindings/Way";

import {
  Heart,
  ThumbsUp,
  Sparkle,
  ThumbsDown,
} from "@phosphor-icons/react/dist/ssr";

import { useLocalize, useLoginGate } from "@/hooks";

type Props = {
  way: APIWay;
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ratings: any[];
  // Called when the way info should be refreshed.
  onRefresh: () => void;
};

export default function WayInfo({ way, ratings, onRefresh }: Props) {
  const __ = useLocalize();
  const [ratingFormOpen, setRatingFormOpen] = useState(false);
  const [loginModal, requireAuthentication] = useLoginGate();

  const tagToPill = (tag: string) => {
    const negative = tag[0] === "-";
    const label = tag[0] === "-" ? tag.slice(1) : tag;
    return (
      <Badge
        variant="light"
        autoContrast
        leftSection={negative ? <ThumbsDown /> : <ThumbsUp />}
        key={tag}
        color={negative ? "red" : "green"}
        size="lg"
      >
        {__(`way-rating-tag-${label}`)}
      </Badge>
    );
  };

  return (
    <>
      {/* {data.datetime} */}
      {/* Created on 2024/3/12 */}
      <SidebarContent hideWhenFolded>
        <Text>Bicycle way</Text>
      </SidebarContent>
      {loginModal}
      {way.title && <Title size="h3">{way.title}</Title>}

      <SidebarContent hideWhenFolded>
        {ratings.length ? `${__("reviews")}:` : __("reviews-empty")}
        {ratings.map((rating) => (
          <>
            <Rating
              my="lg"
              fractions={2}
              defaultValue={rating.general_rating / 2}
              readOnly
              emptySymbol={<Heart size={32} color="#FA5252" />}
              fullSymbol={<Heart size={32} weight="fill" color="#FA5252" />}
            />
            <Group my="lg">{rating.tags.map(tagToPill)}</Group>
            <P>
              {rating.comment}
              {/* … <a href="#">Read more</a> */}
            </P>
            {/*
          Was this review helpful?
          <Group>
            <ThumbsUp /> 12
            <ThumbsDown /> 3
          </Group>
          */}
          </>
        ))}
        <br />
        <br />
        <Button
          label="Rate this way"
          icon={<Sparkle size={32} />}
          onClick={() => requireAuthentication(() => setRatingFormOpen(true))}
        />
        {ratingFormOpen && (
          <RatingForm
            wayId={way.id}
            onClose={() => {
              setRatingFormOpen(false);
              onRefresh();
            }}
          />
        )}
      </SidebarContent>
    </>
  );
}
