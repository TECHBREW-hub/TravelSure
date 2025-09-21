import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  QrCode,
  Shield,
  Clock,
  CheckCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../hooks/useAuth';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentMethod: string, paymentDetails: any) => void;
  amount: number;
  bookingDetails: {
    itemName: string;
    itemType: 'package' | 'hotel' | 'experience';
    duration?: string;
    guests: number;
  };
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  processingTime: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'upi',
    name: 'UPI',
    icon: Smartphone,
    description: 'Pay instantly using UPI apps like GPay, PhonePe, Paytm',
    processingTime: 'Instant'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: Building2,
    description: 'Pay securely through your bank\'s internet banking',
    processingTime: '2-5 minutes'
  },
  {
    id: 'card',
    name: 'Debit/Credit Card',
    icon: CreditCard,
    description: 'Pay using your debit or credit card',
    processingTime: 'Instant'
  }
];

const popularBanks = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'IDBI Bank',
  'Indian Overseas Bank'
];

export function PaymentModal({ isOpen, onClose, onPaymentSuccess, amount, bookingDetails }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  const [currentStep, setCurrentStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  
  // UPI form state
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('');
  
  // Net Banking form state
  const [selectedBank, setSelectedBank] = useState('');
  const [bankUserId, setBankUserId] = useState('');
  const [bankPassword, setBankPassword] = useState('');
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const resetForm = () => {
    setCurrentStep('method');
    setSelectedMethod('upi');
    setIsProcessing(false);
    setUpiId('');
    setSelectedUpiApp('');
    setSelectedBank('');
    setBankUserId('');
    setBankPassword('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    switch (selectedMethod) {
      case 'upi':
        if (!upiId || !upiId.includes('@')) {
          toast.error('Please enter a valid UPI ID');
          return false;
        }
        break;
      case 'netbanking':
        if (!selectedBank || !bankUserId) {
          toast.error('Please fill in all banking details');
          return false;
        }
        break;
      case 'card':
        if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
          toast.error('Please fill in all card details');
          return false;
        }
        if (cardNumber.replace(/\s/g, '').length < 16) {
          toast.error('Please enter a valid card number');
          return false;
        }
        break;
    }
    return true;
  };

  const processPayment = async () => {
    if (!validateForm()) return;

    if (!user) {
      toast.error('User not found. Please login again.');
      return;
    }

    setCurrentStep('processing');
    setIsProcessing(true);

    try {
      await paymentService.initiatePayment({
        amount,
        name: user.name,
        email: user.email,
        phone: user.phone,
        description: `Payment for ${bookingDetails.itemName}`,
        onSuccess: (response) => {
          console.log('Payment successful:', response);
          const paymentDetails = {
            method: selectedMethod,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            ...(selectedMethod === 'upi' && { upiId, upiApp: selectedUpiApp }),
            ...(selectedMethod === 'netbanking' && { bank: selectedBank, userId: bankUserId }),
            ...(selectedMethod === 'card' && { 
              cardNumber: `****-****-****-${cardNumber.slice(-4)}`, 
              cardholderName 
            }),
            transactionId: response.razorpay_payment_id,
            amount,
            timestamp: new Date().toISOString()
          };

          setCurrentStep('success');
          
          setTimeout(() => {
            onPaymentSuccess(selectedMethod, paymentDetails);
            handleClose();
          }, 2000);
        },
        onError: (error) => {
          console.error('Payment failed:', error);
          toast.error('Payment failed. Please try again.');
          setCurrentStep('details');
          setIsProcessing(false);
        },
        onDismiss: () => {
          console.log('Payment cancelled by user');
          setCurrentStep('details');
          setIsProcessing(false);
        }
      });
    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setCurrentStep('details');
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3>Choose Payment Method</h3>
        <p className="text-gray-600">Pay ₹{amount.toLocaleString()} for {bookingDetails.itemName}</p>
      </div>

      <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card key={method.id} className={`cursor-pointer transition-colors ${
              selectedMethod === method.id ? 'ring-2 ring-red-500 bg-red-50' : 'hover:bg-gray-50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={method.id} className="cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-red-600" />
                        <span className="font-medium">{method.name}</span>
                        <Badge variant={method.processingTime === 'Instant' ? 'default' : 'secondary'} className="text-xs">
                          {method.processingTime}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </RadioGroup>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => setCurrentStep('details')}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentStep('method')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <span className="text-sm text-gray-600">Pay with</span>
          <h3 className="flex items-center gap-2">
            {React.createElement(paymentMethods.find(m => m.id === selectedMethod)?.icon || CreditCard, { className: "w-5 h-5" })}
            {paymentMethods.find(m => m.id === selectedMethod)?.name}
          </h3>
        </div>
      </div>

      {selectedMethod === 'upi' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="upi-id">UPI ID</Label>
            <Input
              id="upi-id"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="upi-app">Preferred UPI App (Optional)</Label>
            <Select value={selectedUpiApp} onValueChange={setSelectedUpiApp}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select UPI App" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpay">Google Pay</SelectItem>
                <SelectItem value="phonepe">PhonePe</SelectItem>
                <SelectItem value="paytm">Paytm</SelectItem>
                <SelectItem value="bhim">BHIM</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <QrCode className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-800">You'll be redirected to your UPI app to complete the payment</span>
          </div>
        </div>
      )}

      {selectedMethod === 'netbanking' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="bank">Select Bank</Label>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose your bank" />
              </SelectTrigger>
              <SelectContent>
                {popularBanks.map((bank) => (
                  <SelectItem key={bank} value={bank.toLowerCase().replace(/\s+/g, '')}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="bank-userid">User ID</Label>
            <Input
              id="bank-userid"
              placeholder="Enter your internet banking user ID"
              value={bankUserId}
              onChange={(e) => setBankUserId(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-800">You'll be redirected to your bank's secure login page</span>
          </div>
        </div>
      )}

      {selectedMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="card-number">Card Number</Label>
            <Input
              id="card-number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                  }
                  setExpiryDate(value);
                }}
                maxLength={5}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                maxLength={3}
                type="password"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="cardholder-name">Cardholder Name</Label>
            <Input
              id="cardholder-name"
              placeholder="Name as on card"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setCurrentStep('method')}>
          Back
        </Button>
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={processPayment}
        >
          Pay ₹{amount.toLocaleString()}
        </Button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center py-8">
      <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
      <h3 className="mb-2">Processing Payment</h3>
      <p className="text-gray-600 mb-4">Please don't close this window while we process your payment</p>
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Clock className="w-4 h-4" />
        This usually takes a few seconds
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
      <h3 className="text-green-600 mb-2">Payment Successful!</h3>
      <p className="text-gray-600 mb-4">Your booking has been confirmed</p>
      <div className="text-sm text-gray-500">
        Redirecting to booking details...
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={!isProcessing ? handleClose : undefined}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'method' && 'Payment Method'}
            {currentStep === 'details' && 'Payment Details'}
            {currentStep === 'processing' && 'Processing Payment'}
            {currentStep === 'success' && 'Payment Complete'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'method' && 'Choose how you\'d like to pay for your booking'}
            {currentStep === 'details' && 'Enter your payment information securely'}
            {currentStep === 'processing' && 'We\'re processing your payment securely'}
            {currentStep === 'success' && 'Your payment has been processed successfully'}
          </DialogDescription>
        </DialogHeader>
        
        {currentStep === 'method' && renderMethodSelection()}
        {currentStep === 'details' && renderPaymentDetails()}
        {currentStep === 'processing' && renderProcessing()}
        {currentStep === 'success' && renderSuccess()}
      </DialogContent>
    </Dialog>
  );
}