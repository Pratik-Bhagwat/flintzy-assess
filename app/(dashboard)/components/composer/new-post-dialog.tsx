"use client";

import {
  useEffect,
  useState,
  type ComponentType,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { PenLine, Plus } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  countChars,
  getOverLimitPlatforms,
  getScheduleErrors,
  toDateInputValue,
  toTimeInputValue,
} from "@/lib/new-post";
import { platformConfig, platformOrder } from "@/lib/platforms";
import type { Platform, Post } from "@/lib/posts";
import { cn } from "@/lib/utils";

import { PlatformLimits } from "./platform-limits";

export type NewPost = Pick<
  Post,
  "content" | "platforms" | "mediaUrl" | "scheduledAt"
>;

const useNow = (intervalMs = 30_000) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return [now, () => setNow(new Date())] as const;
};

const listFormat = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

type Variant = "dialog" | "drawer";

type SlotProps = { className?: string; children?: ReactNode };

type FormParts = {
  Header: ComponentType<SlotProps>;
  Title: ComponentType<SlotProps>;
  Description: ComponentType<SlotProps>;
  Footer: ComponentType<SlotProps>;
  Close: ComponentType<SlotProps>;
};

const formParts: Record<Variant, FormParts> = {
  dialog: {
    Header: DialogHeader,
    Title: DialogTitle,
    Description: DialogDescription,
    Footer: DialogFooter,
    Close: DialogClose,
  },
  drawer: {
    Header: DrawerHeader,
    Title: DrawerTitle,
    Description: DrawerDescription,
    Footer: DrawerFooter,
    Close: DrawerClose,
  },
};

type NewPostFormProps = {
  variant: Variant;
  onSchedule?: (post: NewPost) => void;
  onDone: () => void;
};

