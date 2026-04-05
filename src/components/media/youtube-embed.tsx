function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);

    // youtube.com/watch?v=ID
    if (
      parsed.hostname.includes("youtube.com") &&
      parsed.searchParams.has("v")
    ) {
      return parsed.searchParams.get("v");
    }

    // youtube.com/embed/ID
    if (parsed.pathname.startsWith("/embed/")) {
      return parsed.pathname.split("/embed/")[1]?.split("?")[0] ?? null;
    }

    // youtu.be/ID
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1).split("?")[0] ?? null;
    }
  } catch {
    return null;
  }
  return null;
}

interface YouTubeEmbedProps {
  url: string;
  title?: string | null;
}

export function YouTubeEmbed({ url, title }: YouTubeEmbedProps) {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return (
      <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingBottom: "56.25%" }}>
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
        title={title ?? "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
