import type { Metadata } from 'next';
import { CopilotView } from '@/components/CopilotView';

export const metadata: Metadata = {
  title: 'Copilot',
  description:
    'Ask the DropCart Copilot to find products within your budget and add them to your cart.',
};

export default function CopilotPage() {
  return <CopilotView />;
}
