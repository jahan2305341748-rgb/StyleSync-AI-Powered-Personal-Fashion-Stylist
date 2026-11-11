// Small helper to talk to the backend
export async function api(url, method = "GET", body = null) {
  const headers = { Authorization: "Bearer " + localStorage.getItem("token") };
  const options = { method, headers };

  if (body instanceof FormData) {
    options.body = body; // file upload
  } else if (body) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch("/api" + url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}
