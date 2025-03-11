import { useAuthStore } from "../store/authStore";
import Hero from "../components/hero";
import PopularEvents from "../components/PopularEvents";
import Offers from "../components/Offers";
import UpcomingEvents from "../components/UpcomingEvents";
import NewsLetter from "../components/NewsLetter";
const DashboardPage = () => {
  const { user } = useAuthStore();
  if (!user) {
    return (
      <div className="text-center text-gray-400">Loading user data...</div>
    );
  }

  return (
    <div>
      <Hero />
      <PopularEvents />
      <Offers />
      <UpcomingEvents />
      <NewsLetter />
    </div>
  );
};
export default DashboardPage;
