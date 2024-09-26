
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandGmail,

} from "@tabler/icons-react";
import { FloatingDock } from "./ui/floatingDock";

export function FloatingDockDemo() {
  const links = [
    {
      title: "Gmail",
      icon: (
        <IconBrandGmail className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "mailto:tangnamiaashish@gmail.com",
    },
    {
      title: "LinkedIn",
      icon: (
        <IconBrandLinkedin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://www.linkedin.com/in/aashishtangnami/",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://github.com/AashishTangnami",
    },
  ];
  return (
    <div className="flex items-center justify-center pt-28 pb-10 w-full">
      <FloatingDock
      mobileClassName="translate-y-10"
        items={links}
      />
    </div>
  );
}
