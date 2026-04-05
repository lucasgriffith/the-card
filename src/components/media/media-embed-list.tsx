import { YouTubeEmbed } from "@/components/media/youtube-embed";
import { TwitterEmbed } from "@/components/media/twitter-embed";
import type { MediaEmbed } from "@/types/database";

interface MediaEmbedListProps {
  embeds: MediaEmbed[];
}

export function MediaEmbedList({ embeds }: MediaEmbedListProps) {
  if (embeds.length === 0) return null;

  return (
    <div className="space-y-4">
      {embeds.map((embed) => {
        switch (embed.embed_type) {
          case "youtube":
            return (
              <YouTubeEmbed
                key={embed.id}
                url={embed.url}
                title={embed.title}
              />
            );
          case "twitter":
            return (
              <TwitterEmbed
                key={embed.id}
                url={embed.url}
                title={embed.title}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
