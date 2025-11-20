import { API_URL } from "./api";

export async function getFoods() {
  const res = await fetch(`${API_URL}/api/food`);
  return res.json();
}
