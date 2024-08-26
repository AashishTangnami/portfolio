import { NextPage } from 'next';
import Link from 'next/link';
import { FaFilePdf } from 'react-icons/fa';

export default function ResumePage() {
  const resumeUrl = "/path/to/your/resume.pdf"; // Replace with the actual path to your resume PDF

  return (

    <>
    <section id="resume" className="min-h-screen flex flex-col items-center justify-center p-8 bg-primary text-black">
      <nav className="bg-gray-800 text-white p-4 w-full">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Go Back
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-4">Resume Preview</h1>
        
        {/* Resume Preview */}
        <div className="w-full max-w-4xl mx-auto">
          <embed
            src={resumeUrl}
            type="application/pdf"
            width="100%"
            height="80vh" // Adjust height as needed
            className="border border-gray-200"
          />
        </div>

        {/* Download Button */}
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          download="Your_Resume.pdf" // Customize the download filename
          className="mt-8 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
        >
          <FaFilePdf className="inline-block mr-2" />
          Download PDF
        </a>
      </main>
    </section>
  </>
  );
};

