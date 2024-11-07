import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, Users, ArrowRight } from 'lucide-react';

const Statistical = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore comprehensive insights about user engagement and post performance
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* User Statistics Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-gray-900">User Analytics</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Track user growth, engagement metrics, and behavior patterns to optimize user experience
                  </p>
                </div>
                <Button 
                  className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 flex items-center justify-center space-x-2 group"
                  onClick={() => navigate('/statistical/user')}
                >
                  <span>View User Statistics</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Post Statistics Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                  <BarChart2 className="w-10 h-10 text-green-600" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-gray-900">Post Analytics</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Monitor content performance, engagement rates, and trending patterns across posts
                  </p>
                </div>
                <Button 
                  className="w-full max-w-sm bg-green-600 hover:bg-green-700 text-white font-medium py-6 flex items-center justify-center space-x-2 group"
                  onClick={() => navigate('/statistical/post')}
                >
                  <span>View Post Statistics</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Statistical;