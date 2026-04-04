import { CMSPage, cmsApi } from '@cms-builder/core';
import { notFound } from 'next/navigation';

const PROJECT = process.env.NEXT_PUBLIC_PROJECT_NAME || 'default';

export async function generateStaticParams() {
  return [{ slug: [] }];
}

export default async function Page({ params }: { params: { slug?: string[] } }) {
  const route = '/' + (params.slug?.join('/') || '');
  
  const [design, instances] = await Promise.all([
    cmsApi.getSiteContent(PROJECT).catch(() => null),
    cmsApi.getPageComponents(PROJECT, route).catch(() => []),
  ]);
  
  if (!design) notFound();
  
  return (
    <CMSPage 
      design={design}
      route={route}
      componentInstances={instances}
    />
  );
}