const NewPostForm = ({ variant, onSchedule, onDone }: NewPostFormProps) => {
  const { Header, Title, Description, Footer, Close } = formParts[variant];
  const isDrawer = variant === "drawer";

  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [now, refreshNow] = useNow();

  const count = countChars(content);
  const selected = platformOrder.filter((p) => platforms.includes(p));
  const overLimit = getOverLimitPlatforms(selected, count);
  const errors = getScheduleErrors(date, time, now);
  const hasOverLimit = overLimit.length > 0;

  const canSchedule =
    content.trim().length > 0 &&
    selected.length > 0 &&
    !hasOverLimit &&
    Boolean(date) &&
    Boolean(time) &&
    !errors.date &&
    !errors.time;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fresh = getScheduleErrors(date, time, new Date());

    if (!canSchedule || fresh.date || fresh.time) {
      refreshNow();
      return;
    }

    onSchedule?.({
      content: content.trim(),
      platforms: selected,
      mediaUrl: imageUrl.trim() || null,
      scheduledAt: new Date(`${date}T${time}`).toISOString(),
    });

    onDone();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "gap-4",
        isDrawer ? "flex min-h-0 flex-1 flex-col" : "grid",
      )}
    >
      <Header className="flex-row border-b gap-2 border-border py-4 pl-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary">
          <PenLine className="size-4 text-accent" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <Title className="font-headings text-lg leading-tight font-bold text-foreground">
            New post
          </Title>
          <Description className="text-xs text-muted-foreground">
            Compose once, publish everywhere
          </Description>
        </div>
      </Header>

      <div
        className={cn(
          "flex flex-col gap-4 overflow-y-auto px-4",
          isDrawer ? "min-h-0 flex-1" : "max-h-[60vh]",
        )}
      >
        <div>
          <div className="mb-2 text-xs font-semibold text-foreground">
            Platforms - pick any
          </div>
          <ToggleGroup
            multiple
            variant="outline"
            spacing={2}
            value={platforms}
            onValueChange={(value) => setPlatforms(value as Platform[])}
            className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {platformOrder.map((platform) => {
              const { label, icon } = platformConfig[platform];

              return (
                <ToggleGroupItem
                  key={platform}
                  value={platform}
                  className="h-10 gap-2 border border-border text-xs"
                >
                  <Image
                    src={icon}
                    alt=""
                    width={14}
                    height={14}
                    className="size-3.5"
                  />
                  {label}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>

        <div
          className={cn(
            "rounded-md border border-border bg-input p-3.5",
            hasOverLimit && "border-destructive/60",
          )}
        >
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post here."
            aria-label="Post content"
            aria-invalid={hasOverLimit}
            className="max-h-48 min-h-24 resize-none rounded-none border-0! bg-transparent! p-0 shadow-none ring-0!"
          />
          <div className="mt-2 flex justify-end">
            <span
              className={cn(
                "font-mono text-xs tabular-nums text-muted-foreground",
                hasOverLimit && "text-destructive",
              )}
            >
              {count.toLocaleString()} {count === 1 ? "char" : "chars"}
            </span>
          </div>
        </div>

        <section className="flex flex-col gap-2.5">
          <h3 className="text-xs font-semibold text-foreground">
            Character limits
          </h3>
          <PlatformLimits platforms={selected} count={count} />
          {hasOverLimit && (
            <p role="alert" className="text-xs text-destructive">
              Too long for{" "}
              {listFormat.format(overLimit.map((p) => platformConfig[p].label))}
              . Shorten the post or deselect{" "}
              {overLimit.length > 1 ? "them" : "it"} to schedule.
            </p>
          )}
        </section>

        <FieldGroup>
          <Field>
            <FieldLabel
              htmlFor="post-image-url"
              className="text-xs font-semibold text-foreground"
            >
              Image URL
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </FieldLabel>
            <Input
              id="post-image-url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://cdn.studio/hero.jpg"
              className="border-border placeholder:text-sm"
            />
          </Field>
        </FieldGroup>

        <FieldGroup className="grid grid-cols-2 gap-3">
          <Field data-invalid={Boolean(errors.date)}>
            <FieldLabel
              htmlFor="post-date"
              className="text-xs font-semibold text-foreground"
            >
              Date
            </FieldLabel>
            <Input
              id="post-date"
              type="date"
              required
              value={date}
              min={toDateInputValue(now)}
              aria-invalid={Boolean(errors.date)}
              onChange={(e) => setDate(e.target.value)}
              className="border-border"
            />
            {errors.date && <FieldError>{errors.date}</FieldError>}
          </Field>

          <Field data-invalid={Boolean(errors.time)}>
            <FieldLabel
              htmlFor="post-time"
              className="text-xs font-semibold text-foreground"
            >
              Time
            </FieldLabel>
            <Input
              id="post-time"
              type="time"
              required
              value={time}
              min={
                date === toDateInputValue(now)
                  ? toTimeInputValue(now)
                  : undefined
              }
              aria-invalid={Boolean(errors.time)}
              onChange={(e) => setTime(e.target.value)}
              className="border-border"
            />
            {errors.time && <FieldError>{errors.time}</FieldError>}
          </Field>
        </FieldGroup>
      </div>

      <Footer
        className={
          isDrawer
            ? "flex-col-reverse border-t border-border pb-[max(1rem,env(safe-area-inset-bottom))]"
            : "mx-0 mb-0 p-4"
        }
      >
        <Close
          className={cn(
            buttonVariants({ variant: "outline" }),
            isDrawer && "h-11",
          )}
        >
          Cancel
        </Close>
        <Button
          type="submit"
          className={cn("disabled:cursor-not-allowed", isDrawer && "h-11")}
          disabled={!canSchedule}
        >
          Schedule post
        </Button>
      </Footer>
    </form>
  );
};

const triggerClassName = cn(
  buttonVariants({ size: "lg" }),
  "h-11 w-full md:w-auto",
);

export const NewPostDialog = ({
  onSchedule,
}: {
  onSchedule?: (post: NewPost) => void;
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
        <DrawerTrigger className={triggerClassName}>
          <Plus />
          New post
        </DrawerTrigger>
        <DrawerContent className="bg-card">
          <NewPostForm
            variant="drawer"
            onSchedule={onSchedule}
            onDone={() => setOpen(false)}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={triggerClassName}>
        <Plus />
        New post
      </DialogTrigger>
      <DialogContent className="bg-card p-0 sm:max-w-[30rem]">
        <NewPostForm
          variant="dialog"
          onSchedule={onSchedule}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
