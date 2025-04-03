import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';
import { Download, RefreshCw, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const QRGenerator = () => {
  const [classId, setClassId] = useState('');
  const [duration, setDuration] = useState('30'); // in minutes
  const [qrData, setQrData] = useState('');
  const { toast } = useToast();

  const generateQR = () => {
    if (!classId) {
      toast({
        title: 'Error',
        description: 'Please select a class',
        variant: 'destructive',
      });
      return;
    }

    // Generate a unique attendance code with timestamp and class ID
    const timestamp = new Date().getTime();
    const attendanceCode = `${classId}-${timestamp}-${duration}`;
    setQrData(attendanceCode);

    toast({
      title: 'Success',
      description: 'QR Code generated successfully',
    });
  };

  const downloadQR = () => {
    if (!qrData) return;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;
    
    // Draw white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create a temporary SVG element
    const svgElement = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // Create an image from the SVG
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `attendance-qr-${classId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold flex items-center gap-2 text-primary">
          <QrCode className="h-6 w-6" />
          Generate Attendance QR Code
        </CardTitle>
        <p className="text-muted-foreground text-base">
          Create a QR code for students to scan and mark their attendance
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <label className="text-base font-medium">Select Class</label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs101">Computer Science 101</SelectItem>
                  <SelectItem value="math101">Mathematics 101</SelectItem>
                  <SelectItem value="phy101">Physics 101</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-base font-medium">Duration (minutes)</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={generateQR} 
              size="lg"
              className="text-base font-medium px-6"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Generate QR Code
            </Button>
            {qrData && (
              <Button 
                onClick={downloadQR} 
                variant="outline" 
                size="lg"
                className="text-base font-medium px-6"
              >
                <Download className="mr-2 h-5 w-5" />
                Download QR Code
              </Button>
            )}
          </div>

          {qrData && (
            <div className="flex flex-col items-center space-y-6 pt-4">
              <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <QRCodeSVG
                  id="qr-code"
                  value={qrData}
                  size={300}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="text-center">
                <p className="text-base font-medium">
                  Valid for {duration} minutes
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Class: {classId.toUpperCase()}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QRGenerator; 