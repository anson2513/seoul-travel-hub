import Hero from "@/components/dashboard/Hero";
import TravelInfoCard from "@/components/dashboard/TravelInfoCard";
import TodaySchedule from "@/components/dashboard/TodaySchedule";
import EmergencyCard from "@/components/dashboard/EmergencyCard";
import BottomNav from "@/components/dashboard/BottomNav";
import { getSeoulWeather, getTwdKrwRate } from "@/lib/live-info";
import { flights, todaySchedulePreview } from "@/lib/travel-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [weather, exchange] = await Promise.all([
    getSeoulWeather(),
    getTwdKrwRate(),
  ]);

  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <div className="mx-auto max-w-[430px] overflow-hidden bg-[#F7F5F2]">

        <Hero />

        <div className="relative z-10 -mt-20 px-4">
          <TravelInfoCard
            exchange={exchange}
            flight={flights[0]}
            weather={weather}
          />
        </div>

        <div className="px-4 mt-4">
          <TodaySchedule items={todaySchedulePreview} />
        </div>

        <div className="px-4 mt-4 pb-36">
          <EmergencyCard />
        </div>

        <BottomNav />

      </div>
    </main>
  );
}
