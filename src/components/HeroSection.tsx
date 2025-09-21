import { ImageWithFallback } from './figma/ImageWithFallback';
import { SearchForm } from './SearchForm';

export function HeroSection() {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1652531685577-e6ea8baca32c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2VuaWMlMjBtb3VudGFpbnMlMjBsYW5kc2NhcGUlMjB0b3VyaXNtfGVufDF8fHx8MTc1ODAxMjA3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Scenic mountain landscape"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating hills */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 300" className="w-full h-auto">
            <path d="M0,200 Q300,120 600,160 T1200,140 L1200,300 L0,300 Z" 
                  fill="rgba(255,255,255,0.1)" />
            <path d="M0,240 Q400,180 800,200 T1200,190 L1200,300 L0,300 Z" 
                  fill="rgba(255,255,255,0.05)" />
          </svg>
        </div>
        
        {/* Tourist bus illustration */}
        <div className="absolute bottom-20 right-20 hidden lg:block">
          <div className="w-32 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg shadow-lg transform rotate-3">
            <div className="w-full h-4 bg-white rounded-t-lg mt-2 mx-auto opacity-80"></div>
            <div className="flex justify-between px-2 mt-1">
              <div className="w-4 h-4 bg-black rounded-full"></div>
              <div className="w-4 h-4 bg-black rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            India's Premier<br />
            <span className="text-yellow-300">Tourism Experience</span> Platform
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover incredible destinations, book amazing experiences, and create unforgettable memories across incredible India
          </p>
        </div>

        <SearchForm />
      </div>
    </section>
  );
}