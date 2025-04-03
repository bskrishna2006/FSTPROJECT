import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { QrCode, Camera, Loader2, CheckCircle2, AlertCircle, Zap, ZapOff, CameraOff, Scan } from 'lucide-react';
import { QrReader } from 'react-qr-reader';

const AttendanceScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [hasFlash, setHasFlash] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Get available cameras
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      })
      .catch(error => {
        console.error('Error accessing cameras:', error);
        toast({
          title: 'Error',
          description: 'Failed to access camera devices',
          variant: 'destructive',
        });
      });
  }, []);

  const handleScan = async (data) => {
    if (!data) return;
    
    setIsLoading(true);
    try {
      // Parse the QR code data
      const [classId, timestamp, duration] = data.split('-');
      
      // Check if the QR code is still valid
      const now = new Date().getTime();
      const qrTimestamp = parseInt(timestamp);
      const validDuration = parseInt(duration) * 60 * 1000; // Convert minutes to milliseconds
      
      if (now - qrTimestamp > validDuration) {
        setScanStatus('error');
        toast({
          title: 'Error',
          description: 'This QR code has expired',
          variant: 'destructive',
        });
        return;
      }

      // TODO: Send attendance data to backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Increased delay for better UX
      
      setScanStatus('success');
      setScanCount(prev => prev + 1);
      toast({
        title: 'Success',
        description: 'Attendance marked successfully',
      });
    } catch (error) {
      setScanStatus('error');
      toast({
        title: 'Error',
        description: 'Failed to process QR code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error) => {
    console.error(error);
    setScanStatus('error');
    toast({
      title: 'Error',
      description: 'Failed to access camera',
      variant: 'destructive',
    });
  };

  const resetScanner = () => {
    setIsScanning(false);
    setScanStatus(null);
  };

  const toggleFlash = () => {
    setIsFlashOn(!isFlashOn);
    // TODO: Implement actual flash control
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <CardHeader className="pb-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CardTitle className="text-3xl font-bold flex items-center gap-3 text-primary">
              <QrCode className="h-7 w-7" />
              Scan Attendance QR Code
            </CardTitle>
            <p className="text-muted-foreground text-lg mt-2">
              Position the QR code within the frame to mark your attendance
            </p>
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="aspect-square relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <AnimatePresence mode="wait">
                {isScanning ? (
                  <motion.div
                    key="scanner"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="relative w-full h-full"
                  >
                    <QrReader
                      constraints={{ 
                        deviceId: selectedCamera,
                        facingMode: 'environment'
                      }}
                      onResult={(result, error) => {
                        if (result) {
                          handleScan(result?.text);
                        }
                        if (error) {
                          handleError(error);
                        }
                      }}
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="w-72 h-72 border-4 border-primary/30 rounded-2xl"
                        animate={{
                          scale: [1, 1.02, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.div
                        className="absolute w-64 h-64 border-2 border-primary/20 rounded-xl"
                        animate={{
                          scale: [1, 1.03, 1],
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                      />
                    </div>
                    <div className="absolute top-4 right-4 flex gap-3">
                      {cameras.length > 1 && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => {
                              const currentIndex = cameras.findIndex(cam => cam.deviceId === selectedCamera);
                              const nextIndex = (currentIndex + 1) % cameras.length;
                              setSelectedCamera(cameras[nextIndex].deviceId);
                            }}
                            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 shadow-lg"
                          >
                            <Camera className="h-5 w-5" />
                          </Button>
                        </motion.div>
                      )}
                      {hasFlash && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={toggleFlash}
                            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 shadow-lg"
                          >
                            {isFlashOn ? (
                              <Zap className="h-5 w-5" />
                            ) : (
                              <ZapOff className="h-5 w-5" />
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="status"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                  >
                    {scanStatus === 'success' ? (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
                      >
                        <CheckCircle2 className="h-20 w-20 text-green-500 mb-6" />
                        <h3 className="text-2xl font-semibold mb-3">Attendance Marked!</h3>
                        <p className="text-muted-foreground text-lg mb-6">Your attendance has been recorded successfully.</p>
                        <Button onClick={resetScanner} size="lg" className="text-base px-8">
                          Scan Again
                        </Button>
                      </motion.div>
                    ) : scanStatus === 'error' ? (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
                      >
                        <AlertCircle className="h-20 w-20 text-red-500 mb-6" />
                        <h3 className="text-2xl font-semibold mb-3">Scanning Failed</h3>
                        <p className="text-muted-foreground text-lg mb-6">There was an error processing the QR code.</p>
                        <Button onClick={resetScanner} size="lg" className="text-base px-8">
                          Try Again
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
                      >
                        <Scan className="h-20 w-20 text-primary mb-6" />
                        <h3 className="text-2xl font-semibold mb-3">Ready to Scan</h3>
                        <p className="text-muted-foreground text-lg">Click the button below to start scanning</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setIsScanning(!isScanning)}
                  disabled={isLoading}
                  size="lg"
                  className="text-lg font-medium px-12 py-6 w-56 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                    </>
                  )}
                </Button>
              </motion.div>
              {scanCount > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-base text-muted-foreground"
                >
                  Successfully scanned {scanCount} QR code{scanCount !== 1 ? 's' : ''}
                </motion.p>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AttendanceScanner; 