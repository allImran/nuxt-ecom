<script setup lang="ts">
const { locale } = useI18n()

// Shipping information data with language support
const shippingTranslations: Record<string, any> = {
  en: {
    title: 'Shipping Information',
    subtitle: 'Everything you need to know about shipping and delivery',
    sections: [
      {
        id: 'overview',
        title: 'Shipping Overview',
        content: 'We partner with trusted third-party shipping services to deliver your orders safely and efficiently. Our team takes proper care in packaging your products to ensure they arrive in perfect condition.',
        icon: 'truck'
      },
      {
        id: 'timeline',
        title: 'Delivery Timeline',
        content: 'Orders are typically processed within 24-48 hours. Once shipped, delivery usually takes 48-72 hours depending on your location. You will receive tracking information via email/SMS once your order is dispatched.',
        icon: 'clock'
      },
      {
        id: 'packaging',
        title: 'Packaging & Care',
        content: 'Every product is carefully inspected and securely packaged before shipping. We use high-quality packaging materials to protect your items during transit. Fragile items receive extra cushioning and special handling.',
        icon: 'package'
      },
      {
        id: 'tracking',
        title: 'Order Tracking',
        content: 'Stay informed about your order status with real-time tracking. Once your order is shipped, you will receive a tracking number via SMS and email. Use this number to monitor your package\'s journey.',
        icon: 'navigation'
      },
      {
        id: 'areas',
        title: 'Service Areas',
        content: 'We currently ship to all major cities and urban areas nationwide. For remote locations, delivery time may vary. Contact us if you have questions about shipping to your specific area.',
        icon: 'map-pin'
      },
      {
        id: 'cost',
        title: 'Shipping Costs',
        content: 'Shipping costs are calculated based on your location and order weight. The final shipping fee will be displayed at checkout before you complete your purchase. We occasionally offer free shipping promotions - stay tuned!',
        icon: 'credit-card'
      },
      {
        id: 'issues',
        title: 'Shipping Issues',
        content: 'If your order is delayed beyond the estimated delivery time, or if you receive a damaged package, please contact us within 48 hours with photos. We will work with our shipping partners to resolve the issue promptly.',
        icon: 'alert-circle'
      }
    ]
  },
  bn: {
    title: 'শিপিং তথ্য',
    subtitle: 'শিপিং এবং ডেলিভারি সম্পর্কে আপনার যা জানা দরকার',
    sections: [
      {
        id: 'overview',
        title: 'শিপিং ওভারভিউ',
        content: 'আপনার অর্ডার নিরাপদে এবং দক্ষতার সাথে সরবরাহ করতে আমরা বিশ্বস্ত তৃতীয় পক্ষের শিপিং পরিষেবাগুলির সাথে অংশীদারিত্ব করি। পণ্যগুলি নিখুঁত অবস্থায় পৌঁছানোর নিশ্চিত করতে আমাদের দল আপনার পণ্যগুলি প্যাকেজিং করার ক্ষেত্রে সঠিক যত্ন নেয়।',
        icon: 'truck'
      },
      {
        id: 'timeline',
        title: 'ডেলিভারির সময়সীমা',
        content: 'অর্ডারগুলি সাধারণত ২৪-৪৮ ঘন্টার মধ্যে প্রক্রিয়া করা হয়। একবার শিপ করার পরে, আপনার অবস্থানের উপর নির্ভর করে ডেলিভারি সাধারণত ৪৮-৭২ ঘন্টা সময় নেয়। আপনার অর্ডার প্রেরিত হলে আপনি ইমেইল/এসএমএসের মাধ্যমে ট্র্যাকিং তথ্য পাবেন।',
        icon: 'clock'
      },
      {
        id: 'packaging',
        title: 'প্যাকেজিং এবং যত্ন',
        content: 'শিপিং করার আগে প্রতিটি পণ্য যত্ন সহকারে পরিদর্শন করা হয় এবং নিরাপদে প্যাকেজ করা হয়। ট্রানজিটের সময় আপনার আইটেমগুলি রক্ষা করতে আমরা উচ্চমানের প্যাকেজিং উপকরণ ব্যবহার করি। ভঙ্গুড়ে আইটেমগুলি অতিরিক্ত কুশনিং এবং বিশেষ হ্যান্ডলিং পায়।',
        icon: 'package'
      },
      {
        id: 'tracking',
        title: 'অর্ডার ট্র্যাকিং',
        content: 'রিয়েল-টাইম ট্র্যাকিং সহ আপনার অর্ডারের স্থিতি সম্পর্কে অবহিত থাকুন। আপনার অর্ডার শিপ হওয়ার পরে, আপনি এসএমএস এবং ইমেইলের মাধ্যমে একটি ট্র্যাকিং নম্বর পাবেন। আপনার প্যাকেজের যাত্রা মনিটর করতে এই নম্বরটি ব্যবহার করুন।',
        icon: 'navigation'
      },
      {
        id: 'areas',
        title: 'সেবা এলাকা',
        content: 'আমরা বর্তমানে সারাদেশের সমস্ত প্রধান শহর এবং শহুরে এলাকায় শিপিং করি। দূরবর্তী অবস্থানের জন্য, ডেলিভারির সময় পরিবর্তিত হতে পারে। আপনার নির্দিষ্ট এলাকায় শিপিং সম্পর্কে আপনার যদি কোনো প্রশ্ন থাকে তবে আমাদের সাথে যোগাযোগ করুন।',
        icon: 'map-pin'
      },
      {
        id: 'cost',
        title: 'শিপিং খরচ',
        content: 'শিপিং খরচ আপনার অবস্থান এবং অর্ডারের ওজনের উপর ভিত্তি করে গণনা করা হয়। আপনার ক্রয় সম্পূর্ণ করার আগে চেকআউটে চূড়ান্ত শিপিং ফি প্রদর্শিত হবে। আমরা মাঝে মাঝে ফ্রি শিপিং প্রচার অফার করি - সাথেই থাকুন!',
        icon: 'credit-card'
      },
      {
        id: 'issues',
        title: 'শিপিং সমস্যা',
        content: 'আপনার অর্ডার যদি আনুমানিক ডেলিভারির সময়ের বেশি দেরি হয়, অথবা আপনি যদি ক্ষতিগ্রস্ত প্যাকেজ পান, তবে দয়া করে ৪৮ ঘন্টার মধ্যে ছবি সহ আমাদের সাথে যোগাযোগ করুন। সমস্যাটি দ্রুত সমাধান করতে আমরা আমাদের শিপিং অংশীদারদের সাথে কাজ করব।',
        icon: 'alert-circle'
      }
    ]
  }
}

