import { api } from "@/lib/api/client";
import InsightsScreen from "@/components/organisms/InsightsScreen";

const InsightsPage = async () => {
  const insights = await api.getInsights();

  return <InsightsScreen insights={insights} />;
};

export default InsightsPage;

