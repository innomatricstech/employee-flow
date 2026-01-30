import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { HiCalendar, HiSparkles } from "react-icons/hi";

const EmployeeHolidays = () => {

  const [holidays, setHolidays] = useState([]);
  const [nextHoliday, setNextHoliday] = useState(null);

 useEffect(() => {

  const unsubscribe = onSnapshot(
    collection(db, "holidays"),
    (snapshot) => {

      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by date
      list.sort((a,b) => new Date(a.date) - new Date(b.date));

      const today = new Date();
      today.setHours(0,0,0,0);

      // 🔥 Remove past holidays
      const upcomingList = list.filter(h => {
        const holidayDate = new Date(h.date);
        holidayDate.setHours(0,0,0,0);
        return holidayDate >= today;
      });

      setHolidays(upcomingList);

      // Next holiday
      setNextHoliday(upcomingList[0] || null);

    }
  );

  return () => unsubscribe();

}, []);


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Holiday Calendar
        </h1>
        <p className="text-gray-500 mt-2">
          View company & public holidays
        </p>
      </div>

      {/* NEXT HOLIDAY CARD */}
      {nextHoliday && (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100">Next Holiday</p>
              <h2 className="text-2xl font-bold mt-1">
                {nextHoliday.title}
              </h2>
              <p className="mt-2">
                {formatDate(nextHoliday.date)}
              </p>
            </div>

            <HiSparkles className="text-5xl opacity-80" />
          </div>
        </div>
      )}

      {/* HOLIDAY GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {holidays.map(h => (
          <div
            key={h.id}
            className="bg-white rounded-xl shadow hover:shadow-xl transition p-5 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <HiCalendar className="text-blue-600 text-xl" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  {h.title}
                </h3>
              </div>
            </div>

            <p className="text-gray-600 text-sm">
              {formatDate(h.date)}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
};

export default EmployeeHolidays;
