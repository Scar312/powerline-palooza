import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  HelpCircle,
  Info,
  Plus,
  BriefcaseMedical,
  Clock,
  ShieldAlert,
  CloudLightning,
  Truck,
  Check,
} from "lucide-react";
import paypalPreferred from "@/assets/paypal-preferred.png.asset.json";
import cardIcon from "@/assets/card-icon.png.asset.json";
import paypalWordmark from "@/assets/paypal-wordmark-v2.png.asset.json";
import paypalPMark from "@/assets/paypal-p.png.asset.json";
import klarnaAsset from "@/assets/klarna-v2.png.asset.json";
import applepayAsset from "@/assets/applepay-v2.png.asset.json";
import venmoAsset from "@/assets/venmo-v2.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Checkout — Ticketmaster" },
      { name: "description", content: "Complete your ticket purchase." },
    ],
  }),
  component: CheckoutPage,
});

/* ---------------------------- Dynamic dates ---------------------------- */

function useEventDates() {
  return useMemo(() => {
    // Base event: Sun, Jul 19, 2026, 8:00 PM
    const event = new Date(2026, 6, 19, 20, 0, 0, 0);
    const barcode = new Date(event);
    barcode.setDate(barcode.getDate() - 31);
    return { event, barcode };
  }, []);
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const MONTH_SHORT_3 = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function fmtEventLong(d: Date) {
  return `${DAY_NAMES[d.getDay()]} • ${MONTH_NAMES[d.getMonth()]} ${d.getDate().toString().padStart(2, "0")}, ${d.getFullYear()} • 8:00 PM`;
}
function fmtBarcode(d: Date) {
  return `8:00 PM EDT on ${MONTH_NAMES[d.getMonth()]} ${ordinal(d.getDate())}.`;
}
function fmtInsuranceDate(d: Date) {
  const yy = d.getFullYear().toString().slice(-2);
  return `${MONTH_SHORT_3[d.getMonth()]}-${d.getDate().toString().padStart(2, "0")}-${yy}`;
}

function fmtMoney(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


/* ------------------------------- Header ------------------------------- */

function TopBar() {
  const [seconds, setSeconds] = useState(7 * 60 + 51);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    startRef.current = Date.now();
    const initial = 7 * 60 + 51;
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (startRef.current ?? Date.now())) / 1000);
      const left = Math.max(0, initial - elapsed);
      setSeconds(left);
      if (left <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  return (
    <header className="sticky top-0 z-30 bg-black text-white">
      <div className="relative flex h-9 items-center justify-center px-5">
        <button className="absolute left-5 text-[15px] font-normal tracking-tight text-white">
          Cancel
        </button>
        <h1 className="text-[15px] font-bold tracking-tight">Checkout</h1>
        <span className="absolute right-5 text-[13px] font-normal tabular-nums tracking-tight">
          {mm}:{ss}
        </span>
      </div>
    </header>
  );
}

/* ------------------------------- Cards ------------------------------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`bg-tm-surface rounded-[2px] border border-tm-border shadow-[0_1px_2px_rgba(17,24,39,0.06),-8px_0_16px_-12px_rgba(17,24,39,0.22),8px_0_16px_-12px_rgba(17,24,39,0.22),0_10px_22px_-14px_rgba(17,24,39,0.22)] ${className}`}
    >
      {children}
    </section>
  );
}

function EventCard({ event }: { event: Date }) {
  return (
    <Card className="mt-3 px-6 pb-6 pt-6">
      <h2 className="text-[22px] font-bold uppercase leading-[1.15] tracking-[0.005em] text-tm-text">
        Tame Impala - The Deadbeat Tour
      </h2>
      <div className="mt-4 space-y-3 text-[15px] leading-snug text-tm-muted">
        <p>{fmtEventLong(event)}</p>
        <p>Spectrum Center, Charlotte, NC</p>
        <p>
          2 Tickets - Sec 230, Row J, Seats 1 - 2
          <br />
          <a className="text-tm-link underline underline-offset-2" href="#">
            View Seats
          </a>
        </p>
      </div>
      <div className="mt-5 border-t border-tm-border pt-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-white">
            <Info className="h-3 w-3" strokeWidth={3} />
          </span>
          <div>
            <div className="text-[14px] text-tm-muted">Ticket Information</div>
            <div className="mt-0.5 text-[15px] font-normal uppercase tracking-wide text-tm-muted">
              200 Level
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DeliveryCard({ barcode }: { barcode: Date }) {
  return (
    <Card className="mt-3 px-6 pb-6 pt-6">
      <h2 className="text-[22px] font-bold uppercase tracking-[0.005em] text-tm-text">Delivery</h2>
      <div className="mt-5 flex items-baseline justify-between">
        <div className="text-[17px] font-bold text-tm-text">Mobile</div>
        <div className="text-[15px] font-bold uppercase text-tm-text">Free</div>
      </div>
      <p className="mt-3 text-[15px] leading-snug text-tm-muted">
        Mobile: To access your tickets for entry, you'll need to download the Ticketmaster App or
        add your tickets to your mobile wallet.
      </p>
      <div className="mt-5 border-t border-tm-border pt-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tm-link text-white">
            <Info className="h-3 w-3" strokeWidth={3} />
          </span>
          <p className="text-[15px] leading-snug text-tm-text">
            The barcode on your ticket will display at{" "}
            <span className="font-bold">{fmtBarcode(barcode)}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------ Payment ------------------------------ */

function PaymentCard({
  promo,
  setPromo,
}: {
  promo: string | null;
  setPromo: (c: string | null) => void;
}) {
  return (
    <Card className="mt-3 px-6 pb-6 pt-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[22px] font-bold uppercase tracking-[0.005em] text-tm-text">Payment</h2>
        <img
          src={paypalPreferred.url}
          alt="PayPal Preferred Payments Partner"
          className="h-[56px] w-auto object-contain"
        />
      </div>

      <div className="mt-7 text-[19px] font-bold text-tm-text">Use Credit / Debit Card</div>
      <button className="mt-4 flex w-full items-center gap-4 py-2 text-left">
        <Plus className="h-7 w-7 text-tm-link" strokeWidth={2.5} />
        <img src={cardIcon.url} alt="" className="h-12 w-16 object-contain" />
        <span className="text-[19px] font-bold text-tm-link">Add New Card</span>
      </button>

      <div className="mt-5 border-t border-tm-border pt-5">
        <div className="text-[17px] font-bold text-tm-text">Or Pay With</div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <PayBtn className="bg-[#ffc439]">
            <img src={paypalWordmark.url} alt="PayPal" className="max-h-[18px] object-contain" />
          </PayBtn>
          <PayBtn className="bg-[#ffc439] gap-1.5">
            <img src={paypalPMark.url} alt="PayPal" className="max-h-[18px] object-contain" />
            <span className="text-[15px] font-semibold text-tm-text">Pay Later</span>
          </PayBtn>
          <PayBtn className="bg-[#ffb3c7]">
            <img src={klarnaAsset.url} alt="Klarna" className="max-h-[16px] object-contain" />
          </PayBtn>
          <PayBtn className="bg-black">
            <img src={applepayAsset.url} alt="Apple Pay" className="max-h-[18px] object-contain" />
          </PayBtn>
          <PayBtn className="bg-[#3d95ce]">
            <img src={venmoAsset.url} alt="Venmo" className="max-h-[16px] object-contain" />
          </PayBtn>
        </div>
      </div>

      <p className="mt-6 text-[15px] leading-snug text-tm-text">
        Starting at <span className="whitespace-nowrap">$19.34</span>/mo or as low as 0% APR with{" "}
        <span className="font-bold">PayPal.</span>{" "}
        <a className="text-tm-link underline underline-offset-2" href="#">
          Learn more
        </a>
      </p>
      <p className="mt-4 text-[15px] leading-snug text-tm-text">
        By using a digital wallet and continuing past this page, you have read and are accepting the
        current{" "}
        <a className="text-tm-link underline underline-offset-2" href="#">
          Terms of Use
        </a>{" "}
        and{" "}
        <a className="text-tm-link underline underline-offset-2" href="#">
          Standard Purchase Policy
        </a>
        , including the arbitration agreement and class action waiver, updated in August 2025.
      </p>

      <div className="mt-6 border-t border-tm-border pt-6">
        <PromoBlock applied={promo} onApplied={setPromo} />
      </div>
    </Card>
  );
}

function PayBtn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      className={`flex h-8 items-center justify-center overflow-hidden rounded-md text-[13px] active:scale-[0.98] transition ${className}`}
    >
      {children}
    </button>
  );
}

function AppleLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.36 12.93c-.02-2.28 1.86-3.37 1.94-3.43-1.06-1.55-2.71-1.77-3.3-1.79-1.41-.14-2.74.82-3.46.82-.71 0-1.81-.8-2.98-.78-1.54.02-2.96.89-3.75 2.27-1.6 2.77-.41 6.87 1.15 9.12.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.96-.74 1.38 0 1.77.74 2.98.71 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.02-2.4-.92-2.41-3.67zM14.04 6.4c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.68 1.37-.59.67-1.11 1.76-.97 2.79 1.02.08 2.07-.52 2.71-1.26z" />
    </svg>
  );
}

/* --------------------------- Promo Code Section --------------------------- */

function PromoBlock({
  applied,
  onApplied,
}: {
  applied: string | null;
  onApplied: (code: string | null) => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const apply = () => {
    if (!code.trim()) {
      setError("Enter a promo code");
      return;
    }
    const validCodes = ["student201", "study2026", "uniaccess11", "campus90"];
    if (!validCodes.includes(code.trim().toLowerCase())) {
      setError("Invalid code. Go to mastersaver.site to get a new code.");
      return;
    }
    onApplied(code.trim().toUpperCase());
    setError(null);
  };

  const remove = () => {
    onApplied(null);
    setCode("");
    setError(null);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="promo-section flex w-full items-center justify-center gap-4 text-center"
      >
        <Plus className="h-6 w-6 shrink-0 text-tm-link" strokeWidth={1.75} />
        <span className="text-[18px] font-semibold leading-[1.25] text-tm-link">
          Add Credits / Promo Codes / Gift Cards
        </span>
      </button>
    );
  }

  return (
    <div className="promo-section text-left">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-[20px] font-semibold leading-[1.2] tracking-[0.005em] text-tm-text">
          Add Credits / Promo Codes / Gift Cards
        </h2>
        <button
          onClick={() => setOpen(false)}
          className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-tm-text text-tm-text"
          aria-label="Collapse"
        >
          <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>

      <p className="mt-5 text-[16px] leading-[1.45] text-tm-text">
        Combine up to 10 gift cards and promo codes. Keep your gift cards in case of a refund.
      </p>

      {applied ? (
        <div className="mt-5 rounded-md border border-tm-green bg-[oklch(0.96_0.06_152)] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-tm-green text-white">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </div>
              <div>
                <div className="text-[14px] font-bold text-tm-text">
                  Student Discount Applied!
                </div>
                <div className="text-[12px] text-tm-muted">Code: {applied}</div>
              </div>
            </div>
            <button onClick={remove} className="text-[13px] font-bold text-tm-link">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <>
          <label className="mt-5 block text-[15px] text-tm-text">
            Credit / Promo Code / Gift Card Number
          </label>
          <div className="relative mt-2">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (error) setError(null);
              }}
              placeholder="Enter Code or Number"
              className="h-12 w-full rounded-sm border border-tm-muted/60 bg-tm-surface px-3 pr-10 text-[16px] uppercase text-tm-text outline-none placeholder:normal-case placeholder:text-tm-muted/60 focus:border-tm-link"
            />
            {code.trim().length > 0 && (
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-tm-green text-tm-green">
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            )}
          </div>
          {error && (
            <p className="mt-2 text-[13px] font-bold text-tm-red">{error}</p>
          )}
          <div className="mt-4 flex justify-end">
            <button
              onClick={apply}
              disabled={!code.trim()}
              className="h-11 rounded-sm border border-tm-link px-7 text-[17px] font-bold text-tm-link disabled:opacity-40"
            >
              Apply
            </button>
          </div>
        </>
      )}
    </div>
  );
}


