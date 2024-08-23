
import Link from "next/link";
import { usePathname } from "next/navigation";

 
export default function Nav(){
    const navLinks = [
        {
            name: "About",
            path: "/#About"},
        {
            name: "Experience", 
            path: "/Experience"},
        {
            name: "Projects", 
            path: "/Project"},
        {
            name: "Contact", 
            path: "/Contact"
        },
    ];
    const pathname = usePathname(); 
    return (
        <div className="flex py-8 gap-8 h-[8px] text-text_primary">
            {navLinks.map((link, index)=>{
                return (
                    <Link 
                    href={link.path} 
                    key={index}
                    className = {`${pathname === link.path 
                    && ""}
                    capitalize
                    `}>
                        {link.name}
                    </Link>
                )
            }
            )}
        </div>
    );
}