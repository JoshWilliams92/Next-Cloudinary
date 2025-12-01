"use client";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { Cloudinary } from "@cloudinary/url-gen";
import { fill, scale } from "@cloudinary/url-gen/actions/resize";
import { oilPaint } from "@cloudinary/url-gen/actions/effect";
import { Rotate } from "@cloudinary/url-gen/actions/rotate";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";

export default function Home() {
  const [transformation, setTransformation] = useState('original');
  const [imageSize, setImageSize] = useState(500);
  const [rotation, setRotation] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  // Initialize Cloudinary instance
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo"
    }
  });

  // Build image URL using Cloudinary SDK
  const buildImage = () => {
    let img = cld.image("sample");
    
    // Apply transformations
    switch (transformation) {
      case "text":
        img.resize(scale().width(imageSize));
        const fontSize = Math.floor(imageSize * 0.12);
        // Using URL transformation string for text overlay
        img.addTransformation(`l_text:Arial_${fontSize}_bold:Hello Cloudinary,g_center,co_white`);
        break;
      case "square":
        // Auto-crop to square
        img.resize(fill().width(imageSize).height(imageSize));
        break;
      case "cartoon":
        img.resize(scale().width(imageSize));
        img.effect(oilPaint(80));
        break;
      default:
        // Original - just scale to width
        img.resize(scale().width(imageSize));
        break;
    }
    
    // Apply rotation if set
    if (rotation !== 0) {
      img.rotate(Rotate.byAngle(rotation));
    }
    
    return img.toURL();
  };

  // Update image URL when transformation, size, or rotation changes
  useEffect(() => {
    setImageUrl(buildImage());
  }, [transformation, imageSize, rotation]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        
        <div className="flex flex-col items-center gap-8 w-full my-12">
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => setTransformation('text')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                transformation === 'text'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Text Overlay
            </button>
            
            <button
              onClick={() => setTransformation('square')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                transformation === 'square'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Crop to Square
            </button>
            
            <button
              onClick={() => setTransformation('cartoon')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                transformation === 'cartoon'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Cartoonify
            </button>
            
            <button
              onClick={() => setTransformation('original')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                transformation === 'original'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Original
            </button>
          </div>

          {/* Size Slider */}
          <div className="w-full max-w-md space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Image Size
              </label>
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                {imageSize}px
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="200"
                max="800"
                value={imageSize}
                onChange={(e) => setImageSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((imageSize - 200) / 600) * 100}%, #e5e7eb ${((imageSize - 200) / 600) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>200px</span>
                <span>800px</span>
              </div>
            </div>
          </div>

          {/* Rotation Slider */}
          <div className="w-full max-w-md space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Image Rotation
              </label>
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                {rotation}°
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(rotation / 360) * 100}%, #e5e7eb ${(rotation / 360) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0°</span>
                <span>360°</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-xl transition-all duration-300">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Transformed image"
                width={imageSize}
                height={imageSize}
              />
            )}
          </div>
        </div>
        
        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: transform 0.2s;
          }
          
          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
          }
          
          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: transform 0.2s;
          }
          
          input[type="range"]::-moz-range-thumb:hover {
            transform: scale(1.2);
          }
        `}</style>
      </main>
    </div>
  );
}