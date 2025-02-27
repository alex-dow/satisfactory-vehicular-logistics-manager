export const clientFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  if (res.status === 401) {
    // User is not authenticated
    console.log("user not authenticated");
    if (!location.pathname.startsWith("/login")) {
      location.reload();
    }
  }

  return res;
};
