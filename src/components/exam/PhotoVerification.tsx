
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Check, RefreshCw, User, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface PhotoVerificationProps {
  onComplete: (images: { selfie: string; environment: string }) => void;
  isVerificationTime?: boolean;
  onVerificationComplete?: () => void;
}

const PhotoVerification = ({ 
  onComplete, 
  isVerificationTime = false,
  onVerificationComplete 
}: PhotoVerificationProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImages, setCapturedImages] = useState<{
    selfie: string | null;
    environment: string | null;
  }>({
    selfie: null,
    environment: null
  });
  const [step, setStep] = useState<'intro' | 'selfie' | 'environment' | 'review' | 'complete'>(
    isVerificationTime ? 'selfie' : 'intro'
  );
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [isLoading, setIsLoading] = useState(false);

  // Start camera when needed
  useEffect(() => {
    if ((step === 'selfie' && cameraFacing === 'user') || 
        (step === 'environment' && cameraFacing === 'environment')) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [step, cameraFacing]);

  const startCamera = async () => {
    setIsLoading(true);
    try {
      if (stream) {
        stopCamera();
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please make sure your camera is connected and permissions are granted.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const switchCamera = async () => {
    const newFacing = cameraFacing === 'user' ? 'environment' : 'user';
    stopCamera();
    setCameraFacing(newFacing);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    
    if (step === 'selfie') {
      setCapturedImages(prev => ({ ...prev, selfie: imageDataUrl }));
      setStep('environment');
      setCameraFacing('environment');
    } else if (step === 'environment') {
      setCapturedImages(prev => ({ ...prev, environment: imageDataUrl }));
      setStep('review');
      stopCamera();
    }
  };

  const handleVerificationComplete = () => {
    if (!capturedImages.selfie || !capturedImages.environment) {
      toast({
        title: "Missing Images",
        description: "Both selfie and environment images are required.",
        variant: "destructive"
      });
      return;
    }
    
    stopCamera();
    
    if (isVerificationTime && onVerificationComplete) {
      onVerificationComplete();
      toast({
        title: "Verification Complete",
        description: "You may continue with your test."
      });
    } else {
      onComplete({ 
        selfie: capturedImages.selfie, 
        environment: capturedImages.environment 
      });
      setStep('complete');
    }
  };

  const resetProcess = () => {
    stopCamera();
    setCapturedImages({ selfie: null, environment: null });
    setStep('intro');
    setCameraFacing('user');
  };

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return (
          <div className="text-center">
            <div className="bg-eduPrimary p-6 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-4">Photo Verification Required</h3>
              <p className="mb-4">
                Before you begin the test, we need to verify your identity and environment:
              </p>
              <ul className="space-y-2 text-left list-disc list-inside mb-4">
                <li>We will take a photo of your face for identity verification</li>
                <li>We will also need a photo of your environment/workspace</li>
                <li>Your camera and permissions must be enabled</li>
                <li>This process may repeat during your test</li>
              </ul>
              <p className="text-sm italic">
                These images will only be used for verification purposes and will be handled according to our privacy policy.
              </p>
            </div>
            <Button onClick={() => setStep('selfie')} className="w-full">
              Continue to Verification
            </Button>
          </div>
        );
      
      case 'selfie':
      case 'environment':
        return (
          <div className="text-center">
            <h3 className="text-lg font-medium mb-3">
              {step === 'selfie' ? 'Take a Selfie' : 'Capture Your Environment'}
            </h3>
            <p className="mb-4 text-sm text-eduText-light">
              {step === 'selfie' 
                ? 'Position your face clearly in the frame' 
                : 'Show your desk and surrounding area'}
            </p>
            
            <div className="relative rounded-lg overflow-hidden bg-black mb-4">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <RefreshCw className="h-8 w-8 text-white animate-spin" />
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
              {step === 'selfie' && (
                <div className="absolute top-0 left-0 w-full h-full border-2 border-dashed border-white/60 rounded-lg pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-eduAccent" />
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mb-4">
              <Button 
                onClick={switchCamera}
                variant="outline" 
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Switch Camera
              </Button>
              <Button 
                onClick={captureImage} 
                variant="default"
                className="flex-1 bg-eduAccent hover:bg-eduAccent-dark"
                disabled={isLoading}
              >
                <Camera className="h-4 w-4 mr-2" />
                {step === 'selfie' ? 'Take Selfie' : 'Capture Environment'}
              </Button>
            </div>
          </div>
        );
      
      case 'review':
        return (
          <div className="text-center">
            <h3 className="text-lg font-medium mb-4">Review Your Images</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="mb-2 text-sm font-medium flex items-center justify-center">
                  <User className="h-4 w-4 mr-1" />
                  Selfie
                </p>
                {capturedImages.selfie ? (
                  <img 
                    src={capturedImages.selfie} 
                    alt="Captured selfie" 
                    className="w-full h-40 object-cover rounded-lg border border-eduPrimary-dark"
                  />
                ) : (
                  <div className="w-full h-40 bg-eduPrimary flex items-center justify-center rounded-lg">
                    <p>No selfie captured</p>
                  </div>
                )}
              </div>
              
              <div>
                <p className="mb-2 text-sm font-medium flex items-center justify-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Environment
                </p>
                {capturedImages.environment ? (
                  <img 
                    src={capturedImages.environment} 
                    alt="Captured environment" 
                    className="w-full h-40 object-cover rounded-lg border border-eduPrimary-dark"
                  />
                ) : (
                  <div className="w-full h-40 bg-eduPrimary flex items-center justify-center rounded-lg">
                    <p>No environment captured</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={resetProcess} 
                variant="outline"
                className="flex-1"
              >
                Retake Photos
              </Button>
              <Button 
                onClick={handleVerificationComplete}
                className="flex-1 bg-eduAccent hover:bg-eduAccent-dark"
                disabled={!capturedImages.selfie || !capturedImages.environment}
              >
                <Check className="h-4 w-4 mr-2" />
                {isVerificationTime ? 'Confirm Verification' : 'Submit & Continue'}
              </Button>
            </div>
          </div>
        );
      
      case 'complete':
        return (
          <div className="text-center">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-4">
              <Check className="h-12 w-12 mx-auto text-green-500 mb-2" />
              <h3 className="text-lg font-medium text-green-800">Verification Complete</h3>
              <p className="text-green-700">
                Your identity verification is complete. You may now proceed with your test.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {renderStep()}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoVerification;
