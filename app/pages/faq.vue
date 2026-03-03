<script setup lang="ts">
const { locale } = useI18n()

// FAQ data defined directly to avoid i18n lazy loading issues
const faqTranslations: Record<string, any> = {
  en: {
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions about our products, services, and policies',
    questions: [
      {
        id: 'returns',
        question: 'Do you support returns?',
        answer: 'Yes, we support returns in the following cases: (1) If you receive the wrong product, or (2) If the product is damaged upon delivery. Please contact us within 48 hours of delivery with photos of the damaged product or wrong item, and we\'ll process your return request.'
      },
      {
        id: 'exchanges',
        question: 'Do you support exchanges?',
        answer: 'No, we currently do not support product exchanges. If you have an issue with your order, please refer to our return policy or contact us for assistance.'
      },
      {
        id: 'refunds',
        question: 'Do you support refunds?',
        answer: 'We do not offer refunds directly. Instead, we support returns for eligible cases such as receiving a wrong product or damaged items. Once your return is approved, we\'ll work with you to find the best solution.'
      },
      {
        id: 'warranty',
        question: 'Do you support warranty?',
        answer: 'No, we do not currently offer warranty on our products. We carefully select and quality-check all products before shipping to ensure you receive items in perfect condition.'
      },
      {
        id: 'giftCards',
        question: 'Do you support gift cards?',
        answer: 'Currently, we do not offer gift cards. However, we\'re working on introducing this feature in the future. Stay tuned for updates!'
      },
      {
        id: 'shipping',
        question: 'What is your shipping process?',
        answer: 'We use third-party shipping services to deliver your orders. Once your order is confirmed, we hand it over to our trusted shipping partners who will deliver it to your doorstep. You\'ll receive tracking information once your order has been shipped so you can monitor its progress.'
      }
    ]
  },
  bn: {
    title: 'সাধারণ প্রশ্নাবলী',
    subtitle: 'আমাদের পণ্য, সেবা এবং নীতিমালা সম্পর্কে সাধারণ প্রশ্নের উত্তর খুঁজুন',
    questions: [
      {
        id: 'returns',
        question: 'আপনারা কি রিটার্ন সাপোর্ট করেন?',
        answer: 'হ্যাঁ, আমরা নিম্নলিখিত ক্ষেত্রে রিটার্ন সাপোর্ট করি: (১) আপনি যদি ভুল পণ্য পান, অথবা (২) ডেলিভারির সময় পণ্যটি ক্ষতিগ্রস্ত হয়। দয়া করে ডেলিভারির ৪৮ ঘন্টার মধ্যে আমাদের সাথে যোগাযোগ করুন এবং ক্ষতিগ্রস্ত পণ্য বা ভুল আইটেমের ছবি পাঠান, আমরা আপনার রিটার্ন অনুরোধ প্রক্রিয়া করব।'
      },
      {
        id: 'exchanges',
        question: 'আপনারা কি এক্সচেঞ্জ সাপোর্ট করেন?',
        answer: 'না, আমরা বর্তমানে পণ্য এক্সচেঞ্জ সাপোর্ট করি না। আপনার অর্ডার নিয়ে কোনো সমস্যা থাকলে, দয়া করে আমাদের রিটার্ন পলিসি দেখুন বা সাহায্যের জন্য আমাদের সাথে যোগাযোগ করুন।'
      },
      {
        id: 'refunds',
        question: 'আপনারা কি রিফান্ড সাপোর্ট করেন?',
        answer: 'আমরা সরাসরি রিফান্ড অফার করি না। এর পরিবর্তে, আমরা ভুল পণ্য বা ক্ষতিগ্রস্ত আইটেম পাওয়ার মতো যোগ্য ক্ষেত্রে রিটার্ন সাপোর্ট করি। আপনার রিটার্ন অনুমোদিত হওয়ার পরে, আমরা আপনার সাথে সেরা সমাধান খুঁজে বের করতে কাজ করব।'
      },
      {
        id: 'warranty',
        question: 'আপনারা কি ওয়ারেন্টি সাপোর্ট করেন?',
        answer: 'না, আমরা বর্তমানে আমাদের পণ্যের ওয়ারেন্টি অফার করি না। শিপিং করার আগে আমরা সব পণ্য যত্ন সহকারে নির্বাচন এবং কোয়ালিটি চেক করি যাতে আপনি নিখুঁত অবস্থায় আইটেম পান।'
      },
      {
        id: 'giftCards',
        question: 'আপনারা কি গিফট কার্ড সাপোর্ট করেন?',
        answer: 'বর্তমানে আমরা গিফট কার্ড অফার করি না। তবে, আমরা ভবিষ্যতে এই ফিচার চালু করার জন্য কাজ করছি। আপডেটের জন্য সাথেই থাকুন!'
      },
      {
        id: 'shipping',
        question: 'আপনাদের শিপিং প্রক্রিয়া কী?',
        answer: 'আপনার অর্ডার ডেলিভারি করতে আমরা তৃতীয় পক্ষের শিপিং সেবা ব্যবহার করি। আপনার অর্ডার নিশ্চিত হওয়ার পরে, আমরা এটি আমাদের বিশ্বস্ত শিপিং পার্টনারদের কাছে হস্তান্তর করি যারা এটি আপনার দরজায় পৌঁছে দেবে। আপনার অর্ডার শিপ হওয়ার পরে আপনি ট্র্যাকিং তথ্য পাবেন যাতে আপনি এর অগ্রগতি মনিটর করতে পারেন।'
      }
    ]
  }
}

const currentFaq = computed(() => faqTranslations[locale.value] || faqTranslations.en)

const expandedQuestion = ref<string | null>(null)

const toggleQuestion = (id: string) => {
  expandedQuestion.value = expandedQuestion.value === id ? null : id
}

// Page metadata
useHead({
  title: 'FAQ',
  meta: [
    { name: 'description', content: 'Find answers to frequently asked questions about products, services, and policies.' }
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
            {{ currentFaq.title }}
          </h1>
          <p class="text-lg text-luxury-text-muted dark:text-luxury-dark-text-muted max-w-2xl mx-auto">
            {{ currentFaq.subtitle }}
          </p>
        </div>
      </div>
    </section>

    <!-- FAQ Content -->
    <section class="py-16 lg:py-24 bg-luxury-bg dark:bg-luxury-dark-bg transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto space-y-4">
          <!-- FAQ Item -->
          <UiBaseCard
            v-for="item in currentFaq.questions"
            :key="item.id"
            class="overflow-hidden"
            :class="{ 'border-luxury-gold dark:border-luxury-gold': expandedQuestion === item.id }"
          >
            <button
              class="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-luxury-surface/50 dark:hover:bg-luxury-dark-surface/50 transition-colors duration-200"
              @click="toggleQuestion(item.id)"
            >
              <span class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text pr-4">
                {{ item.question }}
              </span>
              <UiIcon
                :name="expandedQuestion === item.id ? 'chevron-up' : 'chevron-down'"
                :size="20"
                class="text-luxury-gold flex-shrink-0 transition-transform duration-200"
                :class="{ 'rotate-180': expandedQuestion === item.id }"
              />
            </button>
            <div
              v-if="expandedQuestion === item.id"
              class="px-6 pb-5 pt-0 border-t border-luxury-border dark:border-luxury-dark-border"
            >
              <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted leading-relaxed">
                {{ item.answer }}
              </p>
            </div>
          </UiBaseCard>
        </div>

        <!-- Contact CTA -->
        <SectionsContactCTA
          title="Can't find what you're looking for?"
          description="Feel free to reach out to us directly."
        />
      </div>
    </section>
  </div>
</template>
