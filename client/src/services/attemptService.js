import api from "./api";

export async function createAttempt(payload) {
  const { data } = await api.post("/attempts", payload);
  return data.attempt;
}