const currentShipping = computed(() => shippingTranslations[locale.value] || shippingTranslations.en)

// Page metadata - server-side optimized SEO
if (import.meta.server) {
  useSeoMeta({
    title: 'Shipping Information',
    description: 'Learn about INDOORSHOPPING shipping policies, delivery times, and tracking information.',
    ogTitle: 'Shipping Information | INDOORSHOPPING',
    ogDescription: 'Learn about INDOORSHOPPING shipping policies, delivery times, and tracking information.',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Shipping Information | INDOORSHOPPING',
    twitterDescription: 'Learn about INDOORSHOPPING shipping policies, delivery times, and tracking information.',
  })
}

definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="py-12 lg:py-16 bg-luxury-surface dark:bg-luxury-dark-surface transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text mb-4">
            {{ currentShipping.title }}
          </h1>
          <p class="text-lg text-luxury-text-muted dark:text-luxury-dark-text-muted max-w-2xl mx-auto">
            {{ currentShipping.subtitle }}
          </p>
        </div>
      </div>
    </section>

    <!-- Shipping Content -->
    <section class="py-16 lg:py-24 bg-luxury-bg dark:bg-luxury-dark-bg transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Key Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <UiBaseCard class="text-center p-6">
            <div class="text-4xl font-bold text-luxury-gold mb-2">48-72h</div>
            <div class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">Typical Delivery</div>
          </UiBaseCard>
          <UiBaseCard class="text-center p-6">
            <div class="text-4xl font-bold text-luxury-gold mb-2">24-48h</div>
            <div class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">Processing Time</div>
          </UiBaseCard>
          <UiBaseCard class="text-center p-6">
            <div class="text-4xl font-bold text-luxury-gold mb-2">{{ $t('nav.contact') }}</div>
            <div class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">Support Available</div>
          </UiBaseCard>
        </div>

        <!-- Shipping Sections -->
        <div class="max-w-3xl mx-auto space-y-6">
          <!-- Section Card -->
          <UiBaseCard
            v-for="section in currentShipping.sections"
            :key="section.id"
            class="p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300"
          >
            <div class="flex items-start gap-4">
              <!-- Icon -->
              <div class="shrink-0 w-14 h-14 rounded-full bg-luxury-surface dark:bg-luxury-dark-surface border-2 border-luxury-border dark:border-luxury-dark-border flex items-center justify-center">
                <UiIcon :name="section.icon" :size="28" class="text-luxury-gold" />
              </div>

              <!-- Content -->
              <div class="flex-1">
                <h2 class="text-xl sm:text-2xl font-bold text-luxury-text dark:text-luxury-dark-text mb-3">
                  {{ section.title }}
                </h2>
                <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted leading-relaxed">
                  {{ section.content }}
                </p>
              </div>
            </div>
          </UiBaseCard>
        </div>

        <!-- Contact CTA -->
        <SectionsContactCTA
          title="Need Help?"
          description="If you have any questions about shipping or delivery, please don't hesitate to reach out to us."
        />
      </div>
    </section>
  </div>
</template>
