<script setup lang="ts">
const { locale } = useI18n()

// Privacy policy data with language support
const privacyTranslations: Record<string, any> = {
  en: {
    title: 'Privacy Policy',
    subtitle: 'Your privacy is important to us. This policy explains how we collect, use, and protect your information.',
    lastUpdated: 'Last Updated: January 2025',
    sections: [
      {
        id: 'information',
        title: 'Information We Collect',
        content: 'We collect information you provide directly to us, including: name, email address, phone number, shipping address, and payment information when you make a purchase. We also collect information about your device and browsing behavior on our website.'
      },
      {
        id: 'usage',
        title: 'How We Use Your Information',
        content: 'We use your information to process and fulfill your orders, communicate with you about your orders, send you promotional communications (with your consent), improve our website and services, and comply with legal obligations.'
      },
      {
        id: 'sharing',
        title: 'Information Sharing',
        content: 'We do not sell your personal information. We may share your information with: (1) Third-party shipping providers to deliver your orders, (2) Payment processors to process transactions, (3) Service providers who assist our business operations. All third parties are obligated to protect your information.'
      },
      {
        id: 'security',
        title: 'Data Security',
        content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.'
      },
      {
        id: 'rights',
        title: 'Your Rights',
        content: 'You have the right to: access your personal information, correct inaccurate information, request deletion of your information, object to processing of your information, and withdraw consent at any time. Contact us to exercise these rights.'
      },
      {
        id: 'cookies',
        title: 'Cookies and Tracking',
        content: 'We use cookies and similar technologies to improve your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.'
      },
      {
        id: 'updates',
        title: 'Policy Updates',
        content: 'We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date.'
      }
    ]
  },
  bn: {
    title: 'গোপনীয়তা নীতি',
    subtitle: 'আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ। এই নীতি ব্যাখ্যা করে যে আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি।',
    lastUpdated: 'সর্বশেষ আপডেট: জানুয়ারি ২০২৫',
    sections: [
      {
        id: 'information',
        title: 'তথ্য সংগ্রহ',
        content: 'আমরা সেই তথ্য সংগ্রহ করি যা আপনি সরাসরি আমাদের প্রদান করেন, যার মধ্যে রয়েছে: নাম, ইমেইল ঠিকানা, ফোন নম্বর, শিপিং ঠিকানা এবং কেনাকাটার সময় পেমেন্ট তথ্য। আমরা আপনার ডিভাইস এবং আমাদের ওয়েবসাইটে ব্রাউজিং আচরণ সম্পর্কেও তথ্য সংগ্রহ করি।'
      },
      {
        id: 'usage',
        title: 'তথ্যের ব্যবহার',
        content: 'আমরা আপনার তথ্য ব্যবহার করি আপনার অর্ডার প্রক্রিয়া এবং সম্পূর্ণ করতে, আপনার অর্ডার সম্পর্কে আপনার সাথে যোগাযোগ করতে, প্রচারমূলক যোগাযোগ পাঠাতে (আপনার সম্মতি সাপেক্ষে), আমাদের ওয়েবসাইট এবং পরিষেবাগুলি উন্নত করতে, এবং আইনি বাধ্যবাধকতা মেনে চলতে।'
      },
      {
        id: 'sharing',
        title: 'তথ্য ভাগাভাগি',
        content: 'আমরা আপনার ব্যক্তিগত তথ্য বিক্রি করি না। আমরা আপনার তথ্য ভাগ করতে পারি: (১) অর্ডার সরবরাহ করতে তৃতীয় পক্ষের শিপিং প্রদানকারীদের সাথে, (২) লেনদেন প্রক্রিয়া করতে পেমেন্ট প্রসেসরদের সাথে, (৩) আমাদের ব্যবসায়িক কার্যক্রমে সহায়তা করে এমন পরিষেবা প্রদানকারীদের সাথে। সমস্ত তৃতীয় পক্ষ আপনার তথ্য সুরক্ষিত রাখতে বাধ্য।'
      },
      {
        id: 'security',
        title: 'তথ্য নিরাপত্তা',
        content: 'আপনার ব্যক্তিগত তথ্য অননুমোদিত অ্যাক্সেস, পরিবর্তন, প্রকাশ বা ধ্বংসের বিরুদ্ধে সুরক্ষিত করতে আমরা উপযুক্ত প্রযুক্তিগত এবং সাংগঠনিক ব্যবস্থা গ্রহণ করি। তবে, ইন্টারনেটের মাধ্যমে কোনো প্রেরণ পদ্ধতি ১০০% নিরাপদ নয়।'
      },
      {
        id: 'rights',
        title: 'আপনার অধিকার',
        content: 'আপনার অধিকার রয়েছে: আপনার ব্যক্তিগত তথ্য অ্যাক্সেস করার, ভুল তথ্য সংশোধন করার, তথ্য মুছে ফেলার অনুরোধ করার, তথ্য প্রক্রিয়াকরণের বিরোধিতা করার, এবং যেকোনো সময় সম্মতি প্রত্যাহার করার। এই অধিকারগুলি প্রয়োগ করতে আমাদের সাথে যোগাযোগ করুন।'
      },
      {
        id: 'cookies',
        title: 'কুকিজ এবং ট্র্যাকিং',
        content: 'আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে, সাইট ট্রাফিক বিশ্লেষণ করতে এবং কন্টেন্ট ব্যক্তিগতকৃত করতে আমরা কুকিজ এবং অনুরূপ প্রযুক্তি ব্যবহার করি। আপনি আপনার ব্রাউজার পছন্দ মাধ্যমে কুকি সেটিংস নিয়ন্ত্রণ করতে পারেন।'
      },
      {
        id: 'updates',
        title: 'নীতি আপডেট',
        content: 'আমরা সময়ে সময়ে এই গোপনীয়তা নীতি আপডেট করতে পারি। আমরা আমাদের ওয়েবসাইটে নতুন নীতি পোস্ট করে এবং "সর্বশেষ আপডেট" তারিখ আপডেট করে কোনো উল্লেখযোগ্য পরিবর্তনের বিষয়ে আপনাকে অবহিত করব।'
      }
    ]
  }
}

