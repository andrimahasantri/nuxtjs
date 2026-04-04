<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <!-- Navbar -->
    <header class="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 class="text-base font-semibold text-slate-900">ProductHub</h1>
          </div>

          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full">
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Online
          </span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p class="text-center text-xs text-slate-400">ProductHub &mdash; Built with Nuxt, NestJS & Laravel</p>
      </div>
    </footer>
  </div>
</template>
