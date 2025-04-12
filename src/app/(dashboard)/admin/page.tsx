// app/(dashboard)/admin/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppSidebar from '../_components/dash-sidebar';


export default async function AdminDashboard() {
     const cookieStore = await cookies();
     const session = cookieStore.get('session')?.value;
     const user = session ? JSON.parse(session).user : null;
  
     if (!user || user.role !== 'admin') {
       redirect('/login');
     }

     // Sample data (replace with real data later)
  const dashboardData = {
    totalSales: "$12,345",
    totalUsers: "25",
    messages: "8",
    totalRevenue: "$45,678",
  };
  
     return (
      <div className="flex min-h-screen">
      
      <AppSidebar />

     

      {/* Main Panel */}
      <main className="dark:bg-gray-800 flex-1 p-6 ">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Sales Card */}
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dashboardData.totalSales}</p>
              <p className="text-sm text-gray-500">Today’s sales</p>
            </CardContent>
          </Card>

          {/* Total Users Card */}
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dashboardData.totalUsers}</p>
              <p className="text-sm text-gray-500">Active cashiers</p>
            </CardContent>
          </Card>

          {/* Messages Card */}
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dashboardData.messages}</p>
              <p className="text-sm text-gray-500">Unread messages</p>
            </CardContent>
          </Card>

          {/* Total Revenue Card */}
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dashboardData.totalRevenue}</p>
              <p className="text-sm text-gray-500">This month</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
     
     )

    }








// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';


// export default async function AdminDashboard() {
//   const cookieStore = await cookies();
//   const session = cookieStore.get('session')?.value;
//   const user = session ? JSON.parse(session).user : null;

//   if (!user || user.role !== 'admin') {
//     redirect('/login');
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
     
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Admin Dashboard</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-md">
//             <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Manage Users</h2>
//             <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage all system users.</p>
//           </div>
//           <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-md">
//             <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Reports</h2>
//             <p className="text-gray-600 dark:text-gray-400 mt-2">Generate and view system reports.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }