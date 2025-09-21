import { useState } from 'react';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function SearchForm() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    travelers: '2',
    packageType: 'any'
  });

  const handleSearch = () => {
    if (!searchData.destination.trim()) {
      toast.error('Please enter a destination');
      return;
    }

    // Update global search state
    dispatch({ type: 'SET_SEARCH_QUERY', payload: searchData.destination });
    dispatch({ type: 'SET_SELECTED_DESTINATION', payload: searchData.destination });
    dispatch({ type: 'SET_GUESTS', payload: parseInt(searchData.travelers) });
    
    if (searchData.checkIn) {
      const fromDate = new Date(searchData.checkIn);
      const toDate = new Date(fromDate);
      toDate.setDate(toDate.getDate() + 3); // Default 3 days stay
      dispatch({ 
        type: 'SET_DATE_RANGE', 
        payload: { from: fromDate, to: toDate } 
      });
    }

    // Navigate based on package type
    let targetPage = '/packages';
    
    if (searchData.packageType === 'hotels') {
      targetPage = '/hotels';
    } else if (searchData.packageType === 'experiences') {
      targetPage = '/experiences';
    }
    
    navigate(targetPage);
    toast.success(`Searching for ${searchData.destination} in ${searchData.packageType}...`);
  };

  const handleQuickFilter = (filter: string) => {
    setSearchData(prev => ({ ...prev, packageType: filter }));
    toast.success(`Filtered by ${filter}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Destination */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <MapPin className="inline w-4 h-4 mr-1" />
            Destination
          </label>
          <Input
            type="text"
            placeholder="Where do you want to go?"
            value={searchData.destination}
            onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Check-in Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Calendar className="inline w-4 h-4 mr-1" />
            Travel Date
          </label>
          <Input
            type="date"
            value={searchData.checkIn}
            onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Travelers */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Users className="inline w-4 h-4 mr-1" />
            Travelers
          </label>
          <Select value={searchData.travelers} onValueChange={(value) => setSearchData({ ...searchData, travelers: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select travelers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Person</SelectItem>
              <SelectItem value="2">2 People</SelectItem>
              <SelectItem value="3">3 People</SelectItem>
              <SelectItem value="4">4 People</SelectItem>
              <SelectItem value="5">5+ People</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Package Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Package Type
          </label>
          <Select value={searchData.packageType} onValueChange={(value) => setSearchData({ ...searchData, packageType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Any package" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Package</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="cultural">Cultural</SelectItem>
              <SelectItem value="beach">Beach</SelectItem>
              <SelectItem value="mountain">Mountain</SelectItem>
              <SelectItem value="heritage">Heritage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <Button 
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-lg" 
        size="lg"
        onClick={handleSearch}
      >
        <Search className="w-5 h-5 mr-2" />
        Explore Destinations
      </Button>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => handleQuickFilter('adventure')}
        >
          Adventure
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => handleQuickFilter('cultural')}
        >
          Cultural
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => handleQuickFilter('beach')}
        >
          Beach
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => handleQuickFilter('mountain')}
        >
          Mountain
        </Button>
      </div>
    </div>
  );
}