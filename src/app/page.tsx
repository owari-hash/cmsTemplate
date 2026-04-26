import { cmsApi, normalizePageRoute } from '@cms-builder/core';
import { resolveCmsProject } from '@/lib/resolveCmsProject';
import { CMSPageWithLive } from '@/components/CMSPageWithLive';
import {
  resolveCmsLiveEditBridgeActive,
  resolveCmsLiveEditContentMode,
  resolveCmsLiveEditParentOrigin,
} from '@/lib/resolveCmsLiveEdit';
import { LiveCmsEditBridge } from '@/components/LiveCmsEditBridge';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const PROJECT = resolveCmsProject(sp);
  const parentOrigin = resolveCmsLiveEditParentOrigin(sp);
  const bridgeActive = resolveCmsLiveEditBridgeActive(sp);
  const liveEdit =
    resolveCmsLiveEditContentMode(sp) && !!parentOrigin;
  const route = normalizePageRoute('/');
  const [design, instances] = await Promise.all([
    cmsApi.getSiteContent(PROJECT).catch(() => null),
    cmsApi.getPageComponents(PROJECT, route).catch(() => []),
  ]);

  if (!design) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-semibold">CMS data unavailable</h1>
          <p className="mt-3 text-gray-600">
            The project exists, but design data could not be loaded yet. Check API connectivity and project naming configuration.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <CMSPageWithLive
        design={design}
        route={route}
        componentInstances={instances}
        liveEdit={liveEdit}
      />
      {bridgeActive && parentOrigin ? (
        <LiveCmsEditBridge parentOrigin={parentOrigin} />
      ) : null}
    </>
  );
}
