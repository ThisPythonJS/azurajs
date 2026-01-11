import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Github, MessageSquare, Box, BookText } from "lucide-react";

export function baseOptions(lang?: string): BaseLayoutProps {
  const currentLang = lang || "en";

  return {
    githubUrl: "https://github.com/0xviny/azurajs",

    nav: {
      title: (
        <div className="flex items-center gap-2.5 group">
          <div className="relative">
            <img 
              src="/logo.png" 
              alt="AzuraJS Logo" 
              className="h-9 w-auto transition-transform duration-300 group-hover:scale-110" 
            />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[17px] font-bold tracking-tight text-fd-foreground">
              AzuraJS
            </span>
            <span className="text-[10px] uppercase tracking-widest text-fd-muted-foreground font-medium mt-0.5">
              Framework
            </span>
          </div>
          <div className="ml-1 self-center">
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-full border border-blue-500/20 font-medium">
              v2.2 Beta
            </span>
          </div>
        </div>
      ),
      transparentMode: "top",
    },

    themeSwitch: {
      enabled: false,
    },

    links: [
      {
        text: "Documentation",
        url: `/docs/${currentLang}`,
        active: "nested-url",
        icon: <BookText className="w-4 h-4" />,
      },
      {
        type: "custom",
        children: (
          <div className="flex items-center gap-1 border-l border-fd-border ml-2 pl-4">
            <LanguageSwitcher />
          </div>
        ),
      },
      {
        icon: <MessageSquare className="w-4 h-4" />,
        text: "Discord",
        url: "https://discord.gg/gr63YzEYfp",
        external: true,
      },
      {
        icon: <Box className="w-4 h-4" />,
        text: "NPM",
        url: "https://www.npmjs.com/package/azurajs",
        external: true,
      },
    ],
  };
}