import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Phone,
  Mail,
  Clock,
  Star,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'suggestion';
  suggestions?: string[];
}

interface QuickReply {
  text: string;
  action: string;
}

const quickReplies: QuickReply[] = [
  { text: "Book a package", action: "book_package" },
  { text: "Find hotels", action: "find_hotels" },
  { text: "Payment help", action: "payment_help" },
  { text: "Cancel booking", action: "cancel_booking" },
  { text: "Travel tips", action: "travel_tips" },
  { text: "Contact support", action: "contact_support" }
];

const botResponses: Record<string, string[]> = {
  greeting: [
    "Hello! 👋 Welcome to Travel Sure! I'm here to help you plan your perfect trip. What can I assist you with today?",
    "Hi there! 🌟 I'm your travel assistant. Whether you're looking for packages, hotels, or need help with bookings, I'm here to help!",
    "Welcome to Travel Sure! ✈️ Ready to explore incredible destinations? How can I make your travel planning easier?"
  ],
  book_package: [
    "Great choice! 🎯 I can help you find the perfect travel package. We have amazing deals for destinations like Goa, Kerala, Rajasthan, and the Himalayas. Would you like to see packages for a specific destination or budget range?",
    "Perfect! 📦 Our travel packages include accommodation, meals, and guided tours. Popular packages range from ₹12,000 to ₹35,000. Which type of experience interests you - beaches, mountains, heritage, or adventure?"
  ],
  find_hotels: [
    "🏨 I'd be happy to help you find the perfect accommodation! We have luxury hotels, heritage properties, and budget-friendly options across India. Which city are you planning to visit?",
    "Excellent! 🌟 We have partnerships with 500+ hotels across India. From 5-star luxury in Delhi to charming heritage hotels in Udaipur. What's your preferred location and budget?"
  ],
  payment_help: [
    "💳 We offer multiple secure payment options including UPI, Net Banking, and Credit/Debit cards. All payments are processed through secure gateways. Do you need help with a specific payment issue?",
    "🔒 Your payment security is our priority! We accept UPI (GPay, PhonePe, Paytm), all major banks for net banking, and Visa/Mastercard. Is there a particular payment method you'd prefer?"
  ],
  cancel_booking: [
    "😔 Sorry to hear you need to cancel. I can help you with that! Please provide your booking ID and I'll check the cancellation policy. Most bookings can be cancelled up to 48 hours before travel.",
    "No worries! 🔄 To cancel your booking, I'll need your booking reference number. Depending on when you cancel, you may be eligible for a full or partial refund."
  ],
  travel_tips: [
    "🎒 Here are some essential travel tips for India:\n• Carry a valid ID always\n• Keep emergency contacts handy\n• Pack according to season\n• Try local cuisine safely\n• Respect local customs\n\nWould you like tips for a specific destination?",
    "✨ Pro travel tips:\n• Book accommodations in advance during peak season\n• Carry both cash and cards\n• Download offline maps\n• Pack light but include essentials\n• Keep copies of important documents\n\nNeed destination-specific advice?"
  ],
  contact_support: [
    "📞 You can reach our support team:\n• Phone: +91 1800-XXX-XXXX (24/7)\n• Email: support@travelsure.com\n• Live Chat: Right here with me!\n\nI'm available 24/7 to help with your queries. What specific help do you need?",
    "🆘 Our support team is always ready to help:\n• Emergency helpline: +91 1800-XXX-XXXX\n• WhatsApp: +91 98765-XXXXX\n• Email: help@travelsure.com\n\nOr continue chatting with me for immediate assistance!"
  ],
  destinations: [
    "🏖️ Popular destinations we cover:\n• Goa - Beaches & nightlife\n• Kerala - Backwaters & hill stations\n• Rajasthan - Heritage & culture\n• Himachal - Mountains & adventure\n• Uttarakhand - Spiritual & nature\n\nWhich destination interests you?",
    "🗺️ We offer packages to:\n• Golden Triangle (Delhi-Agra-Jaipur)\n• South India (Chennai-Madurai-Kochi)\n• Northeast (Assam-Meghalaya-Sikkim)\n• Ladakh & Kashmir\n• Andaman Islands\n\nWant details on any specific region?"
  ],
  pricing: [
    "💰 Our package pricing:\n• Budget packages: ₹8,000 - ₹15,000\n• Standard packages: ₹15,000 - ₹25,000\n• Premium packages: ₹25,000 - ₹40,000\n• Luxury packages: ₹40,000+\n\nPrices include accommodation, meals, and activities. Need a quote for a specific destination?",
    "💵 Hotel pricing ranges:\n• Budget hotels: ₹2,000 - ₹5,000/night\n• Mid-range hotels: ₹5,000 - ₹10,000/night\n• Luxury hotels: ₹10,000+/night\n\nPrices vary by location and season. Which city are you looking at?"
  ]
};

