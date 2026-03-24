import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Time Capsule?",
    answer:
      "Time Capsule is a digital platform that lets you preserve memories — photos, letters, videos, and messages — and lock them until a future date you choose. When the time comes, your capsule is unlocked and delivered to you or your loved ones.",
  },
  {
    question: "How do I create a time capsule?",
    answer:
      "Simply sign up, click 'Create New Capsule' from your dashboard, add your content (text, images, or files), set an unlock date, and seal it. Your capsule will remain locked and secure until the date arrives.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Absolutely. We take privacy seriously. All capsules are encrypted and stored securely. Only you and the recipients you choose can access your content when it's unlocked.",
  },
  {
    question: "Can I share a capsule with friends or family?",
    answer:
      "Yes! You can invite friends and family as recipients when creating a capsule. They'll be notified when the capsule unlocks. You can also explore public capsules in the Discovery section.",
  },
  {
    question: "Can I edit a capsule after sealing it?",
    answer:
      "Once a capsule is sealed, its contents are locked to preserve the authenticity of the moment. However, you can add notes or create a new companion capsule linked to the original.",
  },
  {
    question: "What happens when a capsule unlocks?",
    answer:
      "You and any designated recipients will receive a notification. The capsule contents become viewable, and you can choose to keep it private, share it publicly, or re-seal it for a future date.",
  },
  {
    question: "Is Time Capsule free to use?",
    answer:
      "Time Capsule offers a free tier that lets you create and store capsules with basic features. Premium plans unlock additional storage, advanced sharing options, and priority support.",
  },
  {
    question: "What file types can I include in a capsule?",
    answer:
      "You can include text messages, photos (JPEG, PNG, WebP), videos, audio recordings, and PDF documents. We're constantly expanding supported formats based on user feedback.",
  },
  {
    question: "Can I delete a capsule?",
    answer:
      "Yes, you can delete any capsule you own at any time — even if it's still sealed. Deleted capsules are permanently removed and cannot be recovered.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach our support team through the Help & Support option in your dashboard settings, or email us directly. We typically respond within 24 hours.",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="container-narrow text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            FAQ
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about Time Capsule. Can't find an answer? Reach out to our support team.
          </p>
        </section>

        {/* Accordion */}
        <section className="container-narrow max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl bg-card/40 border border-border/30 px-6 hover:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