/* ----------------------------- Insurance ----------------------------- */

function InsuranceCard({
  choice,
  setChoice,
  ticketTotal,
  insurancePrice,
  perTicket,
  eventDate,
}: {
  choice: "yes" | "no" | null;
  setChoice: (c: "yes" | "no") => void;
  ticketTotal: number;
  insurancePrice: number;
  perTicket: number;
  eventDate: Date;
}) {
  return (
    <Card className="mt-3 overflow-hidden pb-6">
      <div className="flex items-start justify-between gap-4 px-6 pt-6">
        <h2 className="text-[22px] font-bold uppercase leading-[1.15] tracking-[0.005em] text-tm-text">
          Ticket
          <br />
          Insurance
        </h2>
        {choice === null && (
          <div className="rounded-[2px] border-2 border-tm-red px-3 py-2 text-center text-[13px] font-extrabold uppercase leading-[1.1] tracking-wide text-tm-red">
            Selection
            <br />
            Required
          </div>
        )}
      </div>

      <div className="px-6 pt-6">
        <p className="text-[16px] leading-snug text-tm-text">
          With Ticket Insurance, <span className="font-bold">you can get back up to 100% of your money,</span> including taxes, parking, fees, or other event-related costs in your order. This protection is <span className="font-bold">available for just ${fmtMoney(perTicket)} per ticket (${fmtMoney(insurancePrice)} total).</span>
        </p>
        <p className="mt-4 text-[16px] leading-snug text-tm-text">
          It's inexpensive for the peace of mind it can give you when something unexpected happens. If you can't attend this event for a number of covered reasons like covered illness, injury, airline delays, traffic accidents, weather emergencies, mechanical breakdowns, if you're required to work and more, you can be reimbursed for your resale ticket purchase.
        </p>


        <ul className="mt-5 space-y-4">
          <Reason icon={<BriefcaseMedical className="h-4 w-4" strokeWidth={2.2} />}>
            Covered Illness or Injury
          </Reason>
          <Reason icon={<Clock className="h-4 w-4" strokeWidth={2.2} />}>
            Transportation Delay
          </Reason>
          <Reason icon={<ShieldAlert className="h-4 w-4" strokeWidth={2.2} />}>
            Stolen Tickets
          </Reason>
          <Reason icon={<Truck className="h-4 w-4" strokeWidth={2.2} />}>
            Mechanical Breakdown
          </Reason>
          <Reason icon={<CloudLightning className="h-4 w-4" strokeWidth={2.2} />}>
            Weather Emergency
          </Reason>
        </ul>

        <p className="mt-5 text-[15px] leading-snug text-tm-text">
          Plus, always have access to 24/7 help from real people that can give you driving
          suggestions, parking information, make group arrangements, and much more.
        </p>

        <div className="mt-6 flex justify-end">
          <span className="rounded-t-md bg-tm-blue px-3 py-1 text-[11px] font-extrabold tracking-wider text-white">
            HIGHLY RECOMMENDED
          </span>
        </div>
        <button
          onClick={() => setChoice("yes")}
          className="flex w-full items-start gap-4 rounded-md rounded-tr-none border-2 border-tm-blue bg-tm-surface px-4 py-4 text-left"
        >
          <Radio selected={choice === "yes"} />
          <div className="flex-1">
            <div className="text-[16px] font-bold text-tm-text">
              Yes, protect my ticket purchase.
            </div>
            <div className="mt-1 text-[15px] text-tm-muted">
              Tame Impala - The Deadbeat Tour • Spectrum Center, Charlotte, NC • {fmtInsuranceDate(eventDate)}
            </div>
          </div>
        </button>

        <button
          onClick={() => setChoice("no")}
          className="mt-4 flex w-full items-start gap-4 px-1 text-left"
        >
          <Radio selected={choice === "no"} />
          <div className="flex-1 text-[16px] leading-snug text-tm-text">
            No, do not protect my ticket purchase. I understand this may put my{" "}
            <span className="whitespace-nowrap">${fmtMoney(ticketTotal)}</span> at risk.
          </div>
        </button>

        <button className="mt-5 inline-flex items-center gap-2 rounded-sm border border-tm-border px-3 py-2 text-[14px] text-tm-text">
          Free Look Period
          <HelpCircle className="h-4 w-4 text-tm-link" />
        </button>

        <p className="mt-6 text-[15px] leading-snug text-tm-text">
          <a className="text-tm-link underline underline-offset-2" href="#">
            Plan &amp; Pricing details, disclosures, Coverage Alerts
          </a>
          . Terms &amp; exclusions (incl. for pre-existing conditions) apply. Recommended/offered/
          sold by Allianz Partners. Underwriter: Jefferson Insurance Company. Plan incl. insurance
          &amp; assistance services. By clicking yes, you authorize Ticketmaster to send your name,
          address, and credit card information to Allianz Partners, who will charge your card ${fmtMoney(insurancePrice)} on the terms described above.
        </p>
      </div>
    </Card>
  );
}