const currentPrivacy = computed(() => privacyTranslations[locale.value] || privacyTranslations.en)

// Page metadata
useHead({
  title: 'Privacy Policy - URBANEASE',
  meta: [
    { name: 'description', content: 'Learn about how URBANEASE collects, uses, and protects your personal information.' }
  ]
})

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
            {{ currentPrivacy.title }}
          </h1>
          <p class="text-lg text-luxury-text-muted dark:text-luxury-dark-text-muted max-w-2xl mx-auto">
            {{ currentPrivacy.subtitle }}
          </p>
          <p class="text-sm text-luxury-gold mt-4 font-medium">
            {{ currentPrivacy.lastUpdated }}
          </p>
        </div>
      </div>
    </section>

    <!-- Privacy Policy Content -->
    <section class="py-16 lg:py-24 bg-luxury-bg dark:bg-luxury-dark-bg transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto space-y-6">
          <!-- Policy Section -->
          <UiBaseCard
            v-for="section in currentPrivacy.sections"
            :key="section.id"
            class="p-6 sm:p-8"
          >
            <h2 class="text-xl sm:text-2xl font-bold text-luxury-text dark:text-luxury-dark-text mb-4 flex items-center">
              <span class="w-2 h-8 bg-luxury-gold rounded-full mr-4 shrink-0"></span>
              {{ section.title }}
            </h2>
            <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted leading-relaxed">
              {{ section.content }}
            </p>
          </UiBaseCard>
        </div>

        <!-- Contact CTA -->
        <SectionsContactCTA
          title="Have Questions?"
          description="If you have any questions about our privacy policy, please don't hesitate to contact us."
        />
      </div>
    </section>
  </div>
</template>
