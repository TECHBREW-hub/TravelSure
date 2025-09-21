import React, { useState, useMemo } from 'react';
import { MapPin, ArrowRight, Star, Search, X, Shield, AlertTriangle, Users, Clock, Info, UserCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { ImageWithFallback } from './figma/ImageWithFallback';

const cities = [
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'National Capital Territory',
    image: 'https://images.unsplash.com/photo-1735369931191-1d52e3a3d792?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxoaSUyMGluZGlhJTIwZ2F0ZSUyMHRvdXJpc218ZW58MXx8fHwxNzU4MDEyMzA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    highlights: ['Red Fort', 'India Gate', 'Lotus Temple'],
    rating: 4.6,
    packages: 28,
    safety: {
      status: 'caution',
      score: 7.2,
      lastUpdated: '2 hours ago',
      alerts: ['Air quality moderate', 'Traffic congestion high'],
      userReports: 142,
      recentFeedback: [
        { user: 'TravellerA', rating: 4, comment: 'Great monuments but air quality could be better. Stay hydrated!', time: '1 day ago' },
        { user: 'ExplorerB', rating: 3, comment: 'Beautiful city but very crowded. Keep valuables safe.', time: '3 days ago' }
      ]
    },
    womenSafety: {
      status: 'caution',
      score: 6.8,
      lastUpdated: '1 hour ago',
      alerts: ['Avoid isolated areas after dark', 'Use trusted transportation services'],
      userReports: 89,
      recentFeedback: [
        { user: 'SoloFemaleT', rating: 3, comment: 'Metro is safe during day. Book women-only coaches. Avoid street food vendors alone at night.', time: '6 hours ago' },
        { user: 'WomenTraveler', rating: 4, comment: 'Tourist areas are well-patrolled. Stay in groups when exploring markets.', time: '1 day ago' }
      ],
      safeAccommodations: ['Hotel chains in Connaught Place', 'Women-only hostels in Paharganj', 'PG accommodations near metro stations'],
      emergencyContacts: ['Women Helpline: 181', 'Delhi Police: 100', 'Tourist Helpline: 1363']
    }
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1625731226721-b4d51ae70e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdW1iYWklMjBnYXRld2F5JTIwaW5kaWElMjB0b3VyaXNtfGVufDF8fHx8MTc1ODAxMjMxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    highlights: ['Gateway of India', 'Marine Drive', 'Bollywood'],
    rating: 4.5,
    packages: 22,
    safety: {
      status: 'safe',
      score: 8.4,
      lastUpdated: '1 hour ago',
      alerts: [],
      userReports: 98,
      recentFeedback: [
        { user: 'CityLover', rating: 5, comment: 'Very safe for tourists. Police presence is good around major attractions.', time: '2 hours ago' },
        { user: 'SoloTraveller', rating: 4, comment: 'Felt safe even at night near Marine Drive. Locals are helpful.', time: '1 day ago' }
      ]
    },
    womenSafety: {
      status: 'safe',
      score: 8.7,
      lastUpdated: '45 mins ago',
      alerts: [],
      userReports: 156,
      recentFeedback: [
        { user: 'FemaleExplorer', rating: 5, comment: 'Very safe for women. Local trains have ladies compartments. Marine Drive is safe even for evening walks.', time: '3 hours ago' },
        { user: 'SoloWomanT', rating: 4, comment: 'Locals are respectful and helpful. Stay in South Mumbai for better safety. Taxis are reliable.', time: '8 hours ago' }
      ],
      safeAccommodations: ['Hotels in Colaba and Fort area', 'YWCA hostels', 'Women-only PGs in Bandra and Andheri'],
      emergencyContacts: ['Women Helpline: 103', 'Mumbai Police: 100', 'Tourist Helpline: 1372']
    }
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1640931897978-ec4aa942f188?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWlwdXIlMjBwaW5rJTIwY2l0eSUyMHJhamFzdGhhbnxlbnwxfHx8fDE3NTgwMTIzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    highlights: ['Hawa Mahal', 'Amber Fort', 'City Palace'],
    rating: 4.8,
    packages: 18,
    safety: {
      status: 'safe',
      score: 8.8,
      lastUpdated: '30 mins ago',
      alerts: ['High temperatures - stay hydrated'],
      userReports: 156,
      recentFeedback: [
        { user: 'HistoryBuff', rating: 5, comment: 'Excellent tourist police support. Very safe and well-maintained attractions.', time: '4 hours ago' },
        { user: 'FamilyTrip', rating: 5, comment: 'Perfect for families. Guides are trustworthy and helpful.', time: '6 hours ago' }
      ]
    },
    womenSafety: {
      status: 'safe',
      score: 8.2,
      lastUpdated: '25 mins ago',
      alerts: ['Dress modestly when visiting temples and traditional areas'],
      userReports: 124,
      recentFeedback: [
        { user: 'CulturalTraveler', rating: 4, comment: 'Tourist areas are very safe. Local women are friendly and helpful. Book palace tours through official guides.', time: '2 hours ago' },
        { user: 'WomenBackpacker', rating: 5, comment: 'Felt very welcomed. Rajasthani hospitality is genuine. Stay in heritage hotels for authentic and safe experience.', time: '5 hours ago' }
      ],
      safeAccommodations: ['Heritage hotels in old city', 'Women-friendly hostels near City Palace', 'Trusted homestays in residential areas'],
      emergencyContacts: ['Women Helpline: 181', 'Rajasthan Police: 100', 'Tourist Helpline: 1363']
    }
  },
  {
    id: 'agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1701282848070-61576f742af4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JhJTIwdGFqJTIwbWFoYWwlMjB0b3VyaXNtfGVufDF8fHx8MTc1ODAxMjMyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    highlights: ['Taj Mahal', 'Agra Fort', 'Mehtab Bagh'],
    rating: 4.9,
    packages: 15,
    safety: {
      status: 'safe',
      score: 8.6,
      lastUpdated: '45 mins ago',
      alerts: [],
      userReports: 203,
      recentFeedback: [
        { user: 'TajVisitor', rating: 5, comment: 'Excellent security at Taj Mahal. Very organized and safe experience.', time: '3 hours ago' },
        { user: 'PhotoEnthusiast', rating: 4, comment: 'Great safety measures. Just watch out for persistent vendors.', time: '5 hours ago' }
      ]
    },
    womenSafety: {
      status: 'caution',
      score: 7.9,
      lastUpdated: '30 mins ago',
      alerts: ['Be cautious with persistent vendors', 'Join group tours for monument visits'],
      userReports: 167,
      recentFeedback: [
        { user: 'TajLover', rating: 4, comment: 'Taj Mahal is safe with good security. Book official guides and avoid unauthorized vendors. Early morning visits are best.', time: '1 hour ago' },
        { user: 'HistoryWoman', rating: 3, comment: 'Beautiful monuments but be firm with vendors. Travel in groups and book hotel pickup/drop for convenience.', time: '4 hours ago' }
      ],
      safeAccommodations: ['Hotels near Taj East Gate', 'Government-approved accommodations', 'Reputable hotel chains with airport transfers'],
      emergencyContacts: ['Women Helpline: 181', 'UP Police: 100', 'Tourist Helpline: 1363']
    }
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    state: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1750160868338-c0813f5dfa31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5nYWxvcmUlMjBpbmRpYSUyMGNpdHklMjB0b3VyaXNtfGVufDF8fHx8MTc1ODAxMjMxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    highlights: ['Lalbagh Gardens', 'Bangalore Palace', 'Cubbon Park'],
    rating: 4.4,
    packages: 12,
    safety: {
      status: 'safe',
      score: 9.1,
      lastUpdated: '20 mins ago',
      alerts: [],
      userReports: 87,
      recentFeedback: [
        { user: 'TechTraveller', rating: 5, comment: 'Very modern and safe city. English widely spoken, helpful locals.', time: '1 hour ago' },
        { user: 'GardenLover', rating: 5, comment: 'Beautiful parks and very safe for solo travelers. Great weather too!', time: '2 hours ago' }
      ]
    },
    womenSafety: {
      status: 'safe',
      score: 9.3,
      lastUpdated: '15 mins ago',
      alerts: [],
      userReports: 142,
      recentFeedback: [
        { user: 'TechWoman', rating: 5, comment: 'Excellent for solo women travelers. Very cosmopolitan and safe. Uber/Ola are reliable and safe for late night travel.', time: '30 mins ago' },
        { user: 'DigitalNomad', rating: 5, comment: 'Perfect city for women entrepreneurs and travelers. Safe co-working spaces and accommodations available.', time: '2 hours ago' }
      ],
      safeAccommodations: ['Business hotels in Koramangala and Indiranagar', 'Women-only PGs and hostels', 'Service apartments with 24/7 security'],
      emergencyContacts: ['Women Helpline: 181', 'Karnataka Police: 100', 'Tourist Helpline: 1363']
    }
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1667833179801-bdefdfda2217?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YXJhbmFzaSUyMGdhbmdlcyUyMGluZGlhJTIwdG91cmlzbXxlbnwxfHx8fDE3NTgwMTIzMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    highlights: ['Ganges Ghats', 'Kashi Vishwanath', 'Sarnath'],
    rating: 4.7,
    packages: 14,
    safety: {
      status: 'caution',
      score: 7.8,
      lastUpdated: '1 hour ago',
      alerts: ['Crowded ghats - watch personal belongings', 'River water not safe for contact'],
      userReports: 134,
      recentFeedback: [
        { user: 'SpiritualSeeker', rating: 4, comment: 'Incredible spiritual experience. Stay alert in crowded areas, hire trusted guides.', time: '2 hours ago' },
        { user: 'CultureExplorer', rating: 3, comment: 'Amazing culture but can be overwhelming. Book hotel transportation for safety.', time: '4 hours ago' }
      ]
    },
    womenSafety: {
      status: 'caution',
      score: 7.1,
      lastUpdated: '45 mins ago',
      alerts: ['Dress conservatively', 'Avoid isolated ghats after sunset', 'Travel in groups for ghat visits'],
      userReports: 98,
      recentFeedback: [
        { user: 'SpiritualWoman', rating: 3, comment: 'Profound spiritual experience but requires caution. Book trusted accommodations and guides. Early morning visits are safest.', time: '1.5 hours ago' },
        { user: 'CultureSeeker', rating: 4, comment: 'Respectful treatment in ashrams and hotels. Join women traveler groups for ghat visits. Locals are generally helpful.', time: '3 hours ago' }
      ],
      safeAccommodations: ['Reputable ashrams with women sections', 'Hotels near Dasaswamedh Ghat with good reviews', 'Government guest houses'],
      emergencyContacts: ['Women Helpline: 181', 'UP Police: 100', 'Tourist Helpline: 1363']
    }
  }
];

