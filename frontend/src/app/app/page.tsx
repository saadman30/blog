import { api } from "@/lib/api/client";
import WritePageClient from "./write/WritePageClient";

const AppRootPage = async () => {
  const editorData = await api.getPostEditorData("new");

  return <WritePageClient initialData={editorData} />;
};

export default AppRootPage;

