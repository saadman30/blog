import { api } from "@/lib/api/client";
import WriteScreen from "@/components/organisms/WriteScreen";

const AppRootPage = async () => {
  const editorData = await api.getPostEditorData("new");

  return <WriteScreen initialData={editorData} />;
};

export default AppRootPage;

