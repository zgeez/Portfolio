
import React from 'react';
import Image from 'next/image';

export default function IotDeviceAutomationContent() {
  return (
    <>
      <p>This project focuses on creating a versatile and energy-efficient IoT ecosystem. Below are some key features and developments:</p>
      <ul>
        <li>Developed a modular low-power IoT ecosystem using ESP-IDF and AWS IoT, enabling app-controlled, non-invasive automation of appliances and industrial machines.</li>
        <li>Designed scalable IoT modules with SPI/I2C interfaces for retrofitting industrial systems, enabling sensor/actuator integration.</li>
        <li>Built a Flutter-based mobile interface for real-time AWS IoT connectivity, enabling users to create and trigger low-latency automation workflows.</li>
        <li>Integrated a serverless backend using AWS Lambda, API Gateway, and DynamoDB for device registration and data management.</li>
        <li>Implemented multi-mode deep sleep power management, extending battery life by up to 3x.</li>
      </ul>
      <p><em>You can add more HTML content here, including images like this:</em></p>
      <div className="my-4 rounded shadow-md overflow-hidden">
        <Image
          src="https://placehold.co/600x300.png"
          alt="IoT Module Example"
          width={600}
          height={300}
          className="w-full h-auto"
          data-ai-hint="iot module"
        />
      </div>
    </>
  );
}
