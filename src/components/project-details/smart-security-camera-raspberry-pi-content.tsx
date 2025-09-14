import Image from 'next/image';
import React from 'react';

const SmartSecurityCameraRaspberryPiContent: React.FC = () => (
  <article className="container mx-auto px-4 py-0 prose lg:prose-lg">
    {/* ────────────── Header ────────────── */}
    <header className="mb-10">
      <p className="text-gray-600">
        A complete edge-AI security system that combines PIR sensor triggering with YOLOv11n object detection,
        optimized for Raspberry Pi 5 to achieve real-time person detection with intelligent event recording
        and a web dashboard for monitoring and control.
      </p>
    </header>

    {/* ────────────── Hero Image ────────────── */}
    <figure className="mb-12 flex flex-col items-center">
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/security-cam/main.jpg`}
        alt="Smart security camera system with Raspberry Pi 5 and PIR sensor"
        width={600}
        height={500}
        className="rounded-xl shadow-lg"
        priority
      />
      <figcaption className="text-center text-sm mt-2">
        Raspberry Pi 5 with Pi Camera Module
      </figcaption>
    </figure>

    {/* ────────────── Project Overview ────────────── */}
    <h2>Project Overview</h2>
    <p>
      This edge-AI security system demonstrates advanced systems engineering by combining 
      <strong> computer vision</strong>, <strong>sensor integration</strong>, and <strong>web technologies</strong>. 
      The system achieves real-time performance through optimized YOLOv11n deployment with NCNN backend, 
      intelligent motion gating, and multi-threaded processing architecture.
    </p>

    {/* ────────────── Performance Optimization ────────────── */}
    <div className="bg-green-50 p-6 rounded-lg my-8">
      <h3 className="!mt-0 text-lg font-semibold mb-4 text-green-800">Performance Achievement</h3>
      <div className="grid md:grid-cols-3 gap-4 text-center">
        <div>
          <h4 className="text-2xl font-bold text-green-700">10x</h4>
          <p className="text-sm text-green-600">FPS Improvement<br/>3 → 30 FPS</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-green-700">INT8</h4>
          <p className="text-sm text-green-600">Quantization<br/>CPU Optimized</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-green-700">Zero</h4>
          <p className="text-sm text-green-600">False Alarms<br/>PIR + YOLO Gating</p>
        </div>
      </div>
    </div>

    {/* ────────────── Key Features ────────────── */}
    <h2>Key Features</h2>
    
    <div className="grid md:grid-cols-2 gap-6 my-8">
      <section className="bg-blue-50 p-6 rounded-lg">
        <h3 className="!mt-0 text-lg font-semibold mb-3 text-blue-800">🔹 Real-Time AI Detection</h3>
        <ul className="text-sm">
          <li> YOLOv11n with NCNN backend & INT8 quantization</li>
          <li> Optimized inference: 3 FPS → 30 FPS on CPU</li>
          <li> Motion-gated processing for efficiency</li>
          <li> Person detection with confidence scoring</li>
        </ul>
      </section>

      <section className="bg-purple-50 p-6 rounded-lg">
        <h3 className="!mt-0 text-lg font-semibold mb-3 text-purple-800">🔹 Motion & Event Triggering</h3>
        <ul className="text-sm">
          <li> PIR sensor for first-stage motion detection</li>
          <li> YOLO verification prevents false alarms</li>
          <li> Automatic event recording (AVI → MP4)</li>
          <li> Background FFmpeg conversion</li>
        </ul>
      </section>

      <section className="bg-orange-50 p-6 rounded-lg">
        <h3 className="!mt-0 text-lg font-semibold mb-3 text-orange-800">🔹 Multi-Threaded Processing</h3>
        <ul className="text-sm">
          <li> Separated live feed & recording pipelines</li>
          <li> MJPEG streaming over Flask</li>
          <li> Asynchronous video processing</li>
          <li> Balanced CPU load distribution</li>
        </ul>
      </section>

      <section className="bg-red-50 p-6 rounded-lg">
        <h3 className="!mt-0 text-lg font-semibold mb-3 text-red-800">🔹 Performance Monitoring</h3>
        <ul className="text-sm">
          <li> Real-time FPS & CPU monitoring</li>
          <li> Inference latency tracking</li>
          <li> Detection rate analytics</li>
          <li> JSON API endpoints for metrics</li>
        </ul>
      </section>
    </div>

    {/* ────────────── System Architecture ────────────── */}
    <h2>System Architecture</h2>
    <figure className="mb-8">
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/security-cam/architecture_diagram.png`}
        alt="System architecture diagram showing data flow"
        width={800}
        height={600}
        className="rounded-lg shadow-sm w-full"
      />
      <figcaption className="text-center text-sm mt-2">
        Multi-threaded architecture with separated processing pipelines
      </figcaption>
    </figure>

    {/* ────────────── Web Dashboard ────────────── */}
    <h2>Interactive Web Dashboard</h2>
    <p>
      Designed a responsive web interface that provides comprehensive system monitoring and control 
      capabilities with a modern, user-friendly design.
    </p>

    {/* Main Dashboard - Large and Centered */}
    <figure className="mb-8 flex flex-col items-center">
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/security-cam/dashboard.png`}
        alt="Main dashboard with metrics and controls"
        width={1000}
        height={600}
        className="rounded-lg shadow-lg w-full max-w-4xl"
      />
      <figcaption className="text-center text-sm mt-2">Main Dashboard Interface</figcaption>
    </figure>

    {/* Live Feed and Detection Playback Side by Side */}
    <div className="grid md:grid-cols-2 gap-6 my-8">
      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/security-cam/live_camera_feed.png`}
          alt="Live camera feed with detection overlay"
          width={600}
          height={400}
          className="rounded-lg object-cover w-full"
        />
        <figcaption className="text-sm text-center mt-2">Live Feed with Detection Overlay</figcaption>
      </figure>

      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/security-cam/latest_detection.png`}
          alt="Latest detection playback with metadata"
          width={600}
          height={400}
          className="rounded-lg object-cover w-full"
        />
        <figcaption className="text-sm text-center mt-2">Detection Playback with Metadata</figcaption>
      </figure>
    </div>

    {/* ────────────── Dashboard Features ────────────── */}
    <div className="bg-gray-50 p-6 rounded-lg my-8">
      <h3 className="!mt-0 text-lg font-semibold mb-4">Dashboard Features</h3>
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2">📡 Live Monitoring</h4>
          <ul>
            <li> Real-time camera feed with overlays</li>
            <li> Detection status indicators</li>
            <li> System health monitoring</li>
            <li> Responsive design for mobile/desktop</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">⚡ Control Panel</h4>
          <ul>
            <li> PIR sensor enable/disable toggle</li>
            <li> Theme switching (light/dark)</li>
            <li> Fullscreen camera view</li>
            <li> Recording controls</li>
          </ul>
        </div>
      </div>
    </div>

    {/* ────────────── Performance Analytics ────────────── */}
    <h2>Performance Analytics</h2>
    <figure className="mb-8 flex flex-col items-center">
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/security-cam/performance_comparison.png`}
        alt="Performance metrics showing optimization results"
        width={800}
        height={500}
        className="rounded-lg shadow-sm w-full max-w-3xl"
      />
      <figcaption className="text-center text-sm mt-2">Before vs After Optimization Results</figcaption>
    </figure>

    {/* ────────────── Technical Implementation ────────────── */}
    <h2>Technical Implementation</h2>
    
    <div className="bg-blue-50 p-6 rounded-lg my-8">
      <h3 className="!mt-0 text-lg font-semibold mb-4">Technology Stack</h3>
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Hardware</h4>
          <ul>
            <li> Raspberry Pi 5</li>
            <li> Pi Camera Module</li>
            <li> PIR Motion Sensor</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">AI/ML</h4>
          <ul>
            <li> YOLOv11n (NCNN)</li>
            <li> INT8 Quantization</li>
            <li> OpenCV Processing</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Web Stack</h4>
          <ul>
            <li> Flask (Python)</li>
            <li> HTML/CSS/JS</li>
            <li> FFmpeg Processing</li>
          </ul>
        </div>
      </div>
    </div>

    {/* ────────────── Key Optimizations ────────────── */}
    <h2>Key Optimizations</h2>
    <ul>
      <li>
        <strong>Motion Gating:</strong> PIR sensor triggers YOLO processing only when motion is detected, 
        reducing CPU usage by 70% during idle periods.
      </li>
      <li>
        <strong>INT8 Quantization:</strong> Model compression reduced inference time from 330ms to 33ms 
        while maintaining 95% accuracy on person detection.
      </li>
      <li>
        <strong>Multi-Threading:</strong> Separated video capture, inference, and web serving into 
        independent threads for optimal resource utilization.
      </li>
      <li>
        <strong>Asynchronous Processing:</strong> Background video conversion prevents blocking 
        of real-time detection pipeline.
      </li>
    </ul>

    {/* ────────────── Results & Impact ────────────── */}
    <h2>Results & Impact</h2>
    <p>
      The system successfully demonstrates edge-AI deployment capabilities with practical security applications. 
      Key achievements include real-time performance on resource-constrained hardware, intelligent false-alarm 
      prevention, and a production-ready web interface for system management.
    </p>

    <div className="bg-yellow-50 p-6 rounded-lg my-8">
      <h3 className="!mt-0 text-lg font-semibold mb-3 text-yellow-800">Project Achievements</h3>
      <ul className="text-sm space-y-2">
        <li> <strong>Performance:</strong> Achieved 30 FPS real-time detection on Raspberry Pi 5</li>
        <li> <strong>Efficiency:</strong> 70% reduction in idle CPU usage through motion gating</li>
        <li> <strong>Accuracy:</strong> Zero false alarms with dual-stage detection system</li>
        <li> <strong>Usability:</strong> Modern web dashboard with real-time monitoring</li>
      </ul>
    </div>

    {/* ────────────── Future Enhancements ────────────── */}
    <h2>Future Enhancements</h2>
    <ul>
      <li>
        <strong>Multi-Camera Support:</strong> Extend to multiple camera nodes with centralized monitoring
      </li>
      <li>
        <strong>Cloud Integration:</strong> Add cloud storage and remote access capabilities
      </li>
      <li>
        <strong>Advanced Analytics:</strong> Implement behavioral analysis and anomaly detection
      </li>
      <li>
        <strong>Mobile App:</strong> Develop companion mobile application for alerts and management
      </li>
    </ul>

    {/* ────────────── Footer ────────────── */}
    <footer className="pt-12 border-t">
      <p className="text-sm text-gray-500">
        <em>Built with Python, Flask, YOLOv11n, NCNN, and modern web technologies. 
        Demonstrates expertise in edge-AI deployment, embedded systems, and full-stack development.</em>
      </p>
    </footer>
  </article>
);

export default SmartSecurityCameraRaspberryPiContent;