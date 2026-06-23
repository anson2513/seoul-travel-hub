import Hero from "@/components/dashboard/Hero";
import TravelInfoCard from "@/components/dashboard/TravelInfoCard";
import TodaySchedule from "@/components/dashboard/TodaySchedule";
import EmergencyCard from "@/components/dashboard/EmergencyCard";
import BottomNav from "@/components/dashboard/BottomNav";

export default function Home() {
  return (
    <main className="bg-[#F7F5F2] min-h-screen">
      <div className="max-w-[430px] mx-auto">

        <Hero />

        <div className="-mt-16 relative z-10 px-4">
          <TravelInfoCard />
        </div>

        <div className="px-4 mt-4">
          <TodaySchedule />
        </div>

        <div className="px-4 mt-4 pb-36">
          <EmergencyCard />
        </div>

        <BottomNav />

      </div>
    </main>
  );
}