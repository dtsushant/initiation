import axios from "axios";
import { Category, categoryDecoder } from "/@/types/category.ts";

export async function getCategory(
  categoryCode: string,
): Promise<Category | undefined> {
  try {
    const { data } = await axios.get(`categories/${categoryCode}`);
    if (!data || Object.keys(data).length === 0) {
      console.log("No category data returned");
      return undefined;
    }
    return categoryDecoder.verify(data);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error("Axios error:", e.message, e.response?.data);
    } else {
      console.error("Unknown error:", e.message);
    }
  }
  return undefined;
}
