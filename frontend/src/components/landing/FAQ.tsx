import { FadeInUp } from "@/components/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Pro and Team plans can be cancelled with one click — you keep access until the end of the billing period. No refunds, no gotchas.",
  },
  {
    q: "Will my resume actually pass an ATS?",
    a: "Yes — every template is tested against Workday, Greenhouse, Lever, Ashby and Taleo. The ATS Score tab shows you exactly how each system parses your resume and which keywords are missing.",
  },
  {
    q: "Is my data private?",
    a: "Your resume data stays on your account and is never used to train models. You can delete your account and all data at any time from Settings.",
  },
  {
    q: "What file formats do you support?",
    a: "Upload PDF or DOCX and we parse it into structured data. Export is always a pristine LaTeX-rendered PDF.",
  },
  {
    q: "How does tailoring to a job description work?",
    a: "Paste any JD on the Tailor tab. Claude analyzes it against your resume, highlights gaps, and proposes targeted rewrites that you can accept, reject, or edit.",
  },
  {
    q: "Can I use multiple templates?",
    a: "Yes — switch any resume between our 5 templates (Jake's, Modern, Classic, Minimal, Deedy) with a single click. The underlying content stays the same.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-28">
      <div className="mx-auto max-w-3xl px-6">
        <FadeInUp className="text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#054d28]">
            FAQ
          </p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-foreground">
            Questions?
            <br />
            We have answers.
          </h2>
        </FadeInUp>

        <FadeInUp delay={0.15} className="mt-12">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="border-b border-[rgba(14,15,12,0.10)]"
              >
                <AccordionTrigger className="py-6 text-left text-lg font-semibold text-foreground hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeInUp>
      </div>
    </section>
  );
}
