"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const steps = [
  { id: 1, label: "Account Info", icon: "👤" },
  { id: 2, label: "Business Details", icon: "🏢" },
  { id: 3, label: "Bank & Tax", icon: "🏦" },
  { id: 4, label: "Verification", icon: "✅" },
];

const inp =
  "w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm transition-all";
const lbl = "text-sm font-semibold mb-1.5 block text-black/80 dark:text-white/80";

export default function SellerRegisterPage() {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPassword: "",
    businessName: "", businessType: "", businessAddress: "", city: "",
    state: "Bihar", pincode: "", category: "", yearsInBusiness: "",
    websiteUrl: "", description: "",
    panNumber: "", gstNumber: "", bankAccountNumber: "", ifscCode: "",
    bankName: "", accountHolderName: "",
    idType: "aadhaar", idNumber: "",
  });
  const set = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!agreed) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: "seller",
          // Extra seller details
          shopName: form.businessName,
          description: form.description,
          businessAddress: `${form.businessAddress}, ${form.city}, ${form.state} - ${form.pincode}`,
          taxId: form.gstNumber || form.panNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
      setStep(1); // Go back to first step to fix errors
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6 text-5xl">🎉</div>
            <h1 className="text-3xl font-bold mb-3">Application Submitted!</h1>
            <p className="text-black/60 dark:text-white/60 mb-4 leading-relaxed">
              Your application for <strong>{form.businessName}</strong> is under review. We will respond within <strong>2–3 business days</strong> at <strong>{form.email}</strong>.
            </p>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl text-sm text-amber-800 dark:text-amber-300 mb-6">
              💡 While waiting, list products instantly via WhatsApp at <strong>+91-9876543210</strong>!
            </div>
            <Link href="/seller" className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              Go to Dashboard
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <div className="max-w-4xl mx-auto w-full px-4 py-10">

        {/* Hero */}
        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">🏪</span>
          <h1 className="text-3xl font-bold mb-2">Start Selling on Bihar eKart</h1>
          <p className="text-black/50 dark:text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
            Join thousands of local artisans. We verify every seller to ensure a safe marketplace.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-10 px-2 relative">
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-black/10 dark:bg-white/10 z-0" />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 ${
                step >= s.id ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-white dark:bg-zinc-900 border-black/10 dark:border-white/10 text-black/30 dark:text-white/30"
              }`}>
                {step > s.id ? "✓" : s.icon}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${step >= s.id ? "text-amber-600 dark:text-amber-400" : "text-black/30 dark:text-white/30"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-black/8 dark:border-white/8 rounded-2xl p-8 shadow-sm">

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-6">👤 Account Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={lbl}>Full Name *</label><input className={inp} placeholder="As per government ID" value={form.fullName} onChange={e => set("fullName", e.target.value)} /></div>
                <div><label className={lbl}>Email Address *</label><input type="email" className={inp} placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} /></div>
                <div>
                  <label className={lbl}>Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-black/50">+91</span>
                    <input className={inp + " pl-12"} placeholder="10-digit number" value={form.phone} onChange={e => set("phone", e.target.value)} maxLength={10} />
                  </div>
                  <p className="text-xs text-black/40 mt-1">This will be your WhatsApp listing number</p>
                </div>
                <div><label className={lbl}>Password *</label><input type="password" className={inp} placeholder="Min. 8 characters" value={form.password} onChange={e => set("password", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Confirm Password *</label><input type="password" className={inp} placeholder="Re-enter password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} /></div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-6">🏢 Business Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={lbl}>Business / Shop Name *</label><input className={inp} placeholder="e.g. Patna Crafts House" value={form.businessName} onChange={e => set("businessName", e.target.value)} /></div>
                <div>
                  <label className={lbl}>Business Type *</label>
                  <select className={inp} value={form.businessType} onChange={e => set("businessType", e.target.value)}>
                    <option value="">Select type</option>
                    <option>Individual / Artisan</option>
                    <option>Sole Proprietorship</option>
                    <option>Partnership Firm</option>
                    <option>Private Limited Company</option>
                    <option>Self-Help Group (SHG)</option>
                  </select>
                </div>
                <div className="sm:col-span-2"><label className={lbl}>Business Address *</label><input className={inp} placeholder="Street, village, tehsil" value={form.businessAddress} onChange={e => set("businessAddress", e.target.value)} /></div>
                <div><label className={lbl}>City / District *</label><input className={inp} placeholder="e.g. Patna" value={form.city} onChange={e => set("city", e.target.value)} /></div>
                <div>
                  <label className={lbl}>State *</label>
                  <select className={inp} value={form.state} onChange={e => set("state", e.target.value)}>
                    <option>Bihar</option><option>Jharkhand</option><option>Uttar Pradesh</option><option>West Bengal</option>
                  </select>
                </div>
                <div><label className={lbl}>Pincode *</label><input className={inp} placeholder="6-digit pincode" value={form.pincode} onChange={e => set("pincode", e.target.value)} maxLength={6} /></div>
                <div>
                  <label className={lbl}>Primary Category *</label>
                  <select className={inp} value={form.category} onChange={e => set("category", e.target.value)}>
                    <option value="">Select category</option>
                    <option>Mithila Art & Paintings</option>
                    <option>Handlooms & Textiles</option>
                    <option>Spices & Condiments</option>
                    <option>Sweets & Food Products</option>
                    <option>Handicrafts & Pottery</option>
                    <option>Agricultural Products</option>
                    <option>Jewellery & Accessories</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Years in Business</label>
                  <select className={inp} value={form.yearsInBusiness} onChange={e => set("yearsInBusiness", e.target.value)}>
                    <option value="">Select range</option>
                    <option>Less than 1 year</option><option>1–3 years</option><option>3–5 years</option><option>5–10 years</option><option>More than 10 years</option>
                  </select>
                </div>
                <div><label className={lbl}>Website / Social Media (Optional)</label><input className={inp} placeholder="https://instagram.com/yourshop" value={form.websiteUrl} onChange={e => set("websiteUrl", e.target.value)} /></div>
                <div className="sm:col-span-2">
                  <label className={lbl}>Describe Your Business *</label>
                  <textarea className={inp + " resize-none"} rows={4} placeholder="Describe your products, craftsmanship, and what makes you unique..." value={form.description} onChange={e => set("description", e.target.value)} />
                  <p className="text-xs text-black/40 mt-1">{form.description.length}/500 characters</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-3">🏦 Bank & Tax Information</h2>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 text-sm text-blue-800 dark:text-blue-300 mb-5">
                🔒 All financial data is encrypted. Used only for transferring your earnings.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>PAN Number *</label>
                  <input className={inp + " uppercase"} placeholder="ABCDE1234F" value={form.panNumber} onChange={e => set("panNumber", e.target.value.toUpperCase())} maxLength={10} />
                  <p className="text-xs text-black/40 mt-1">Mandatory for all sellers for tax compliance.</p>
                </div>
                <div>
                  <label className={lbl}>GSTIN (Optional)</label>
                  <input className={inp + " uppercase"} placeholder="22AAAAA0000A1Z5" value={form.gstNumber} onChange={e => set("gstNumber", e.target.value.toUpperCase())} maxLength={15} />
                  <p className="text-xs text-black/40 mt-1">Required if turnover exceeds ₹40 Lakh.</p>
                </div>
                <div className="sm:col-span-2"><label className={lbl}>Account Holder Name *</label><input className={inp} placeholder="As per bank records" value={form.accountHolderName} onChange={e => set("accountHolderName", e.target.value)} /></div>
                <div><label className={lbl}>Bank Account Number *</label><input type="password" className={inp} placeholder="Enter account number" value={form.bankAccountNumber} onChange={e => set("bankAccountNumber", e.target.value)} /></div>
                <div><label className={lbl}>Confirm Account Number *</label><input className={inp} placeholder="Re-enter to confirm" /></div>
                <div>
                  <label className={lbl}>IFSC Code *</label>
                  <input className={inp + " uppercase"} placeholder="SBIN0001234" value={form.ifscCode} onChange={e => set("ifscCode", e.target.value.toUpperCase())} maxLength={11} />
                </div>
                <div><label className={lbl}>Bank Name *</label><input className={inp} placeholder="e.g. State Bank of India" value={form.bankName} onChange={e => set("bankName", e.target.value)} /></div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-3">✅ Identity Verification</h2>
              <p className="text-sm text-black/50 dark:text-white/50 mb-5">Every seller is verified to ensure safety. Please provide a valid government ID.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>ID Type *</label>
                  <select className={inp} value={form.idType} onChange={e => set("idType", e.target.value)}>
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="voter">Voter ID</option>
                    <option value="passport">Passport</option>
                    <option value="driving">Driving License</option>
                  </select>
                </div>
                <div><label className={lbl}>ID Number *</label><input className={inp} placeholder="Enter ID number" value={form.idNumber} onChange={e => set("idNumber", e.target.value)} /></div>
                <div className="sm:col-span-2">
                  <label className={lbl}>Upload Front of ID *</label>
                  <div className="border-2 border-dashed border-black/15 dark:border-white/15 rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 transition-colors">
                    <span className="text-3xl block mb-2">📄</span>
                    <p className="text-sm text-black/50 dark:text-white/50">Click to upload or drag & drop</p>
                    <p className="text-xs text-black/30 dark:text-white/30 mt-1">JPG, PNG or PDF · Max 5MB</p>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}>Upload Back of ID (if applicable)</label>
                  <div className="border-2 border-dashed border-black/15 dark:border-white/15 rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 transition-colors">
                    <span className="text-3xl block mb-2">📄</span>
                    <p className="text-sm text-black/50 dark:text-white/50">Click to upload or drag & drop</p>
                    <p className="text-xs text-black/30 dark:text-white/30 mt-1">JPG, PNG or PDF · Max 5MB</p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-black/8 dark:border-white/8 text-sm">
                <h3 className="font-bold mb-3">📋 Application Summary</h3>
                <div className="grid grid-cols-2 gap-y-2 text-black/70 dark:text-white/70">
                  <span className="font-medium">Name:</span><span>{form.fullName || "—"}</span>
                  <span className="font-medium">Email:</span><span>{form.email || "—"}</span>
                  <span className="font-medium">Business:</span><span>{form.businessName || "—"}</span>
                  <span className="font-medium">Category:</span><span>{form.category || "—"}</span>
                  <span className="font-medium">PAN:</span><span>{form.panNumber ? "••••••" + form.panNumber.slice(-4) : "—"}</span>
                  <span className="font-medium">Bank:</span><span>{form.bankName || "—"}</span>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer mt-5">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 accent-amber-500 w-4 h-4" />
                <span className="text-sm text-black/60 dark:text-white/60">
                  I agree to the Bihar eKart{" "}
                  <Link href="#" className="text-amber-600 hover:underline">Seller Terms</Link>,{" "}
                  <Link href="#" className="text-amber-600 hover:underline">Privacy Policy</Link>, and confirm all information is accurate. False information may lead to permanent suspension.
                </span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-black/8 dark:border-white/8">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 1}
              className="px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              ← Back
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-black/40 dark:text-white/40">Step {step} of 4</span>
              {step < 4 ? (
                <button onClick={() => setStep(s => s + 1)}
                  className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors shadow-lg shadow-amber-500/25">
                  Continue →
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={!agreed || loading}
                  className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors shadow-lg shadow-green-600/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                  {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {loading ? "Submitting..." : "🚀 Submit Application"}
                </button>
              )}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-4 text-center font-medium animate-shake">{error}</p>}
        </div>

        <p className="text-center text-sm mt-6 text-black/50 dark:text-white/50">
          Already a seller?{" "}
          <Link href="/login" className="text-amber-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}
