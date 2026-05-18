import { Suspense } from "react";
import { getPhotos } from "@/lib/actions";

export const dynamic = "force-dynamic";
import { PageHeader } from "@/components/layout/PageHeader";
import { PhotoCard } from "@/components/album/PhotoCard";
import { AlbumUploadButton } from "./AlbumUploadButton";
import { PhotoSkeleton } from "@/components/album/PhotoSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { Image } from "lucide-react";

async function PhotoList() {
  const photos = await getPhotos();

  if (photos.length === 0) {
    return (
      <EmptyState
        icon={<Image size={32} />}
        title="还没有照片"
        description="上传你们的第一张照片，开始记录美好瞬间"
        action={<AlbumUploadButton />}
      />
    );
  }

  return (
    <div className="columns-2 gap-3 space-y-3">
      {photos.map((photo, i) => (
        <ScrollReveal key={photo.id} delay={i * 0.05}>
          <PhotoCard photo={photo} />
        </ScrollReveal>
      ))}
    </div>
  );
}

export default function AlbumPage() {
  return (
    <div>
      <PageHeader title="相册" showBack action={<AlbumUploadButton />} />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<PhotoSkeleton />}>
          <PhotoList />
        </Suspense>
      </div>
    </div>
  );
}