const fallbackResponses = [
  "I'm here to help! Could you please rephrase your question or choose from the quick options below?",
  "I didn't quite understand that. Let me know how I can assist you with your travel plans!",
  "I'm still learning! Can you try asking about bookings, destinations, or payments?",
  "Let me connect you with the right information. What specific travel service can I help you with?"
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! 👋 Welcome to Travel Sure! I'm here to help you plan your perfect trip. What can I assist you with today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const getRandomResponse = (category: string): string => {
    const responses = botResponses[category] || fallbackResponses;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return getRandomResponse('greeting');
    }
    if (message.includes('package') || message.includes('tour')) {
      return getRandomResponse('book_package');
    }
    if (message.includes('hotel') || message.includes('accommodation')) {
      return getRandomResponse('find_hotels');
    }
    if (message.includes('payment') || message.includes('pay') || message.includes('upi') || message.includes('card')) {
      return getRandomResponse('payment_help');
    }
    if (message.includes('cancel') || message.includes('refund')) {
      return getRandomResponse('cancel_booking');
    }
    if (message.includes('tip') || message.includes('advice') || message.includes('suggest')) {
      return getRandomResponse('travel_tips');
    }
    if (message.includes('support') || message.includes('help') || message.includes('contact')) {
      return getRandomResponse('contact_support');
    }
    if (message.includes('destination') || message.includes('place') || message.includes('where')) {
      return getRandomResponse('destinations');
    }
    if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
      return getRandomResponse('pricing');
    }
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  };

  const handleQuickReply = (action: string) => {
    const response = getRandomResponse(action);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: quickReplies.find(qr => qr.action === action)?.text || '',
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mb-4"
          >
            <Card className={`w-80 md:w-96 shadow-2xl border-0 bg-white ${isMinimized ? 'h-16' : 'h-[500px]'} transition-all duration-300`}>
              <CardHeader className="p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">Travel Sure Assistant</CardTitle>
                      <div className="flex items-center gap-1 text-xs text-white/80">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Online
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      onClick={minimizeChat}
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      onClick={toggleChat}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {!isMinimized && (
                <CardContent className="p-0 flex flex-col h-[436px]">
                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.sender === 'user' 
                                ? 'bg-red-600 text-white' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {message.sender === 'user' ? (
                                <User className="w-4 h-4" />
                              ) : (
                                <Bot className="w-4 h-4" />
                              )}
                            </div>
                            <div className={`rounded-2xl px-4 py-2 ${
                              message.sender === 'user'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <p className="text-sm whitespace-pre-line">{message.text}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender === 'user' ? 'text-red-100' : 'text-gray-500'
                              }`}>
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex gap-2 max-w-[80%]">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Bot className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="bg-gray-100 rounded-2xl px-4 py-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Quick Replies */}
                  <div className="px-4 py-2 border-t bg-gray-50">
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.slice(0, 3).map((reply) => (
                        <Button
                          key={reply.action}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => handleQuickReply(reply.action)}
                        >
                          {reply.text}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex gap-2">
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1"
                        disabled={isTyping}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        className="bg-red-600 hover:bg-red-700 text-white px-3"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Notification badge for new messages when closed */}
      {!isOpen && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs animate-pulse">
          !
        </div>
      )}
    </div>
  );
}