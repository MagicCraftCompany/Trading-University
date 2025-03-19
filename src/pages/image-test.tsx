import React from 'react'
import Image from 'next/image'
import Head from 'next/head'

export default function ImageTest() {
  return (
    <div className="p-10">
      <Head>
        <title>Image Test Page</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">Image Test Page</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Next.js Image with src as string</h2>
          <Image 
            src="/assets/James.png" 
            alt="James with string path" 
            width={300} 
            height={300} 
            unoptimized={true}
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Standard img tag</h2>
          <img 
            src="/assets/James.png" 
            alt="James with img tag" 
            width="300" 
            height="300" 
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">3. Next.js Image with different image</h2>
          <Image 
            src="/assets/welcome.png" 
            alt="Welcome image" 
            width={300} 
            height={300} 
            unoptimized={true}
          />
        </div>
      </div>
      
      <div className="mt-8">
        <p className="text-sm text-gray-600">
          Image paths: 
          <code className="bg-gray-100 px-2 py-1 rounded ml-2">/assets/James.png</code>,
          <code className="bg-gray-100 px-2 py-1 rounded ml-2">/assets/welcome.png</code>
        </p>
      </div>
    </div>
  )
} 