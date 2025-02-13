export type Ratings = {
  general: number;
  safety: number;
  comfort: number;
  beauty: number;
};

export type Rating = {
  wayId: number;
  comment: string;
  tags: string[];
  rating: Ratings;
};
