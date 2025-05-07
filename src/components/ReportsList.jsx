import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getReports, resolveReport } from "../utils/api";

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const reportsRes = await getReports();
        setReports(reportsRes);
      } catch (err) {
        toast.error(err.message || "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleResolveReport = async (reportId, status) => {
    try {
      await resolveReport(reportId, { status });
      const res = await getReports();
      setReports(res);
      toast.success(`Report ${status}`);
    } catch (err) {
      toast.error(err.message || "Failed to resolve report");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center animate-fade-in">
          Reports Management
        </h2>

        {loading ? (
          <div className="text-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            No reports available
          </p>
        ) : (
          <div className="grid gap-6">
            {reports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-2xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up"
              >
                <p className="text-gray-700">
                  <span className="font-medium">Post ID:</span> {report.post}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Reason:</span> {report.reason}
                </p>
                <p className="text-gray-700 mb-4">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={
                      report.status === "pending"
                        ? "text-yellow-500"
                        : report.status === "resolved"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {report.status}
                  </span>
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => handleResolveReport(report._id, "resolved")}
                    className={`px-4 py-2 rounded-full text-sm font-medium text-white transition-all duration-200 ${
                      report.status !== "pending"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    disabled={report.status !== "pending"}
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => handleResolveReport(report._id, "dismissed")}
                    className={`px-4 py-2 rounded-full text-sm font-medium text-white transition-all duration-200 ${
                      report.status !== "pending"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    disabled={report.status !== "pending"}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsList;
