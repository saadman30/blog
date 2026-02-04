import { api } from "@/lib/api/client";
import SettingsScreen from "@/components/organisms/SettingsScreen";

const SettingsPage = async () => {
  const settings = await api.getAdminSettings();

  return <SettingsScreen settings={settings} />;
};

export default SettingsPage;

