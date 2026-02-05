import { api } from "@/lib/api/client";
import type { PostEditorData } from "@/lib/types";
import WritePageClient from "./WritePageClient";

interface Props {
  searchParams?: {
    postId?: string;
  };
}

const resolveEditorData = async (
  searchParams: Props["searchParams"]
): Promise<PostEditorData> => {
  const postIdParam = searchParams?.postId;

  if (!postIdParam) {
    return api.getPostEditorData("new");
  }

  const parsed = Number.parseInt(postIdParam, 10);

  if (Number.isNaN(parsed)) {
    return api.getPostEditorData("new");
  }

  return api.getPostEditorData(parsed);
};

const WritePage = async ({ searchParams }: Props) => {
  const initialData = await resolveEditorData(searchParams);

  return <WritePageClient initialData={initialData} />;
};

export default WritePage;
