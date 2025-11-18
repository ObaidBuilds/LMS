import Navbar from "@/components/ui/Navbar";
import ProtectedRoute from "@/components/route/ProtectedRoute";

export default function TeacherLayout({ children }) {
  return (
    <ProtectedRoute allowedRole="teacher">
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
        <Navbar role={"Teacher"} />
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
