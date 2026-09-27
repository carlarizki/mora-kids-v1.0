import React, { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { MoraLogo, MoraSectionHeader, MoraButton, MoraSunBob } from './ui/MoraPrimitives';
import { sound } from '../utils/audio';

interface MoraFooterSectionsProps {
  onSelectPlan: (plan: string) => void;
  onOpenParentCorner: () => void;
  onSelectRealm: (realm: string) => void;
}

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    note: 'A bright way to begin.',
    items: ['Limited activities', '1 child profile', 'Basic features'],
  },
  {
    name: 'Plus',
    price: '$5.90',
    note: 'More moments, more possibilities.',
    items: ['Full activity library', 'Up to 3 child profiles', 'Save moments & notes', 'Family circle'],
  },
  {
    name: 'Family',
    price: '$9.90',
    note: 'For bigger families and extra support.',
    items: ['Everything in Plus', 'Up to 5 child profiles', 'Extended family circle', 'Early feature access'],
  },
];

const STORIES = [
  { quote: '“Mora gives us simple ideas that actually fit our everyday life.”', author: 'Andini, mom of 1' },
  { quote: '“I love how Mora helps us slow down and enjoy the little moments together.”', author: 'Rafael, dad of 1' },
  { quote: '“It’s not just activities—it’s a new way for our family to connect.”', author: 'Sarah, mom of 2' },
];

export const MoraFooterSections: React.FC<MoraFooterSectionsProps> = ({
  onSelectPlan,
  onOpenParentCorner,
  onSelectRealm,
}) => {
  const [activePlan, setActivePlan] = useState('Plus');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      sound.playSuccess();
      setSubscribed(true);
    }
  };

  return (
    <>
      {/* PRICING SECTION */}
      <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 lg:py-24 lg:px-8">
        <MoraSectionHeader eyebrow="Simple plans for brighter days" centered>
          Find what works for your family.
        </MoraSectionHeader>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const isSelected = activePlan === plan.name;

            return (
              <article
                key={plan.name}
                onClick={() => {
                  sound.playPop();
                  setActivePlan(plan.name);
                }}
                className={`relative cursor-pointer rounded-2xl p-7 transition-all ${
                  isSelected
                    ? 'border-2 border-primary bg-card shadow-play scale-[1.02]'
                    : 'paper-card hover:-translate-y-1'
                }`}
              >
                {plan.name === 'Plus' && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground select-none">
                    Most popular
                  </span>
                )}

                <h3 className="text-xl font-black font-display text-foreground">{plan.name}</h3>
                <p className="text-sm text-ink-soft mt-0.5">{plan.note}</p>

                <p className="my-5 text-4xl font-black font-display text-foreground">
                  {plan.price}
                  <span className="text-sm font-medium text-ink-soft"> / month</span>
                </p>

                <ul className="space-y-2.5 text-sm text-foreground">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="size-4 text-mint shrink-0" strokeWidth={3} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <MoraButton
                  variant={isSelected ? 'joyful' : 'outline'}
                  className="mt-8 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playPop();
                    onSelectPlan(plan.name);
                  }}
                >
                  {plan.name === 'Plus' ? 'Start free trial' : 'Get started'}
                </MoraButton>
              </article>
            );
          })}
        </div>
      </section>

      {/* STORIES SECTION */}
      <section id="stories" className="bg-sky-soft py-20 lg:py-24 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <MoraSectionHeader eyebrow="Loved by families">
              Real stories.
              <br />
              <span className="text-primary">Brighter days.</span>
            </MoraSectionHeader>

            <div className="flex gap-2">
              <MoraButton size="icon" variant="outline" aria-label="Previous story">
                <ChevronLeft className="size-4" />
              </MoraButton>
              <MoraButton size="icon" variant="outline" aria-label="Next story">
                <ChevronRight className="size-4" />
              </MoraButton>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STORIES.map(({ quote, author }, idx) => (
              <blockquote key={idx} className="rounded-2xl bg-card p-7 shadow-soft flex flex-col justify-between">
                <p className="text-base sm:text-lg font-semibold leading-relaxed text-foreground">
                  {quote}
                </p>
                <footer className="mt-5 text-sm font-medium text-ink-soft">
                  — {author}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* INSPIRATION NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-secondary px-6 py-10 sm:px-12 border border-primary/10">
          <MoraSunBob className="absolute -left-3 top-7 animate-bob hidden sm:flex" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2">
            <div className="sm:pl-10">
              <p className="font-hand font-bold text-primary text-base uppercase tracking-wider select-none">
                TIPS, IDEAS &amp; MORE
              </p>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-foreground mt-1">
                A little inspiration in your inbox.
              </h2>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                Gentle ideas, parenting tips, and new features—straight to your inbox.
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center justify-center gap-3 font-bold text-mint text-base py-3">
                <Check className="size-6 text-mint" strokeWidth={3} />
                <span>You're on the list! Welcome to Mora.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-12 flex-1 rounded-full bg-card px-5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-xs"
                  aria-label="Email address"
                />
                <MoraButton type="submit" variant="joyful" className="h-12 px-7">
                  Subscribe
                </MoraButton>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12 bg-card/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-4 lg:px-8">
          <div>
            <MoraLogo />
            <p className="mt-2 text-sm font-semibold text-ink-soft">
              Their day. Together.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Small ideas for brighter family days.
            </p>
          </div>

          {[
            {
              title: 'Product',
              links: [
                { name: 'Features', href: '#features' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'Play & Games', href: '#games' },
                { name: 'How it works', href: '#how-it-works' },
              ],
            },
            {
              title: 'Resources',
              links: [
                { name: 'Activity ideas', href: '#features' },
                { name: 'Parenting tips', href: '#features' },
                { name: 'Stories', href: '#stories' },
                { name: 'Family routines', href: '#for-families' },
              ],
            },
            {
              title: 'For families',
              links: [
                { name: 'Grown-ups Dashboard', action: onOpenParentCorner },
                { name: 'Invite family', href: '#for-families' },
                { name: 'Family circle', href: '#for-families' },
                { name: 'Community', href: '#stories' },
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h3 className="font-black text-sm font-display text-foreground">{title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.action ? (
                      <button
                        onClick={() => {
                          sound.playPop();
                          link.action();
                        }}
                        className="hover:text-primary transition-colors cursor-pointer text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        className="hover:text-primary transition-colors"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-7xl px-5 lg:px-8 mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Mora. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-foreground cursor-pointer">Privacy</span>
            <span>·</span>
            <span className="hover:text-foreground cursor-pointer">Terms</span>
            <span>·</span>
            <span className="hover:text-foreground cursor-pointer">Security</span>
          </div>
        </div>
      </footer>
    </>
  );
};
