import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  Search,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  Headphones,
  FileText
} from 'lucide-react';

const faqData = [
  {
    category: 'Booking',
    questions: [
      {
        question: 'How do I book a travel package?',
        answer: 'You can book a travel package by browsing our packages page, selecting your preferred package, choosing your travel dates, and completing the payment process. You will receive a confirmation email with your booking details.'
      },
      {
        question: 'Can I modify my booking after confirmation?',
        answer: 'Yes, you can modify your booking up to 48 hours before your travel date. Please contact our customer support team or use the "Manage Booking" feature in your account.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay.'
      },
      {
        question: 'Is my payment secure?',
        answer: 'Yes, all payments are processed through secure payment gateways with 256-bit SSL encryption. We never store your payment information on our servers.'
      }
    ]
  },
  {
    category: 'Travel',
    questions: [
      {
        question: 'What documents do I need for travel?',
        answer: 'For domestic travel, you need a valid government-issued photo ID (Aadhaar, Passport, Driving License, or Voter ID). For international travel, a valid passport and visa (if required) are mandatory.'
      },
      {
        question: 'What is your cancellation policy?',
        answer: 'Cancellation charges vary based on the type of booking and timing. Generally, cancellations made 7+ days before travel have minimal charges, while last-minute cancellations may have higher charges.'
      },
      {
        question: 'Do you provide travel insurance?',
        answer: 'Yes, we offer comprehensive travel insurance that covers trip cancellation, medical emergencies, lost baggage, and more. You can add insurance during the booking process.'
      }
    ]
  },
  {
    category: 'Account',
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click on "Sign Up" in the top right corner, provide your email and phone number, create a password, and verify your account through the OTP sent to your mobile number.'
      },
      {
        question: 'I forgot my password. How do I reset it?',
        answer: 'Click on "Forgot Password" on the login page, enter your registered email address, and follow the instructions in the password reset email.'
      },
      {
        question: 'How do I update my profile information?',
        answer: 'Log in to your account, go to "Profile Settings", and update your personal information, contact details, or preferences as needed.'
      }
    ]
  }
];

const supportChannels = [
  {
    icon: Phone,
    title: '24/7 Phone Support',
    description: 'Speak directly with our travel experts',
    contact: '+91 1800-123-4567',
    availability: 'Available 24/7',
    color: 'bg-blue-600'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Get instant help through live chat',
    contact: 'Start Chat',
    availability: 'Mon-Sun, 9 AM - 9 PM',
    color: 'bg-green-600'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us your queries via email',
    contact: 'support@traveltourism.com',
    availability: 'Response within 24 hours',
    color: 'bg-purple-600'
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp',
    description: 'Connect with us on WhatsApp',
    contact: '+91 98765-43210',
    availability: 'Mon-Sun, 9 AM - 9 PM',
    color: 'bg-green-500'
  }
];

export function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => 
    selectedCategory === 'all' || 
    category.category.toLowerCase() === selectedCategory ||
    category.questions.length > 0
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="mb-6">Help & Support</h1>
          <p className="text-gray-600 mb-8">
            We're here to help you with any questions or issues you may have. Browse our FAQ or contact our support team.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Frequently Asked Questions
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              Contact Support
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Travel Guides
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <div className="space-y-8">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48 bg-white">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* FAQ Sections */}
              {filteredFAQs.map((category) => (
                category.questions.length > 0 && (
                  <div key={category.category}>
                    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                      <Badge variant="secondary">{category.category}</Badge>
                      <span className="text-sm text-gray-500">
                        ({category.questions.length} questions)
                      </span>
                    </h2>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, index) => (
                        <AccordionItem key={index} value={`${category.category}-${index}`}>
                          <AccordionTrigger className="text-left hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )
              ))}

              {filteredFAQs.every(category => category.questions.length === 0) && (
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No FAQs found matching your search.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Support Channels */}
              <div>
                <h2 className="text-xl font-medium mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  {supportChannels.map((channel, index) => {
                    const Icon = channel.icon;
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`${channel.color} p-3 rounded-lg text-white`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium mb-1">{channel.title}</h3>
                              <p className="text-gray-600 text-sm mb-2">{channel.description}</p>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{channel.contact}</span>
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  {channel.availability}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-xl font-medium mb-6">Send us a Message</h2>
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Your Name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          required
                        />
                        <Input
                          type="email"
                          placeholder="Your Email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          required
                        />
                      </div>
                      
                      <Select 
                        value={contactForm.category} 
                        onValueChange={(value) => setContactForm({...contactForm, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking">Booking Issue</SelectItem>
                          <SelectItem value="payment">Payment Problem</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Input
                        placeholder="Subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        required
                      />
                      
                      <Textarea
                        placeholder="Describe your issue or question..."
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        required
                      />
                      
                      <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Booking Guide',
                  description: 'Step-by-step guide to booking your perfect trip',
                  icon: CheckCircle,
                  color: 'bg-green-600'
                },
                {
                  title: 'Travel Tips',
                  description: 'Essential tips for a safe and enjoyable journey',
                  icon: AlertCircle,
                  color: 'bg-yellow-600'
                },
                {
                  title: 'Payment Security',
                  description: 'Learn about our secure payment processes',
                  icon: CheckCircle,
                  color: 'bg-blue-600'
                },
                {
                  title: 'Cancellation Policy',
                  description: 'Understand our cancellation and refund policies',
                  icon: FileText,
                  color: 'bg-purple-600'
                },
                {
                  title: 'Travel Documents',
                  description: 'Required documents for domestic and international travel',
                  icon: FileText,
                  color: 'bg-indigo-600'
                },
                {
                  title: 'Emergency Contacts',
                  description: 'Important contacts for travel emergencies',
                  icon: Phone,
                  color: 'bg-red-600'
                }
              ].map((guide, index) => {
                const Icon = guide.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className={`${guide.color} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-medium mb-2">{guide.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                      <Button variant="outline" size="sm">
                        Read Guide
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}