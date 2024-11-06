import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { BarChart2, Users } from 'lucide-react';

const Statistical = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Statistics Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive analytics for users and posts
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* User Statistics Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">User Statistics</h2>
              <p className="text-gray-600 text-center">
                Analyze user engagement, growth, and behavior patterns
              </p>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate('/statistical/user')}
              >
                View User Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Post Statistics Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Post Statistics</h2>
              <p className="text-gray-600 text-center">
                Track post performance, engagement, and content metrics
              </p>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => navigate('/statistical/post')}
              >
                View Post Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Statistical;