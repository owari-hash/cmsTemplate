import { CMSPage, cms } from '@cms-builder/core';
import * as Components from '@/components';

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const route = resolvedParams.slug ? '/' + resolvedParams.slug.join('/') : '/';
  
  const design = await cms.getDesign();

  return (
    <CMSPage 
      design={design} 
      componentMap={Components} 
      route={route} 
    />
  );
}
