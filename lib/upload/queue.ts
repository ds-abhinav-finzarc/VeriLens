import { presignUploads, uploadToPresignedUrl } from '@/lib/api/mock';
import { getAllSessions, upsertSession } from '@/lib/storage/sessions';

export async function processPendingUploads(): Promise<void> {
  const sessions = await getAllSessions();
  for (const session of sessions) {
    if (session.status === 'uploaded') continue;
    const pending = session.images.filter((i) => i.uploadStatus !== 'uploaded');
    if (pending.length === 0) continue;
    const { urls } = await presignUploads(pending);
    for (let i = 0; i < pending.length; i++) {
      const img = pending[i];
      const presigned = urls[i];
      img.uploadStatus = 'uploading';
      await upsertSession({ ...session, images: session.images.map((x) => (x.id === img.id ? img : x)) });
      const res = await uploadToPresignedUrl(presigned.url, img.localUri, presigned.contentType);
      img.uploadStatus = res.ok ? 'uploaded' : 'failed';
      if (res.ok) img.s3Key = presigned.key;
      await upsertSession({ ...session, images: session.images.map((x) => (x.id === img.id ? img : x)) });
    }
    const nowUploaded = session.images.every((i) => i.uploadStatus === 'uploaded');
    if (nowUploaded) {
      session.status = 'uploaded';
      await upsertSession(session);
    }
  }
}


