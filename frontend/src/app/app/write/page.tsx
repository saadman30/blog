import { api } from "@/lib/api/client";
import type { PostEditorData } from "@/lib/types";
import WritePageClient from "./WritePageClient";

interface Props {
  searchParams?: Promise<{ postId?: string }>;
}

const resolveEditorData = async (
  params: { postId?: string } | undefined
): Promise<PostEditorData> => {
  const postIdParam = params?.postId;

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
  const params = await searchParams;
  const initialData = await resolveEditorData(params);

  return <WritePageClient initialData={initialData} />;
};

export default WritePage;