function Reason({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tm-info-bg text-tm-text">
        {icon}
      </span>
      <span className="text-[16px] font-bold text-tm-text">{children}</span>
    </li>
  );
}

function Radio({ selected }: { selected: boolean }) {
  return (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
        selected ? "border-tm-blue" : "border-tm-muted/60"
      }`}
    >
      {selected && <span className="h-2.5 w-2.5 rounded-full bg-tm-blue" />}
    </span>
  );
}

/* ------------------------------ Totals ------------------------------ */

function TotalSection({
  total,
  ticketSubtotal,
  ticketUnit,
  ticketQty,
  fee,
  insurance,
  discount,
  promoApplied,
  agreed,
  setAgreed,
  onPlace,
}: {
  total: number;
  ticketSubtotal: number;
  ticketUnit: number;
  ticketQty: number;
  fee: number;
  insurance: number;
  discount: number;
  promoApplied: boolean;
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  onPlace: () => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-6 border-t border-tm-border/60 px-6 pb-8 pt-6">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between">
        <h2 className="relative text-[22px] font-bold uppercase tracking-[0.005em] text-tm-text">
          <span className="absolute -top-2 left-0 h-[3px] w-7 bg-tm-text" />
          Total
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-[22px] font-bold text-tm-text">${fmtMoney(total)}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-tm-text">
            {open ? (
              <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
            ) : (
              <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
            )}
          </span>
        </div>
      </button>

      {open && (
        <div className="mt-6 space-y-5">
          <div>
            <div className="text-[17px] font-bold text-tm-text">Tickets</div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[15px] text-tm-muted">
                <span>
                  Standard Ticket: ${fmtMoney(ticketUnit)} x {ticketQty}
                </span>
                <HelpCircle className="h-4 w-4 text-tm-muted" />
              </div>
              <div className="text-[15px] font-bold text-tm-text">
                ${fmtMoney(ticketSubtotal)}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[17px] font-bold text-tm-text">Fees</div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[15px] text-tm-muted">
                <span>Service Fee</span>
                <HelpCircle className="h-4 w-4 text-tm-muted" />
              </div>
              <div className="text-[15px] font-bold text-tm-text">${fmtMoney(fee)}</div>
            </div>
            {promoApplied && (
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[15px] font-bold text-tm-green">
                  <span>Student Discount</span>
                  <HelpCircle className="h-4 w-4 text-tm-green" />
                </div>
                <div className="text-[15px] font-bold text-tm-green">
                  −${fmtMoney(discount)}
                </div>
              </div>
            )}
          </div>

          {insurance > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-[15px] text-tm-muted">Ticket Insurance</div>
              <div className="text-[15px] font-bold text-tm-text">${fmtMoney(insurance)}</div>
            </div>
          )}
        </div>
      )}

      <p className="mt-6 text-[13px] font-bold text-tm-text">*All Sales Final - No Refunds</p>

      <label className="mt-5 flex items-start gap-3 text-[15px] leading-snug text-tm-text">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-tm-link"
        />
        <span>
          I have read and agree to the current{" "}
          <a className="text-tm-link underline underline-offset-2" href="#">
            Terms of Use
          </a>{" "}
          and{" "}
          <a className="text-tm-link underline underline-offset-2" href="#">
            Standard Purchase Policy
          </a>
          , including the arbitration agreement and class action waiver, updated in August 2025.
        </span>
      </label>

      <button
        onClick={onPlace}
        disabled={!agreed}
        className="mt-6 w-full rounded-sm bg-tm-green py-2.5 text-[17px] font-bold text-white transition active:bg-tm-green-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        Place Order
      </button>

      <p className="mt-3 text-[12px] font-bold text-tm-text">
        *Exceptions may apply, see our Terms of Use.
      </p>
    </div>

  );
}

/* ------------------------------- Page ------------------------------- */

const TICKET_UNIT = 230.00;
const TICKET_QTY = 2;
const SERVICE_FEE = 40.90;
const INSURANCE_PER_TICKET = 25.94;

function CheckoutPage() {
  const [promo, setPromo] = useState<string | null>(null);
  const [insurance, setInsurance] = useState<"yes" | "no" | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [placed, setPlaced] = useState(false);
  const { event, barcode } = useEventDates();

  const ticketSubtotal = TICKET_UNIT * TICKET_QTY;
  const insuranceTotal = INSURANCE_PER_TICKET * TICKET_QTY;
  const insuranceCharge = insurance === "yes" ? insuranceTotal : 0;
  const baseTotal = ticketSubtotal + SERVICE_FEE + insuranceCharge;
  const discount = promo ? baseTotal * 0.85 : 0;
  const total = Math.max(0, baseTotal - discount);

  return (
    <div className="min-h-screen bg-tm-bg">
      <TopBar />

      <main className="mx-auto max-w-[480px] px-2 pb-10 sm:px-3">
        <EventCard event={event} />
        <DeliveryCard barcode={barcode} />
        <PaymentCard promo={promo} setPromo={setPromo} />
        <InsuranceCard
          choice={insurance}
          setChoice={setInsurance}
          ticketTotal={baseTotal}
          insurancePrice={insuranceTotal}
          perTicket={INSURANCE_PER_TICKET}
          eventDate={event}
        />
        <TotalSection
          total={total}
          ticketSubtotal={ticketSubtotal}
          ticketUnit={TICKET_UNIT}
          ticketQty={TICKET_QTY}
          fee={SERVICE_FEE}
          insurance={insuranceCharge}
          discount={discount}
          promoApplied={!!promo}
          agreed={agreed}
          setAgreed={setAgreed}
          onPlace={() => {
            if (insurance === null) {
              alert("Please make a Ticket Insurance selection.");
              return;
            }
            setPlaced(true);
          }}
        />
      </main>

      {placed && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-md bg-tm-surface p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tm-green text-white">
              <Check className="h-7 w-7" strokeWidth={3} />
            </div>
            <h3 className="mt-4 text-[20px] font-bold">Order Placed</h3>
            <p className="mt-2 text-[14px] text-tm-muted">
              Total charged: <span className="font-bold text-tm-text">${fmtMoney(total)}</span>
            </p>
            <button
              onClick={() => setPlaced(false)}
              className="mt-5 w-full rounded-sm bg-tm-text py-3 text-[15px] font-bold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
