import { api } from "@/lib/api/client";
import MediaScreen from "@/components/organisms/MediaScreen";

const MediaPage = async () => {
  const items = await api.listMedia();

  return <MediaScreen items={items} />;
};

export default MediaPage;

