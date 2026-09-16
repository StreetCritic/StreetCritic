import { createCookieSessionStorage } from "react-router";

type SessionData = {
  locale: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__user-prefs",
    },
  });

export { getSession, commitSession, destroySession };
