"use client";
import { useParams } from "react-router";
import useMeta from "@/hooks/useMeta";
import { useGetRatingsByAccountIdQuery, useGetUserQuery } from "@/services/api";
import { skipToken } from "@reduxjs/toolkit/query";
import { Container, DateTime, Icon, Link, Loader, Title } from "@/components";
import { useLocalize } from "@/hooks";
import { Group, Rating } from "@mantine/core";
import { Heart } from "@phosphor-icons/react";

import styles from "./user.module.css";

export default function User() {
  const { username } = useParams();
  const __ = useLocalize();

  const user = useGetUserQuery(username ? { username } : skipToken);
  const ratings = useGetRatingsByAccountIdQuery(
    user?.data?.id ? { account_id: user.data.id } : skipToken,
  );

  useMeta({
    title: user?.data?.name || undefined,
    lang: "en",
    path: `/user/${username}?lang=en`,
  });

  if (user.isFetching) {
    return (
      <main>
        <Container>
          <Loader />
        </Container>
      </main>
    );
  }

  return (
    <main>
      <Container>
        <Title>
          <Icon size={42} id="user" /> {user?.data?.name}
        </Title>
        <Title order={2}>{__("reviews")}</Title>
        {(ratings.isFetching && <Loader />) ||
          (ratings.data && (
            <ul className={styles.ratings}>
              {ratings.data.map((rating) => (
                <li key={rating.id}>
                  <Rating
                    fractions={2}
                    value={rating.general_rating / 2}
                    readOnly
                    emptySymbol={<Heart size={22} color="#FA5252" />}
                    fullSymbol={
                      <Heart size={22} weight="fill" color="#FA5252" />
                    }
                  />
                  <Link to={`/way/${rating.way_id}`}>
                    {__("user-view-way")}
                  </Link>
                  <Group my="sm">
                    <Group>
                      <Icon size={22} id="calendar" />{" "}
                      <DateTime value={new Date(rating.datetime)} />
                    </Group>
                  </Group>
                </li>
              ))}
            </ul>
          ))}
      </Container>
    </main>
  );
}
