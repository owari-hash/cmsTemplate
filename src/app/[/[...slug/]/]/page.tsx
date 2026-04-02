import { CMSPage, cms } from '@cms-builder/core';
import * as Components from '@/components';

export default async function DynamicRoutePage({ params }: { params: { slug?: string[] } }) {
  const route = params.slug ? `/${params.slug.join('/')}` : '/';
  
  const design = await cms.getDesign();

  return (
    <CMSPage 
      design={design} 
      componentMap={Components} 
      route={route} 
    />
  );
}
