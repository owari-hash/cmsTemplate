import { CMSPage, cms } from '@cms-builder/core';
import * as Components from '@/components';

// Enable static generation for all routes defined in the CMS
export async function generateStaticParams() {
  return await cms.getAllRoutes();
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const { design, page, route } = await cms.getStaticProps(slug);

  return (
    <CMSPage 
      design={design}
      page={page} // Pass pre-fetched page for O(1) rendering
      componentMap={Components}
      route={route}
    />
  );
}