const getSafetyColor = (status: string) => {
  switch (status) {
    case 'safe': return 'text-green-600 bg-green-50 border-green-200';
    case 'caution': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'alert': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getSafetyIcon = (status: string) => {
  switch (status) {
    case 'safe': return Shield;
    case 'caution': return AlertTriangle;
    case 'alert': return AlertTriangle;
    default: return Info;
  }
};

export function CitySelector() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;
    
    const query = searchQuery.toLowerCase();
    return cities.filter(city => 
      city.name.toLowerCase().includes(query) ||
      city.state.toLowerCase().includes(query) ||
      city.highlights.some(highlight => highlight.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Popular Cities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Discover incredible destinations across India. Choose your next adventure from our most loved cities.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search cities, states, or attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-3 w-full border-gray-300 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Search results summary */}
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                {filteredCities.length === 0 
                  ? 'No cities found matching your search'
                  : `Found ${filteredCities.length} ${filteredCities.length === 1 ? 'city' : 'cities'} matching "${searchQuery}"`
                }
              </p>
            )}
          </div>
        </div>

        {/* Cities Grid */}
        {filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
            <Card 
              key={city.id} 
              className={`group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl border-2 ${
                selectedCity === city.id 
                  ? 'border-red-500 shadow-lg ring-2 ring-red-200' 
                  : 'border-transparent hover:border-gray-200'
              }`}
              onClick={() => setSelectedCity(selectedCity === city.id ? null : city.id)}
            >
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={city.image}
                  alt={city.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Safety and Rating badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {/* Safety badge */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`rounded-full px-2 py-1 flex items-center space-x-1 text-xs border ${getSafetyColor(city.safety.status)}`}>
                          {(() => {
                            const SafetyIcon = getSafetyIcon(city.safety.status);
                            return <SafetyIcon className="w-3 h-3" />;
                          })()}
                          <span className="font-medium capitalize">{city.safety.status}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Safety Score: {city.safety.score}/10</p>
                        <p>Updated: {city.safety.lastUpdated}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* Rating badge */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{city.rating}</span>
                  </div>
                </div>

                {/* Selected indicator */}
                {selectedCity === city.id && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white rounded-full p-2">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* City name overlay */}
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{city.name}</h3>
                  <p className="text-sm opacity-90">{city.state}</p>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Safety Score Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Safety Score</span>
                    <span className="text-sm font-medium">{city.safety.score}/10</span>
                  </div>
                  <Progress value={city.safety.score * 10} className="h-2" />
                  {city.safety.alerts.length > 0 && (
                    <div className="mt-2 flex items-center text-xs text-amber-600">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      <span>{city.safety.alerts.length} alert{city.safety.alerts.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
                
                {/* Highlights */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Popular attractions:</p>
                  <div className="flex flex-wrap gap-1">
                    {city.highlights.map((highlight, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* User Reports */}
                <div className="mb-4 flex items-center text-xs text-gray-500">
                  <Users className="w-3 h-3 mr-1" />
                  <span>{city.safety.userReports} traveler reports</span>
                  <Clock className="w-3 h-3 ml-3 mr-1" />
                  <span>Updated {city.safety.lastUpdated}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{city.packages} packages</span>
                    </div>
                    
                    {/* Safety Details Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-xs px-2 py-1 h-auto">
                          Safety Info
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <Shield className="w-5 h-5" />
                            <span>Safety Information - {city.name}</span>
                          </DialogTitle>
                          <DialogDescription>
                            View comprehensive safety information, alerts, and traveler feedback for {city.name}. Toggle women safety mode for gender-specific recommendations.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <SafetyDialogContent city={city} />
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant={selectedCity === city.id ? "default" : "outline"}
                    className={selectedCity === city.id ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    {selectedCity === city.id ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        ) : (
          /* No results state */
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No cities found
              </h3>
              <p className="text-gray-500 mb-6">
                We couldn't find any cities matching "{searchQuery}". Try searching for a different city, state, or attraction.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
                className="text-red-500 border-red-500 hover:bg-red-50"
              >
                Clear Search
              </Button>
            </div>
          </div>
        )}

        {/* Selected city action */}
        {selectedCity && (
          <div className="mt-12 text-center">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-red-800 mb-4">
                Great choice! You've selected{' '}
                <span className="font-bold">
                  {cities.find(c => c.id === selectedCity)?.name}
                </span>
              </p>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                View {cities.find(c => c.id === selectedCity)?.packages} Available Packages
              </Button>
            </div>
          </div>
        )}

        {/* Browse all cities */}
        {filteredCities.length > 0 && !searchQuery && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Browse All Cities
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function SafetyDialogContent({ city }: { city: typeof cities[number] }) {
  const [showWomenSafety, setShowWomenSafety] = useState(false);
  
  const currentSafety = showWomenSafety ? city.womenSafety : city.safety;
  const hasWomenSafety = city.womenSafety !== undefined;
  
  return (
    <div className="space-y-6">
      {/* Women Safety Toggle */}
      {hasWomenSafety && (
        <div className="flex items-center justify-between p-4 bg-pink-50 border border-pink-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <UserCheck className="w-5 h-5 text-pink-600" />
            <div>
              <h4 className="font-medium text-pink-800">Women Traveler Safety</h4>
              <p className="text-sm text-pink-600">View safety information specifically for women travelers</p>
            </div>
          </div>
          <Switch
            checked={showWomenSafety}
            onCheckedChange={setShowWomenSafety}
            className="data-[state=checked]:bg-pink-500"
          />
        </div>
      )}

      {/* Safety Overview */}
      <div className={`rounded-lg p-4 ${showWomenSafety ? 'bg-pink-50 border border-pink-200' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {(() => {
              const SafetyIcon = getSafetyIcon(currentSafety.status);
              return <SafetyIcon className={`w-5 h-5 ${showWomenSafety ? 'text-pink-600' : 'text-gray-600'}`} />;
            })()}
            <span className={`font-medium capitalize ${showWomenSafety ? 'text-pink-800' : 'text-gray-700'}`}>
              {showWomenSafety ? 'Women Safety: ' : 'General Safety: '}{currentSafety.status}
            </span>
          </div>
          <div className="text-right">
            <div className={`font-bold text-lg ${showWomenSafety ? 'text-pink-800' : 'text-gray-700'}`}>
              {currentSafety.score}/10
            </div>
            <div className="text-xs text-gray-500">Safety Score</div>
          </div>
        </div>
        <Progress 
          value={currentSafety.score * 10} 
          className={`h-3 ${showWomenSafety ? '[&>div]:bg-pink-500' : ''}`} 
        />
        <p className="text-xs text-gray-600 mt-2">
          Last updated {currentSafety.lastUpdated} • {currentSafety.userReports} traveler reports
        </p>
      </div>

      {/* Active Alerts */}
      {currentSafety.alerts.length > 0 && (
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
            {showWomenSafety ? 'Women Safety Alerts' : 'Current Alerts'}
          </h4>
          <div className="space-y-2">
            {currentSafety.alerts.map((alert, idx) => (
              <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">{alert}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Women-specific sections */}
      {showWomenSafety && city.womenSafety && (
        <>
          {/* Safe Accommodations */}
          <div>
            <h4 className="font-medium mb-3 flex items-center text-pink-800">
              <Shield className="w-4 h-4 mr-2 text-pink-600" />
              Recommended Safe Accommodations
            </h4>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <ul className="space-y-2">
                {city.womenSafety.safeAccommodations.map((accommodation, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-sm text-pink-800">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{accommodation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h4 className="font-medium mb-3 flex items-center text-pink-800">
              <AlertTriangle className="w-4 h-4 mr-2 text-pink-600" />
              Emergency Contacts for Women
            </h4>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <ul className="space-y-2">
                {city.womenSafety.emergencyContacts.map((contact, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-pink-800">{contact}</span>
                    <Button variant="outline" size="sm" className="text-xs border-pink-300 text-pink-600 hover:bg-pink-100">
                      Call
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Recent User Feedback */}
      <div>
        <h4 className="font-medium mb-3 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          {showWomenSafety ? 'Recent Women Traveler Feedback' : 'Recent Traveler Feedback'}
        </h4>
        <div className="space-y-3">
          {currentSafety.recentFeedback.map((feedback, idx) => (
            <div key={idx} className={`border rounded-lg p-3 ${showWomenSafety ? 'border-pink-200 bg-pink-50/50' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{feedback.user}</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-3 h-3 ${star <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{feedback.time}</span>
              </div>
              <p className="text-sm text-gray-700">{feedback.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Tips */}
      <div className={`border rounded-lg p-4 ${showWomenSafety ? 'bg-pink-50 border-pink-200' : 'bg-blue-50 border-blue-200'}`}>
        <h4 className={`font-medium mb-2 ${showWomenSafety ? 'text-pink-800' : 'text-blue-800'}`}>
          {showWomenSafety ? 'Women Safety Tips' : 'General Safety Tips'}
        </h4>
        {showWomenSafety ? (
          <ul className="text-sm text-pink-700 space-y-1">
            <li>• Share your itinerary with trusted contacts</li>
            <li>• Dress according to local customs and traditions</li>
            <li>• Use women-only transportation options when available</li>
            <li>• Stay in well-reviewed accommodations with good security</li>
            <li>• Trust your instincts and avoid isolated areas</li>
            <li>• Keep emergency contacts easily accessible</li>
            <li>• Join women traveler groups for shared activities</li>
          </ul>
        ) : (
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Keep copies of important documents</li>
            <li>• Stay in well-lit, populated areas at night</li>
            <li>• Use trusted transportation services</li>
            <li>• Keep emergency contacts handy</li>
            <li>• Trust your instincts and stay alert</li>
          </ul>
        )}
      </div>
    </div>
  );
}