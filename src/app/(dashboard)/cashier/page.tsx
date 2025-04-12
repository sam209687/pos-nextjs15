// app/(dashboard)/cashier/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export default async function CashierDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const user = session ? JSON.parse(session).user : null;

  if (!user || user.role !== 'cashier') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Cashier Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Process Payments</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Handle customer transactions.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">View Transactions</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Check daily transaction history.</p>
          </div>
        </div>
      </div>
    </div>
  );
}