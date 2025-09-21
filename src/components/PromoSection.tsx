import { Gift, Calendar, Percent } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

export function PromoSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Festival Booking Promo */}
          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-8 h-8" />
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Limited Time
                </Badge>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">
                Book Festival Tours Now!
              </h3>
              
              <p className="text-orange-100 mb-6">
                Experience India's vibrant festivals like Diwali, Holi, and Dussehra with special tour packages
              </p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-center">
                  <div className="text-sm opacity-75">Oct</div>
                  <div className="text-xl font-bold">Diwali</div>
                </div>
                <div className="text-center">
                  <div className="text-sm opacity-75">Mar</div>
                  <div className="text-xl font-bold">Holi</div>
                </div>
                <div className="text-center">
                  <div className="text-sm opacity-75">Oct</div>
                  <div className="text-xl font-bold">Dussehra</div>
                </div>
              </div>
              
              <Button className="bg-white text-orange-500 hover:bg-gray-100">
                Book Festival Tours
              </Button>
            </CardContent>
          </Card>

          {/* Discount Promo */}
          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
            <CardContent className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <Gift className="w-8 h-8" />
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Special Offer
                </Badge>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">
                Get ₹2000 off using code
                <span className="bg-white/20 px-3 py-1 rounded-lg ml-2 text-yellow-200">
                  EXPLORE2K
                </span>
              </h3>
              
              <p className="text-purple-100 mb-6">
                Book your dream vacation and save big on your first booking with ExploreBharat
              </p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Percent className="w-5 h-5" />
                  <span className="text-sm">Valid till Dec 31, 2025</span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-purple-200 mb-2">
                  Authorized tourism partner
                </p>
                <Button className="bg-white text-purple-500 hover:bg-gray-100">
                  Use Code Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}