import type { Metadata } from 'next';
import { DropEditor } from '@/components/AdminEditors';

export const metadata: Metadata = { title: 'Edit drop' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDropPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <h1 className="display text-2xl md:text-3xl">Edit drop</h1>
      <DropEditor id={id} />
    </div>
  );
}
