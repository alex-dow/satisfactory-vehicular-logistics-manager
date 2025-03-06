export const clientFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  if (res.status === 401) {
    if (!location.pathname.startsWith("/login")) {
      // Request is not authenticated. Try refreshing the auth token first
      const refreshRes = await fetch("/api/refresh", { method: "post" });
      if (refreshRes.status === 200) {
        // refresh worked, retry request.
        const newRes = await fetch(url, options);
        if (newRes.status === 401) {
          // refresh gave us a new auth token, but it's not working for some reason
          location.reload();
        } else {
          return newRes;
        }
      }
    }
  }
  // User is not authenticated

  return res;
};
