import { Zap } from "lucide-react";

export const Brand = () => (
  <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
    <div className="flex size-9 items-center justify-center rounded-md bg-primary">
      <Zap className="text-accent" />
    </div>
    <div>
      <div className="font-headings text-base leading-none font-bold text-foreground">
        Postify
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        automate your posts
      </div>
    </div>
  </div>
);
