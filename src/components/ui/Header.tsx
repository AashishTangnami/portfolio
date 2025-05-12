'use client';

import Link from 'next/link';
import Nav from "@/components/Nav";
import { Button } from "./Button";

export default function Header() {
    return (
        <header className=" ">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/">
                    Aashish
                </Link>

                {/* Navigation */}
                <div className="relative hidden md:flex items-center gap-10">
                    <Nav/>
                </div>
                <div className="flex bg-slate-600">
                    Hire me
                </div>
            </div>

        </header>
    )
}