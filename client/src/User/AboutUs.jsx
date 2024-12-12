import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex items-center justify-center  text-black">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex">
          {/* Left Side - Image */}
          <div className="w-1/2 flex items-center justify-center">
            <img
              src={require('./img/ab.gif')}// Replace with any relevant image
              alt="About Us"
              className="object-cover w-full h-full rounded-lg shadow-md"
            />
          </div>

          {/* Right Side - About Us Information */}
          <div className="w-1/2 p-8">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-6">About EventSphere</h2>

            <p className="text-lg mb-4">
              EventSphere is your ultimate destination for discovering exciting events and unforgettable experiences.
              Whether you're looking for the latest concerts, workshops, or unique gatherings, we bring you closer to the things that matter.
            </p>
            
            <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
            <p className="text-lg mb-4">
              Our mission is to connect people with the events and experiences that spark their passions. 
              We believe in bringing communities together through shared experiences, creating memories that last a lifetime.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
