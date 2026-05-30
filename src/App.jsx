import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Crown,
  Database,
  Eye,
  FileText,
  Home,
  Lock,
  MailCheck,
  MessageCircle,
  MonitorCog,
  Plus,
  ShieldCheck,
  Signal,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const countryDialCodes = [
  { country: "United Arab Emirates", code: "+971" },
  { country: "India", code: "+91" },
  { country: "United Kingdom", code: "+44" },
  { country: "Saudi Arabia", code: "+966" },
  { country: "Singapore", code: "+65" },
];

const defaultLegalDocs = [
  { id: 1, name: "Terms & Conditions", url: "https://tribe.com/terms", required: true, enabled: true, version: "v1.0" },
  { id: 2, name: "Privacy Policy", url: "https://tribe.com/privacy", required: true, enabled: true, version: "v1.0" },
  { id: 3, name: "Risk Disclosure", url: "https://tribe.com/risk-disclosure", required: true, enabled: true, version: "v1.0" },
  { id: 4, name: "Community Rules", url: "https://tribe.com/community-rules", required: true, enabled: false, version: "v1.0" },
];

function getDialCodeByCountry(country) {
  return countryDialCodes.find((item) => item.country === country)?.code || "+971";
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function SidebarButton({ icon: Icon, label, active }) {
  return (
    <button className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition ${active ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10"}`}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

function Stat({ icon: Icon, label, value, note }) {
  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardContent className="p-4">
        <Icon className="mb-3 h-5 w-5 text-emerald-300" />
        <p className="text-xs text-slate-400">{label}</p>
        <h3 className="mt-1 text-lg font-bold">{value}</h3>
        <p className="mt-1 text-[11px] text-emerald-300">{note}</p>
      </CardContent>
    </Card>
  );
}

function RegistrationPanel({ legalDocs, onSignup, addEvent, activeUser, setActiveUser }) {
  const detectedCountry = "United Arab Emirates";
  const [step, setStep] = useState("form");
  const [autoVerify, setAutoVerify] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phoneCode: getDialCodeByCountry(detectedCountry),
    phone: "",
    dob: "",
    country: detectedCountry,
    password: "",
    otp: "",
  });
  const [acceptedDocs, setAcceptedDocs] = useState({});

  const enabledDocs = legalDocs.filter((doc) => doc.enabled);
  const requiredDocsAccepted = enabledDocs.every((doc) => acceptedDocs[doc.id] || autoAccept);
  const formComplete = form.name && form.username && form.email && form.phone && form.dob && form.country && form.password && requiredDocsAccepted;

  const generateDummy = () => {
    const n = Math.floor(Math.random() * 9000) + 1000;
    const dummy = {
      name: `Demo Trader ${n}`,
      username: `demo${n}`,
      email: `demo${n}@tribe.test`,
      phoneCode: "+971",
      phone: `50${Math.floor(1000000 + Math.random() * 8999999)}`,
      dob: "1992-05-12",
      country: "United Arab Emirates",
      password: "Demo@12345",
      otp: "123456",
    };
    setForm(dummy);
    setAcceptedDocs(Object.fromEntries(enabledDocs.map((doc) => [doc.id, true])));
    addEvent("Dummy registration data filled");
  };

  const verify = (otpValue = form.otp) => {
    if (!otpValue || otpValue.length < 4) return;
    const newUser = {
      id: `USR-${Math.floor(100000 + Math.random() * 899999)}`,
      name: form.name,
      username: form.username,
      email: form.email,
      phone: `${form.phoneCode}${form.phone}`,
      phoneCode: form.phoneCode,
      dob: form.dob,
      country: form.country,
      status: "Active",
      emailVerified: true,
      phoneVerified: false,
      mt5Linked: false,
      kycStatus: "Not Started",
      score: 0,
      signupDate: new Date().toLocaleDateString(),
      acceptedDocs: enabledDocs.map((doc) => `${doc.name} ${doc.version}`),
    };
    onSignup(newUser);
    setActiveUser(newUser);
    setStep("done");
    addEvent("Email OTP verified");
    addEvent("Legal documents accepted");
    addEvent("User status changed to Active");
    addEvent("Client portal access granted");
    addEvent("User reflected in Admin Backend > Users");
  };

  const submit = () => {
    if (!formComplete) return;
    addEvent(`Signup submitted for ${form.email}`);
    addEvent("Email OTP sent");
    if (autoVerify) verify("123456");
    else setStep("otp");
  };

  const reset = () => {
    setStep("form");
    setForm({ name: "", username: "", email: "", phoneCode: "+971", phone: "", dob: "", country: detectedCountry, password: "", otp: "" });
    setAcceptedDocs({});
    setActiveUser(null);
    addEvent("Registration form reset");
  };

  return (
    <Card className="h-full border-emerald-400/20 bg-emerald-400/5 text-white">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-emerald-300">Panel 1</p>
            <h2 className="text-xl font-bold">Registration</h2>
            <p className="text-xs text-slate-400">Test signup, legal acceptance, and OTP.</p>
          </div>
          <UserPlus className="text-emerald-300" />
        </div>

        <div className="grid gap-2 rounded-2xl bg-slate-900 p-3 text-xs">
          <label className="flex items-center justify-between gap-2"><span>Auto verify OTP</span><input type="checkbox" checked={autoVerify} onChange={(e) => setAutoVerify(e.target.checked)} /></label>
          <label className="flex items-center justify-between gap-2"><span>Auto accept documents</span><input type="checkbox" checked={autoAccept} onChange={(e) => setAutoAccept(e.target.checked)} /></label>
        </div>

        {step === "done" ? (
          <div className="space-y-4 rounded-3xl bg-emerald-400/10 p-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-300" />
            <div>
              <h3 className="text-lg font-bold">Onboarding Completed</h3>
              <p className="text-sm text-slate-300">{activeUser?.name} can now access the client portal.</p>
            </div>
            <Button onClick={reset} className="w-full bg-white text-slate-950 hover:bg-slate-200">Test Another User</Button>
          </div>
        ) : step === "otp" ? (
          <div className="space-y-4 rounded-3xl bg-slate-900 p-4 text-center">
            <MailCheck className="mx-auto h-9 w-9 text-emerald-300" />
            <h3 className="font-bold">Email OTP Verification</h3>
            <p className="text-xs text-slate-400">Use any 4+ digits for this prototype.</p>
            <input value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-center text-lg tracking-[0.4em] outline-none" placeholder="000000" />
            <Button onClick={() => verify()} className="w-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">Verify & Enter Portal</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm outline-none" placeholder="Full name" />
              <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm outline-none" placeholder="Username" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm outline-none" placeholder="Email address" />
              <div className="flex overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                <select value={form.phoneCode} onChange={(e) => setForm({ ...form, phoneCode: e.target.value })} className="w-24 bg-slate-900 px-2 py-3 text-sm outline-none">
                  {countryDialCodes.map((item) => <option key={item.code} value={item.code}>{item.code}</option>)}
                </select>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-slate-900 px-3 py-3 text-sm outline-none" placeholder="Phone" />
              </div>
              <div className="relative">
                <input value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} type="date" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 pr-10 text-sm outline-none" />
                <CalendarDays className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" className="rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm outline-none" placeholder="Password" />
              <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value, phoneCode: getDialCodeByCountry(e.target.value) })} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm outline-none md:col-span-2">
                {countryDialCodes.map((item) => <option key={item.country}>{item.country}</option>)}
              </select>
            </div>

            <div className="rounded-2xl bg-slate-900 p-3">
              <h3 className="mb-2 text-sm font-semibold">Document Acceptance</h3>
              <div className="space-y-2">
                {enabledDocs.map((doc) => (
                  <label key={doc.id} className="flex gap-2 rounded-xl bg-white/5 p-2 text-xs">
                    <input type="checkbox" checked={!!acceptedDocs[doc.id] || autoAccept} disabled={autoAccept} onChange={(e) => setAcceptedDocs({ ...acceptedDocs, [doc.id]: e.target.checked })} />
                    <span>I accept <a className="text-emerald-300 underline" href={doc.url} target="_blank" rel="noreferrer">{doc.name}</a> <span className="text-slate-500">{doc.version}</span></span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={generateDummy} variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10"><Zap className="mr-2 h-4 w-4" /> Dummy Data</Button>
              <Button disabled={!formComplete} onClick={submit} className="bg-emerald-400 text-slate-950 hover:bg-emerald-300 disabled:opacity-40">Register</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ClientPortalPanel({ activeUser, addEvent }) {
  const [mt5Linked, setMt5Linked] = useState(false);
  const stats = activeUser ? [
    { label: "Status", value: activeUser.status, icon: ShieldCheck, note: "Community access granted" },
    { label: "Profile", value: mt5Linked ? "75%" : "45%", icon: UserCheck, note: mt5Linked ? "MT5 connected" : "MT5 pending" },
    { label: "Tribe Score", value: mt5Linked ? "84" : "0", icon: Crown, note: "Score after MT5 sync" },
    { label: "Notifications", value: "3", icon: Bell, note: "Welcome alerts" },
  ] : [];

  const connectMt5 = () => {
    setMt5Linked(true);
    addEvent("MT5 account linked in client portal");
    addEvent("User upgraded to Verified Trader");
  };

  return (
    <Card className="h-full border-sky-400/20 bg-sky-400/5 text-white">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-sky-300">Panel 2</p>
            <h2 className="text-xl font-bold">Client Portal</h2>
            <p className="text-xs text-slate-400">Shows automatically after onboarding.</p>
          </div>
          <Home className="text-sky-300" />
        </div>

        {!activeUser ? (
          <div className="flex min-h-[460px] items-center justify-center rounded-3xl bg-slate-900 p-6 text-center">
            <div>
              <Lock className="mx-auto mb-3 h-10 w-10 text-slate-500" />
              <h3 className="font-bold">No active user yet</h3>
              <p className="mt-1 text-sm text-slate-400">Complete registration to unlock the portal preview.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-slate-900 p-4">
              <p className="text-sm text-emerald-300">Welcome, @{activeUser.username}</p>
              <h3 className="text-2xl font-bold">{activeUser.name}</h3>
              <p className="text-sm text-slate-400">{activeUser.email} · {activeUser.country}</p>
            </motion.div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => <Stat key={item.label} {...item} />)}
            </div>

            <div className="grid gap-4 xl:grid-cols-[220px_1fr]">
              <div className="rounded-3xl bg-slate-900 p-4">
                <div className="space-y-1">
                  <SidebarButton icon={Home} label="Dashboard" active />
                  <SidebarButton icon={Users} label="Community" />
                  <SidebarButton icon={MessageCircle} label="Live Chat" />
                  <SidebarButton icon={Signal} label="Connect MT5" />
                  <SidebarButton icon={Crown} label="Leaderboard" />
                  <SidebarButton icon={Bot} label="AI Coach" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl bg-slate-900 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold">Connect MetaTrader 5</h3>
                      <p className="text-sm text-slate-400">Optional after signup. Required only for verified badge and rankings.</p>
                    </div>
                    <Button onClick={connectMt5} className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">{mt5Linked ? "Connected" : "Connect"}</Button>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900 p-4"><h3 className="font-bold">Community Feed</h3><p className="mt-2 text-sm text-slate-400">Gold structure is still bullish. Waiting for pullback confirmation.</p></div>
                  <div className="rounded-3xl bg-slate-900 p-4"><h3 className="font-bold">Live Chat</h3><p className="mt-2 text-sm text-slate-400">#Gold · Anyone watching Asian session high?</p></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdminBackendPanel({ users, legalDocs, setLegalDocs, activeUser, addEvent, seedDemo }) {
  const updateDoc = (id, key, value) => {
    setLegalDocs(legalDocs.map((doc) => doc.id === id ? { ...doc, [key]: value } : doc));
    addEvent(`Legal document ${key} updated`);
  };

  const addDoc = () => {
    setLegalDocs([...legalDocs, { id: Date.now(), name: "New Document", url: "https://", required: true, enabled: true, version: "v1.0" }]);
    addEvent("New legal document added in admin configuration");
  };

  return (
    <Card className="h-full border-violet-400/20 bg-violet-400/5 text-white">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-violet-300">Panel 3</p>
            <h2 className="text-xl font-bold">Admin Backend</h2>
            <p className="text-xs text-slate-400">Users and configurations update live.</p>
          </div>
          <MonitorCog className="text-violet-300" />
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <Stat icon={Users} label="Users" value={users.length} note="Total records" />
          <Stat icon={MailCheck} label="Active" value={users.filter((u) => u.status === "Active" || u.status === "Verified").length} note="Portal access" />
          <Stat icon={FileText} label="Enabled Docs" value={legalDocs.filter((d) => d.enabled).length} note="Signup acceptance" />
          <Stat icon={Database} label="MT5 Linked" value={users.filter((u) => u.mt5Linked).length} note="Verified traders" />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-3xl bg-slate-900 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold">Users</h3>
              <Button onClick={seedDemo} variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10"><Zap className="mr-2 h-4 w-4" /> Seed Demo</Button>
            </div>
            <div className="max-h-[330px] space-y-2 overflow-auto pr-1">
              {users.map((u) => (
                <div key={u.id || u.email} className={`rounded-2xl p-3 text-sm ${activeUser?.email === u.email ? "bg-emerald-400/10 ring-1 ring-emerald-400/40" : "bg-white/5"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{u.name} <span className="text-slate-500">@{u.username}</span></p>
                      <p className="text-xs text-slate-400">{u.email} · {u.phone}</p>
                      <p className="text-xs text-slate-500">{u.country} · DOB {u.dob}</p>
                    </div>
                    <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">{u.status}</span>
                  </div>
                  {u.acceptedDocs?.length ? <p className="mt-2 text-xs text-slate-500">Accepted: {u.acceptedDocs.join(", ")}</p> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold">Configurations: Legal Docs</h3>
              <Button onClick={addDoc} className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"><Plus className="mr-2 h-4 w-4" /> Add</Button>
            </div>
            <div className="max-h-[330px] space-y-2 overflow-auto pr-1">
              {legalDocs.map((doc) => (
                <div key={doc.id} className="grid gap-2 rounded-2xl bg-white/5 p-3">
                  <div className="grid gap-2 md:grid-cols-[1fr_80px]">
                    <input value={doc.name} onChange={(e) => updateDoc(doc.id, "name", e.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none" />
                    <input value={doc.version} onChange={(e) => updateDoc(doc.id, "version", e.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none" />
                  </div>
                  <input value={doc.url} onChange={(e) => updateDoc(doc.id, "url", e.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none" />
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => updateDoc(doc.id, "required", !doc.required)} className="flex items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs">{doc.required ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <AlertTriangle className="h-4 w-4 text-amber-300" />} Required</button>
                    <button onClick={() => updateDoc(doc.id, "enabled", !doc.enabled)} className="flex items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs">{doc.enabled ? <ToggleRight className="h-5 w-5 text-emerald-300" /> : <ToggleLeft className="h-5 w-5 text-slate-500" />} {doc.enabled ? "On" : "Off"}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DatabasePanel({ users, events }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="border-white/10 bg-white/5 text-white">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2"><Database className="h-5 w-5 text-emerald-300" /><h3 className="font-bold">Live Database Viewer: users</h3></div>
          <div className="max-h-72 overflow-auto rounded-2xl bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-800 text-slate-300"><tr><th className="p-3">ID</th><th className="p-3">Username</th><th className="p-3">Email</th><th className="p-3">Status</th><th className="p-3">Country</th></tr></thead>
              <tbody>{users.map((u) => <tr key={u.id || u.email} className="border-t border-white/5"><td className="p-3">{u.id}</td><td className="p-3">{u.username}</td><td className="p-3">{u.email}</td><td className="p-3 text-emerald-300">{u.status}</td><td className="p-3">{u.country}</td></tr>)}</tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card className="border-white/10 bg-white/5 text-white">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2"><Eye className="h-5 w-5 text-emerald-300" /><h3 className="font-bold">System Events</h3></div>
          <div className="max-h-72 space-y-2 overflow-auto rounded-2xl bg-slate-900 p-3 text-xs">
            {events.map((event, index) => <div key={index} className="rounded-xl bg-white/5 p-2"><span className="text-emerald-300">{event.time}</span> · {event.message}</div>)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TribeMVP() {
  const [view, setView] = useState("sandbox");
  const [legalDocs, setLegalDocs] = useState(defaultLegalDocs);
  const [users, setUsers] = useState([
    { id: "USR-100001", name: "Mayur", username: "mayurfx", phone: "+971500000000", phoneCode: "+971", email: "mayur@example.com", dob: "1991-01-15", country: "United Arab Emirates", status: "Verified", emailVerified: true, phoneVerified: true, mt5Linked: true, kycStatus: "Not Started", score: 84, signupDate: "Today", acceptedDocs: ["Terms & Conditions v1.0", "Privacy Policy v1.0", "Risk Disclosure v1.0"] },
  ]);
  const [activeUser, setActiveUser] = useState(null);
  const [events, setEvents] = useState([{ time: nowTime(), message: "Developer Sandbox loaded" }]);

  const addEvent = (message) => setEvents((prev) => [{ time: nowTime(), message }, ...prev].slice(0, 60));
  const onSignup = (newUser) => setUsers((prev) => [newUser, ...prev.filter((u) => u.email !== newUser.email)]);

  const seedDemo = () => {
    const demo = Array.from({ length: 8 }).map((_, i) => {
      const id = Math.floor(200000 + Math.random() * 799999);
      const country = countryDialCodes[i % countryDialCodes.length].country;
      return {
        id: `USR-${id}`,
        name: `Demo Trader ${i + 1}`,
        username: `trader${id}`,
        email: `trader${id}@tribe.test`,
        phone: `${getDialCodeByCountry(country)}50${id}`,
        phoneCode: getDialCodeByCountry(country),
        dob: `199${i % 9}-0${(i % 8) + 1}-15`,
        country,
        status: i % 3 === 0 ? "Verified" : "Active",
        emailVerified: true,
        phoneVerified: i % 2 === 0,
        mt5Linked: i % 3 === 0,
        kycStatus: "Not Started",
        score: i % 3 === 0 ? 70 + i : 0,
        signupDate: "Today",
        acceptedDocs: legalDocs.filter((d) => d.enabled).map((d) => `${d.name} ${d.version}`),
      };
    });
    setUsers((prev) => [...demo, ...prev]);
    addEvent("8 demo users seeded into users table");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1900px] items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-950 font-black">T</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Tribe Developer Sandbox</h1>
              <p className="text-xs text-slate-400">Registration · Client Portal · Admin Backend · Database · Events</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            {[
              ["sandbox", "Sandbox"],
              ["registration", "Registration"],
              ["portal", "Client Portal"],
              ["admin", "Admin"],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setView(key)} className={`rounded-xl px-3 py-2 text-sm ${view === key ? "bg-emerald-400 text-slate-950" : "bg-white/5 text-slate-300"}`}>{label}</button>
            ))}
            <Button onClick={seedDemo} variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10"><Zap className="mr-2 h-4 w-4" /> Add Dummy</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1900px] space-y-4 px-5 py-5">
        {view === "sandbox" && (
          <>
            <div className="grid gap-4 2xl:grid-cols-3">
              <RegistrationPanel legalDocs={legalDocs} onSignup={onSignup} addEvent={addEvent} activeUser={activeUser} setActiveUser={setActiveUser} />
              <ClientPortalPanel activeUser={activeUser} addEvent={addEvent} />
              <AdminBackendPanel users={users} legalDocs={legalDocs} setLegalDocs={setLegalDocs} activeUser={activeUser} addEvent={addEvent} seedDemo={seedDemo} />
            </div>
            <DatabasePanel users={users} events={events} />
          </>
        )}
        {view === "registration" && <RegistrationPanel legalDocs={legalDocs} onSignup={onSignup} addEvent={addEvent} activeUser={activeUser} setActiveUser={setActiveUser} />}
        {view === "portal" && <ClientPortalPanel activeUser={activeUser} addEvent={addEvent} />}
        {view === "admin" && <AdminBackendPanel users={users} legalDocs={legalDocs} setLegalDocs={setLegalDocs} activeUser={activeUser} addEvent={addEvent} seedDemo={seedDemo} />}
        {view !== "sandbox" && <DatabasePanel users={users} events={events} />}
      </main>
    </div>
  );
}
