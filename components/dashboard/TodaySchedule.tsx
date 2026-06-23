export default function TodaySchedule() {
  const schedule = [
    {
      time: "09:00",
      title: "早餐",
      subtitle: "Cafe Layered",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
    },
    {
      time: "10:30",
      title: "景福宮",
      subtitle: "Gyeongbokgung Palace",
      image:
        "https://images.unsplash.com/photo-1538485399081-7c897c1ab8b3?q=80&w=800&auto=format&fit=crop",
    },
    {
      time: "13:00",
      title: "土俗村參雞湯",
      subtitle: "Tosokchon Samgyetang",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop",
    },
    {
      time: "15:30",
      title: "北村韓屋村",
      subtitle: "Bukchon Hanok Village",
      image:
        "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section className="bg-white rounded-[28px] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            今日行程
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Today Schedule
          </p>
        </div>

        <button className="text-sm text-gray-500">
          查看完整行程 →
        </button>
      </div>

      <div className="mt-6 space-y-5">
        {schedule.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <div className="flex items-center flex-1">
              <div className="w-16 shrink-0">
                <p className="font-semibold text-gray-900">
                  {item.time}
                </p>
              </div>

              <div className="mx-3 flex flex-col items-center">
                <div className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white" />

                {index !== schedule.length - 1 && (
                  <div className="w-[2px] h-14 bg-gray-200" />
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <img
              src={item.image}
              alt={item.title}
              className="
                w-20
                h-20
                object-cover
                rounded-2xl
                ml-3
              "
            />
          </div>
        ))}
      </div>
    </section>
  );
}