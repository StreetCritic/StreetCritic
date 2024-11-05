"use client";

import { useState } from "react";

import { H1, P } from "@/components/typography";
import { Group, Rating, Text, Pill } from "@mantine/core";
import Button from "@/components/button";
import {
  Heart,
  HeartBreak,
  ThumbsUp,
  Sparkle,
  ThumbsDown,
} from "@phosphor-icons/react/dist/ssr";

import RatingForm from "@/components/rating-form";

type Props = {
  way: any;
  ratings: any[];
};

export default function WayInfo({ way, ratings }: Props) {
  const [ratingFormOpen, setRatingFormOpen] = useState(false);
  return (
    <>
      {/* {data.datetime} */}
      Created on 2024/3/12
      <H1>{way.title}</H1>
      Reviews:
      {ratings.map((rating) => (
        <>
          <Rating
            my="lg"
            fractions={2}
            defaultValue={rating.rating / 2}
            readOnly
            emptySymbol={<Heart size={32} color="#FA5252" />}
            fullSymbol={<Heart size={32} weight="fill" color="#FA5252" />}
          />
          <Group my="lg">
            <Pill color="green" size="lg">
              Quiet
            </Pill>
            <Pill color="green" size="lg">
              Good infrastructure
            </Pill>
            {rating.tags}
          </Group>
          <P>
            {rating.comment}
            {/* … <a href="#">Read more</a> */}
          </P>
          Was this review helpful?
          <Group>
            <ThumbsUp /> 12
            <ThumbsDown /> 3
          </Group>
        </>
      ))}
      <br />
      <br />
      <Button
        label="Rate this way"
        icon={<Sparkle size={32} />}
        onClick={() => setRatingFormOpen(true)}
      />
      {ratingFormOpen && (
        <RatingForm way_id={way.id} onClose={() => setRatingFormOpen(false)} />
      )}
    </>
  );
}
