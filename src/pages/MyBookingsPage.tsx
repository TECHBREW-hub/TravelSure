import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Clock, 
  Phone, 
  Mail, 
  Download, 
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';

const statusColors = {
  confirmed: 'bg-blue-600',
  pending: 'bg-yellow-600',
  completed: 'bg-green-600',
  cancelled: 'bg-red-600'
};

const statusIcons = {
  confirmed: AlertCircle,
  pending: Clock,
  completed: CheckCircle,
  cancelled: XCircle
};

export function MyBookingsPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  
  const { state, cancelBooking } = useApp();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const bookings = state.bookings;

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const filterBookings = (status: string) => {
    if (status === 'all') return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Please login to view your bookings</h2>
          <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 text-white">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const BookingCard = ({ booking }: { booking: any }) => {
    const StatusIcon = statusIcons[booking.status] || AlertCircle;
    
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
          <div className="relative">
            <ImageWithFallback
              src={booking.item.image}
              alt={booking.item.name}
              className="w-full h-48 md:h-full object-cover"
            />
            <Badge className={`absolute top-3 left-3 ${statusColors[booking.status]} text-white flex items-center gap-1`}>
              <StatusIcon className="w-3 h-3" />
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
          
          <div className="md:col-span-3 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {booking.type.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-gray-500">#{booking.id}</span>
                </div>
                <h3 className="text-xl mb-2">{booking.item.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{booking.item.location || 'Multiple destinations'}</span>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-2xl font-medium">₹{booking.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-gray-500">Booked:</span>
                  <div>{new Date(booking.bookingDate).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-gray-500">Travel Date:</span>
                  <div>{new Date(booking.travelDate).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-gray-500">Guests:</span>
                  <div>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Booking Details - #{booking.id}</DialogTitle>
                      <DialogDescription>
                        View complete details of your booking including contact information and itinerary.
                      </DialogDescription>
                    </DialogHeader>
                    
                    {selectedBooking && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Booking Information</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Type:</strong> {selectedBooking.type}</div>
                              <div><strong>Status:</strong> {selectedBooking.status}</div>
                              <div><strong>Booking Date:</strong> {new Date(selectedBooking.bookingDate).toLocaleDateString()}</div>
                              <div><strong>Travel Date:</strong> {new Date(selectedBooking.travelDate).toLocaleDateString()}</div>
                              <div><strong>Guests:</strong> {selectedBooking.guests}</div>
                              <div><strong>Total Amount:</strong> ₹{selectedBooking.totalAmount.toLocaleString()}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Item Details</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Name:</strong> {selectedBooking.item.name}</div>
                              <div><strong>Location:</strong> {selectedBooking.item.location || 'Multiple destinations'}</div>
                              {selectedBooking.item.duration && (
                                <div><strong>Duration:</strong> {selectedBooking.item.duration}</div>
                              )}
                              <div><strong>Rating:</strong> {selectedBooking.item.rating} ⭐</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Included Services</h4>
                          <div className="text-sm space-y-1">
                            {selectedBooking.item.includes && selectedBooking.item.includes.map((include: string, index: number) => (
                              <div key={index}>• {include}</div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-4 border-t">
                          <Button variant="outline" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download Voucher
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Contact Support
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                
                {(booking.status === 'confirmed' || booking.status === 'pending') && (
                  <>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      E-Ticket
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                
                {booking.status === 'completed' && (
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Rate & Review
                  </Button>
                )}
              </div>
              
              {(booking.status === 'confirmed' || booking.status === 'pending') && (
                <div className="text-sm text-gray-600">
                  <div>Travel progress:</div>
                  <Progress value={booking.status === 'confirmed' ? 75 : 25} className="w-32 mt-1" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="mb-6">My Bookings</h1>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">All Bookings ({bookings.length})</TabsTrigger>
              <TabsTrigger value="confirmed">
                Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({bookings.filter(b => b.status === 'completed').length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="space-y-6">
                {filterBookings('all').map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="confirmed">
              <div className="space-y-6">
                {filterBookings('confirmed').map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
                {filterBookings('confirmed').length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No confirmed bookings found.</p>
                    <Link to="/packages">
                      <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                        Browse Packages
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="space-y-6">
                {filterBookings('completed').map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
                {filterBookings('completed').length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No completed bookings found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="cancelled">
              <div className="space-y-6">
                {filterBookings('cancelled').map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
                {filterBookings('cancelled').length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No cancelled bookings found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {filterBookings(selectedTab).length === 0 && selectedTab === 'all' && (
            <div className="text-center py-16">
              <div className="mb-4">
                <CalendarDays className="w-16 h-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-xl mb-2">No Bookings Yet</h3>
              <p className="text-gray-500 mb-6">Start planning your next adventure!</p>
              <div className="flex gap-4 justify-center">
                <Link to="/packages">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Browse Packages
                  </Button>
                </Link>
                <Link to="/hotels">
                  <Button variant="outline">
                    Explore Hotels
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}