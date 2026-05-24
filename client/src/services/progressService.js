import api from "./api";

export async function fetchMyProgress() {
  const { data } = await api.get("/progress/me");
  return data.progress;
}
