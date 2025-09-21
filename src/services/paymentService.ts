// Razorpay Payment Integration
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number;
  currency: string;
  orderId: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: any) => void;
  modal: {
    ondismiss: () => void;
  };
}

export class PaymentService {
  private static instance: PaymentService;
  private razorpayLoaded = false;

  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  private async loadRazorpayScript(): Promise<void> {
    return new Promise((resolve) => {
      if (this.razorpayLoaded || window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.razorpayLoaded = true;
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        resolve();
      };
      document.body.appendChild(script);
    });
  }

  public async createOrder(amount: number, currency: string = 'INR'): Promise<string> {
    // In a real application, this would make an API call to your backend
    // For demo purposes, we'll generate a mock order ID
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public async initiatePayment(options: {
    amount: number;
    name: string;
    email: string;
    phone: string;
    description: string;
    onSuccess: (response: any) => void;
    onError: (error: any) => void;
    onDismiss: () => void;
  }): Promise<void> {
    try {
      await this.loadRazorpayScript();

      const orderId = await this.createOrder(options.amount);

      const paymentOptions: PaymentOptions = {
        amount: options.amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        orderId,
        name: 'Travel Sure',
        description: options.description,
        prefill: {
          name: options.name,
          email: options.email,
          contact: options.phone,
        },
        theme: {
          color: '#DC2626', // Red color matching the app theme
        },
        handler: (response) => {
          console.log('Payment successful:', response);
          options.onSuccess(response);
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            options.onDismiss();
          },
        },
      };

      const razorpay = new window.Razorpay(paymentOptions);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      options.onError(error);
    }
  }

  public async verifyPayment(paymentId: string, orderId: string): Promise<boolean> {
    // In a real application, this would verify the payment with your backend
    // For demo purposes, we'll always return true
    console.log('Verifying payment:', { paymentId, orderId });
    return true;
  }
}

export const paymentService = PaymentService.getInstance();
