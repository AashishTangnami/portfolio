
export default function Footer() {
    return (
        <footer className="bg-primary h-[5rem] mb-10 px-4 text-center text-black">
        <small className="mb-2 block text-xs">
          &copy; {new Date().getFullYear()} Aashish Tangnami. All rights reserved.
        </small>
        <p className="text-xs">
          <span className="font-semibold">About this website:</span> built with ❤️
          React & Next.js
        </p>
      </footer>
    )
}