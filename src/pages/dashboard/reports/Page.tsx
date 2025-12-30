import { useEffect, useState } from "react";
import { adminService } from "../../../services";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import dayjs from "dayjs";

interface Patient {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const Page = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await adminService.getAllPatients();
        setPatients(res.data?.patients || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load patients data");
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!patients.length) return <div className="p-6 text-center">No patients to display</div>;

  // Group patients by day
  const groupedData: Record<string, number> = {};
  patients.forEach((patient) => {
    const day = dayjs(patient.createdAt).format("YYYY-MM-DD");
    groupedData[day] = (groupedData[day] || 0) + 1;
  });

  // Sort dates and fill missing days
  const dates = Object.keys(groupedData).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  if (dates.length === 0) return null;

  const startDate = dayjs(dates[0]);
  const endDate = dayjs(dates[dates.length - 1]);

  // Fill in all days
  const chartDataRaw: { date: string; count: number }[] = [];
  let currentDate = startDate;
  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    const dateStr = currentDate.format("YYYY-MM-DD");
    chartDataRaw.push({
      date: dateStr,
      count: groupedData[dateStr] || 0,
    });
    currentDate = currentDate.add(1, "day");
  }

  // Make cumulative
  let cumulative = 0;
  const chartData: { date: string; count: number }[] = [];
  for (let i = 0; i < chartDataRaw.length; i++) {
    cumulative += chartDataRaw[i].count;
    chartData.push({ date: chartDataRaw[i].date, count: cumulative });
  }

  // Smooth the data by interpolating intermediate points (simple averaging)
  const smoothData: { date: string; count: number }[] = [];
  for (let i = 0; i < chartData.length - 1; i++) {
    smoothData.push(chartData[i]);
    // Add an intermediate point halfway between current and next
    const midCount = (chartData[i].count + chartData[i + 1].count) / 2;
    smoothData.push({ date: chartData[i].date + " (mid)", count: midCount });
  }
  smoothData.push(chartData[chartData.length - 1]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Reports</h1>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Patient Registrations</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={smoothData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Page;
