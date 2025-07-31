"use client";

import HomeFooter from "@/components/HomeFooter";

export default function BrandKit() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--background)] text-xs text-gray-600 dark:text-gray-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-transparent p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Brand Kit
          </h1>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Logo
              </h2>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Full
              </h3>
              <div className="flex flex-col sm:flex-row gap-8 w-full items-start">
                <div className="">
                <div className="w-full h-full flex max-w-[200px] max-h-[200px] bg-white border border-gray-200 dark:border-gray-800 rounded-2xl items-center justify-center">
                  <p className="p-20">cdsckmk</p>
                </div>
                <p className="text-center p-4 text-sm text-gray-400 dark:text-gray-400">
                  Full logo on light
                </p>
                </div>
                <div className="">
                <div className="w-full h-full flex max-w-[200px] max-h-[200px] bg-black border border-gray-200 dark:border-gray-800 rounded-2xl items-center justify-center">
                  <p className="p-20">Welcome</p>
                </div>
                <p className="text-center p-4 text-sm text-gray-400 dark:text-gray-400">
                  Full logo on dark
                </p>
                </div>

              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Wordmark
              </h3>
              <div className="flex flex-col sm:flex-row gap-8 w-full items-start">
                <div className="">
                <div className="w-full h-full flex max-w-[200px] max-h-[200px] bg-white border border-gray-200 dark:border-gray-800 rounded-2xl items-center justify-center">
                  <p className="p-20">cdsckmk</p>
                </div>
                <p className="text-center p-4 text-sm text-gray-400 dark:text-gray-400">
                  Full logo on light
                </p>
                </div>
                <div className="">
                <div className="w-full h-full flex max-w-[200px] max-h-[200px] bg-black border border-gray-200 dark:border-gray-800 rounded-2xl items-center justify-center">
                  <p className="p-20">Welcome</p>
                </div>
                <p className="text-center p-4 text-sm text-gray-400 dark:text-gray-400">
                  Full logo on dark
                </p>
                </div>

              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Icon
              </h3>
              <div className="flex flex-col sm:flex-row gap-8 w-full items-start">
                <div className="">
                <div className="w-full h-full flex max-w-[200px] max-h-[200px] bg-white border border-gray-200 dark:border-gray-800 rounded-2xl items-center justify-center">
                  <p className="p-20">cdsckmk</p>
                </div>
                <p className="text-center p-4 text-sm text-gray-400 dark:text-gray-400">
                  Full logo on light
                </p>
                </div>
                <div className="">
                <div className="w-full h-full flex max-w-[200px] max-h-[200px] bg-black border border-gray-200 dark:border-gray-800 rounded-2xl items-center justify-center">
                  <p className="p-20">Welcome</p>
                </div>
                <p className="text-center p-4 text-sm text-gray-400 dark:text-gray-400">
                  Full logo on dark
                </p>
                </div>

              </div>
              <p className="mb-4">
                Pennysia is a next-generation AMM (Automated Market Maker) protocol built on Sonic blockchain.
                Our brand represents innovation, accessibility, and democratization of decentralized finance.
              </p>
              <p className="mb-4">
                This brand kit provides guidelines for using Pennysia's visual identity, logos, and assets
                across various media and platforms.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Color
              </h2>
              <p className="mb-4">
                <strong>Primary Logo:</strong> Use our full "Pennysia" wordmark logo in horizontal format
                for most applications. The logo should maintain clear space equal to the height of the "P"
                on all sides.
              </p>
              <p className="mb-4">
                <strong>Icon Logo:</strong> Use the "P" icon for social media avatars, app icons, and
                situations where horizontal space is limited.
              </p>
              <p className="mb-4">
                <strong>Clear Space:</strong> Maintain minimum clear space around the logo equal to the
                height of the "P" letter. Never place text or graphics within this space.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Typography
              </h2>
              <p className="mb-4">
                <strong>Primary Colors:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Pennysia Blue:</strong> #3B82F6 (Primary brand color)</li>
                <li><strong>Pennysia Dark:</strong> #1E293B (Backgrounds and text)</li>
                <li><strong>Pennysia Light:</strong> #F8FAFC (Light backgrounds)</li>
                <li><strong>Accent Green:</strong> #10B981 (Success states)</li>
                <li><strong>Accent Orange:</strong> #F59E0B (Warning states)</li>
                <li><strong>Accent Red:</strong> #EF4444 (Error states)</li>
              </ul>
              <p className="mb-4">
                <strong>Usage Guidelines:</strong> Pennysia Blue should be used as the primary color
                for buttons, links, and interactive elements. Ensure sufficient contrast ratios
                for accessibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
}
