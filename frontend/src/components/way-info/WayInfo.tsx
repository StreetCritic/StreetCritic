"use client";

import { useState } from "react";

import {
  Button,
  DateTime,
  Icon,
  RatingForm,
  SidebarContent,
} from "@/components";
import { Title, P } from "@/components/typography";
import { Group, Rating, Badge, Paper } from "@mantine/core";
import { Way as APIWay } from "@/api-bindings/Way";
import { Rating as APIRating } from "@/api-bindings/Rating";

import {
  Heart,
  ThumbsUp,
  Sparkle,
  ThumbsDown,
} from "@phosphor-icons/react";

import { useLocalize, useLoginGate } from "@/hooks";
import { Account } from "@/api-bindings/Account";

type Props = {
  way: APIWay;
  ratings: APIRating[];
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
      {loginModal}
      {way.title && <Title size="h3">{way.title}</Title>}

      <small>
        <Group my="sm" justify="center">
          <Group>
            <Icon size={20} id="calendar" />{" "}
            <DateTime value={new Date(way.datetime)} />
          </Group>
          <Group>
            <Icon size={20} id="user" />{" "}
            {(way.user as Account).name ||
              (way.user as Account).id.slice(0, 8) + "..."}
          </Group>
        </Group>
      </small>

      <SidebarContent hideWhenFolded>
        <Title order={4}>
          {ratings.length ? `${__("reviews")}` : __("reviews-empty")}
        </Title>
        {ratings.map((rating) => (
          <Paper shadow="xs" p="xl" key={rating.id}>
            <small>
              <Group my="sm">
                <Group>
                  <Icon size={20} id="calendar" />{" "}
                  <DateTime value={new Date(rating.datetime)} />
                </Group>
                <Group>
                  <Icon size={20} id="user" />{" "}
                  {(rating.user as Account).name ||
                    (rating.user as Account).id.slice(0, 8) + "..."}
                </Group>
              </Group>
            </small>

            <Rating
              my="lg"
              fractions={2}
              value={rating.general_rating / 2}
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
          </Paper>
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
