import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import AttendanceScanner from '../components/AttendanceScanner';
import { QrCode, Info } from 'lucide-react';

const QRScanner = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AttendanceScanner />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-primary">
              <Info className="h-6 w-6" />
              How to Mark Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    Step 1: Start Scanning
                  </h3>
                  <p className="text-muted-foreground">
                    Click the "Start Scanning" button to activate your device's camera.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    Step 2: Position QR Code
                  </h3>
                  <p className="text-muted-foreground">
                    Hold your device steady and position the QR code within the scanning frame.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    Step 3: Wait for Detection
                  </h3>
                  <p className="text-muted-foreground">
                    Keep the QR code in view until it's successfully detected by the scanner.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    Step 4: Confirmation
                  </h3>
                  <p className="text-muted-foreground">
                    You'll receive a confirmation message when your attendance is successfully recorded.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QRScanner; 