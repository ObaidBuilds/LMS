import Navbar from "@/components/ui/Navbar";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import StudentDashboard from "@/components/dashboards/StudentDashboard";

export default function Student() {
  return (
    <ProtectedRoute allowedRole="student">
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-6">
        <Navbar role={"Student"} />
        <StudentDashboard />
      </div>
    </ProtectedRoute>
  );
}
