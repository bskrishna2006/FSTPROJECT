import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';

// Dummy data for demonstration
const attendanceData = [
  { name: 'Mon', present: 65, absent: 35 },
  { name: 'Tue', present: 70, absent: 30 },
  { name: 'Wed', present: 75, absent: 25 },
  { name: 'Thu', present: 80, absent: 20 },
  { name: 'Fri', present: 85, absent: 15 },
];

const recentScans = [
  { id: 1, name: 'John Doe', time: '9:00 AM', status: 'present' },
  { id: 2, name: 'Jane Smith', time: '9:15 AM', status: 'present' },
  { id: 3, name: 'Mike Johnson', time: '9:30 AM', status: 'late' },
  { id: 4, name: 'Sarah Williams', time: '9:45 AM', status: 'absent' },
];

const stats = [
  {
    title: 'Total Students',
    value: '150',
    icon: Users,
    color: 'text-blue-500',
  },
  {
    title: 'Present Today',
    value: '120',
    icon: CheckCircle,
    color: 'text-green-500',
  },
  {
    title: 'Absent Today',
    value: '30',
    icon: XCircle,
    color: 'text-red-500',
  },
  {
    title: 'Late Today',
    value: '15',
    icon: Clock,
    color: 'text-yellow-500',
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#4ade80" />
                    <Bar dataKey="absent" fill="#f87171" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted"
                  >
                    <div>
                      <p className="font-medium">{scan.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {scan.time}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        scan.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : scan.status === 'late'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {scan.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 