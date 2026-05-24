import api from "./api";

export async function fetchLessons() {
  const { data } = await api.get("/lessons");
  return data.lessons;
}

export async function fetchLessonBySlug(slug) {
  const { data } = await api.get(`/lessons/${slug}`);
  return data.lesson;
}
