'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { AlertCircle, ArrowUpRight, CheckCircle2, LoaderCircle, Mail, MapPin, Phone } from 'lucide-react';

export type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  message: string;
  privacyAgreed: boolean;
  product?: { id: string; name: string };
};

type Fields = Omit<ContactFormData, 'product'>;
type Errors = Partial<Record<keyof Fields, string>>;

export const contactCopy = {
  heading: 'Contact Us',
  description: 'Our friendly team would love to hear from you.',
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  countryCode: 'Country code',
  phoneNumber: 'Phone Number',
  optional: '(optional)',
  message: 'Message',
  firstNamePlaceholder: 'First name',
  lastNamePlaceholder: 'Last name',
  emailPlaceholder: 'you@company.com',
  phonePlaceholder: '0812 3456 7890',
  messagePlaceholder: 'Tell us about the products or support you need…',
  privacyPrefix: 'I agree to the',
  privacyLink: 'privacy policy',
  send: 'Send Message',
  sending: 'Sending…',
  requiredNote: '* Required fields',
  openMap: 'Open in Google Maps',
  mapTitle: 'Interactive location map',
  locationNote: 'Peta menunjukkan perkiraan area alamat; titik bangunan belum diverifikasi.',
  addressPlaceholder: 'Business address to be added',
  emailPlaceholderInfo: 'Business email to be added',
  phonePlaceholderInfo: 'Business phone to be added',
  mapPlaceholder: 'Location map to be added.',
  previewNotice: 'Preview form · use sample details. No email will be sent.',
  previewStatus: 'Your message has been validated. This is a preview; nothing has been sent.',
  successStatus: 'Pesan berhasil disimpan. Tim kami akan menindaklanjutinya.',
  errorStatus: 'Pesan belum tersimpan. Data Anda tetap ada di formulir; silakan coba lagi.',
  invalidStatus: 'Please check the highlighted fields.',
  firstNameRequired: 'Enter your first name.',
  lastNameRequired: 'Enter your last name.',
  emailRequired: 'Enter a valid email address.',
  phoneInvalid: 'Enter a phone number with 7–15 digits, including the country code.',
  messageRequired: 'Enter a message with at least 10 characters.',
  privacyRequired: 'Please agree to the privacy policy before continuing.',
  aboutProduct: 'Regarding',
};

type Copy = typeof contactCopy;

export type ContactWithMapProps = {
  id?: string;
  businessName?: string;
  address?: string;
  area?: string;
  email?: string;
  phone?: string;
  mapsEmbedUrl?: string;
  mapsUrl?: string;
  locationIsApproximate?: boolean;
  privacyPolicyUrl?: string;
  defaultCountryCode?: string;
  countryCodes?: { value: string; label: string }[];
  copy?: Partial<Copy>;
  product?: ContactFormData['product'];
  /** Connect an API here. Resolve only after the API accepts the message; reject on failure. */
  onSubmit?: (values: ContactFormData) => Promise<void> | void;
  /** Optional existing prototype integration. Never implies delivery to the business. */
  onPreviewSubmit?: (values: ContactFormData) => void;
};

const countryOptions = [
  { value: '+62', label: 'ID +62' },
  { value: '+60', label: 'MY +60' },
  { value: '+65', label: 'SG +65' },
  { value: '+61', label: 'AU +61' },
  { value: '+44', label: 'UK +44' },
  { value: '+1', label: 'US/CA +1' },
];

function validate(values: Fields, copy: Copy): Errors {
  const errors: Errors = {};
  if (!values.firstName.trim()) errors.firstName = copy.firstNameRequired;
  if (!values.lastName.trim()) errors.lastName = copy.lastNameRequired;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = copy.emailRequired;
  if (values.phoneNumber.trim()) {
    const digits = values.phoneNumber.replace(/\D/g, '').replace(/^0+/, '');
    const totalLength = values.countryCode.replace(/\D/g, '').length + digits.length;
    if (!/^[\d\s().-]+$/.test(values.phoneNumber) || totalLength < 7 || totalLength > 15) {
      errors.phoneNumber = copy.phoneInvalid;
    }
  }
  if (values.message.trim().length < 10) errors.message = copy.messageRequired;
  if (!values.privacyAgreed) errors.privacyAgreed = copy.privacyRequired;
  return errors;
}

const inputStyle = 'mt-2 block w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-base leading-6 text-slate-900 shadow-xs outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-brand focus:ring-3 focus:ring-brand/15 disabled:cursor-wait disabled:bg-slate-50 aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/15';
const labelStyle = 'mb-0 block text-sm font-medium leading-5 text-slate-700';
const focusStyle = 'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand/30 focus-visible:ring-offset-2';

export function ContactWithMap({
  id = 'contact-section',
  businessName = 'Your business name',
  address = '',
  area = '',
  email = '',
  phone = '',
  mapsEmbedUrl = '',
  mapsUrl = '',
  locationIsApproximate = false,
  privacyPolicyUrl = '#privacy',
  defaultCountryCode = '+62',
  countryCodes = countryOptions,
  copy: customCopy,
  product,
  onSubmit,
  onPreviewSubmit,
}: ContactWithMapProps) {
  const copy = { ...contactCopy, ...customCopy };
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const busyRef = useRef(false);
  const [values, setValues] = useState<Fields>({
    firstName: '', lastName: '', email: '', countryCode: defaultCountryCode,
    phoneNumber: '', message: '', privacyAgreed: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'invalid' | 'preview' | 'success' | 'error'>('idle');

  function update<K extends keyof Fields>(field: K, value: Fields[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field]) setErrors({ ...errors, [field]: validate(next, copy)[field] });
    if (status !== 'idle') setStatus('idle');
  }

  function error(field: keyof Fields) {
    return errors[field] ? <p id={`${uid}-${field}-error`} className="mt-1.5 mb-0 text-sm leading-5 text-red-700">{errors[field]}</p> : null;
  }

  function attributes(field: keyof Fields) {
    return {
      id: `${uid}-${field}`,
      name: field,
      'aria-invalid': Boolean(errors[field]),
      'aria-describedby': errors[field] ? `${uid}-${field}-error` : undefined,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;
    const nextErrors = validate(values, copy);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus('invalid');
      const firstInvalid = formRef.current?.elements.namedItem(Object.keys(nextErrors)[0]);
      if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
      return;
    }
    const payload: ContactFormData = {
      ...values,
      firstName: values.firstName.trim(), lastName: values.lastName.trim(),
      email: values.email.trim(), phoneNumber: values.phoneNumber.trim(),
      message: values.message.trim(), ...(product ? { product } : {}),
    };
    if (!onSubmit) {
      onPreviewSubmit?.(payload);
      setStatus('preview');
      return;
    }
    busyRef.current = true;
    setIsSubmitting(true);
    setStatus('idle');
    try {
      await onSubmit(payload);
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      busyRef.current = false;
      setIsSubmitting(false);
    }
  }

  const statusMessage = {
    idle: '', invalid: copy.invalidStatus, preview: copy.previewStatus,
    success: copy.successStatus, error: copy.errorStatus,
  }[status];

  return (
    <section id={id} tabIndex={-1} lang="en" aria-labelledby={`${uid}-heading`} className="bg-slate-50 px-4 py-14 font-sans outline-none sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_16px_60px_-32px_rgba(15,23,42,0.3)] lg:grid-cols-2">
        <div className="min-w-0 px-6 py-8 sm:p-10 lg:p-12">
          <h2 id={`${uid}-heading`} className="m-0 text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">{copy.heading}</h2>
          <p className="mt-3 mb-0 text-base leading-7 text-slate-500">{copy.description}</p>
          <p className="mt-5 mb-0 text-xs leading-5 text-slate-500">{copy.requiredNote}</p>
          {product && <p className="mt-3 mb-0 rounded-lg bg-brand/5 px-3 py-2 text-sm leading-6 text-brand">{copy.aboutProduct}: {product.name}</p>}

          <form ref={formRef} noValidate onSubmit={handleSubmit} aria-busy={isSubmitting} className="mt-5">
            <fieldset disabled={isSubmitting} className="m-0 min-w-0 space-y-5 border-0 p-0">
              <legend className="sr-only">{copy.heading}</legend>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="min-w-0">
                  <label htmlFor={`${uid}-firstName`} className={labelStyle}>{copy.firstName} <span aria-hidden="true" className="text-brand">*</span></label>
                  <input {...attributes('firstName')} required autoComplete="given-name" maxLength={100} value={values.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder={copy.firstNamePlaceholder} className={inputStyle} />
                  {error('firstName')}
                </div>
                <div className="min-w-0">
                  <label htmlFor={`${uid}-lastName`} className={labelStyle}>{copy.lastName} <span aria-hidden="true" className="text-brand">*</span></label>
                  <input {...attributes('lastName')} required autoComplete="family-name" maxLength={100} value={values.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder={copy.lastNamePlaceholder} className={inputStyle} />
                  {error('lastName')}
                </div>
              </div>
              <div>
                <label htmlFor={`${uid}-email`} className={labelStyle}>{copy.email} <span aria-hidden="true" className="text-brand">*</span></label>
                <input {...attributes('email')} required type="email" autoComplete="email" inputMode="email" maxLength={254} value={values.email} onChange={(e) => update('email', e.target.value)} placeholder={copy.emailPlaceholder} className={inputStyle} />
                {error('email')}
              </div>
              <div>
                <label htmlFor={`${uid}-phoneNumber`} className={labelStyle}>{copy.phoneNumber} <span className="font-normal text-slate-500">{copy.optional}</span></label>
                <div className="mt-2 flex min-w-0 gap-0 rounded-lg border border-slate-300 bg-white shadow-xs transition focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/15 data-[invalid=true]:border-red-500" data-invalid={Boolean(errors.phoneNumber)}>
                  <label className="sr-only" htmlFor={`${uid}-countryCode`}>{copy.countryCode}</label>
                  <select id={`${uid}-countryCode`} name="countryCode" autoComplete="tel-country-code" value={values.countryCode} onChange={(e) => update('countryCode', e.target.value)} className={`m-0 w-28 shrink-0 rounded-l-lg rounded-r-none border-0 border-r border-slate-200 bg-transparent py-3 pr-1 pl-3 text-sm text-slate-700 ${focusStyle}`}>
                    {countryCodes.map((country) => <option key={country.value} value={country.value}>{country.label}</option>)}
                  </select>
                  <input {...attributes('phoneNumber')} type="tel" inputMode="tel" autoComplete="tel-national" maxLength={25} value={values.phoneNumber} onChange={(e) => update('phoneNumber', e.target.value)} placeholder={copy.phonePlaceholder} className="m-0 block w-full min-w-0 rounded-l-none rounded-r-lg border-0 bg-transparent px-3 py-3 text-base leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-inset" />
                </div>
                {error('phoneNumber')}
              </div>
              <div>
                <label htmlFor={`${uid}-message`} className={labelStyle}>{copy.message} <span aria-hidden="true" className="text-brand">*</span></label>
                <textarea {...attributes('message')} required minLength={10} maxLength={5000} rows={4} value={values.message} onChange={(e) => update('message', e.target.value)} placeholder={copy.messagePlaceholder} className={`${inputStyle} min-h-32 resize-y`} />
                {error('message')}
              </div>
              <div>
                <div className="flex items-start gap-3">
                  <input {...attributes('privacyAgreed')} type="checkbox" required checked={values.privacyAgreed} onChange={(e) => update('privacyAgreed', e.target.checked)} className={`mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 p-0 accent-brand ${focusStyle}`} />
                  <label htmlFor={`${uid}-privacyAgreed`} className="mb-0 inline text-sm font-normal leading-6 text-slate-600">
                    {copy.privacyPrefix} <a href={privacyPolicyUrl} className={`rounded-sm text-brand underline decoration-brand/40 underline-offset-4 transition hover:decoration-brand ${focusStyle}`}>{copy.privacyLink}</a>. <span aria-hidden="true" className="text-brand">*</span>
                  </label>
                </div>
                {error('privacyAgreed')}
              </div>
              <button type="submit" disabled={isSubmitting} className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-0 bg-brand px-5 py-3 text-base font-semibold leading-6 text-white shadow-xs transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60 ${focusStyle}`}>
                {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
                {isSubmitting ? copy.sending : copy.send}
              </button>
            </fieldset>
            {!onSubmit && <p className="mt-3 mb-0 text-xs leading-5 text-slate-500">{copy.previewNotice}</p>}
            <div role="status" aria-live="polite" aria-atomic="true">
              {statusMessage && <p className={`mt-4 mb-0 flex items-start gap-2 rounded-lg border px-3 py-3 text-sm leading-6 ${status === 'invalid' || status === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-brand/20 bg-brand/5 text-brand'}`}>
                {status === 'error' || status === 'invalid' ? <AlertCircle className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" /> : <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />}
                {statusMessage}
              </p>}
            </div>
          </form>

          <div className="mt-7 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-500">
            <div className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />{email ? <a href={`mailto:${email}`} className={`break-all text-brand ${focusStyle}`}>{email}</a> : <span>{copy.emailPlaceholderInfo}</span>}</div>
            <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />{phone ? <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className={`text-brand ${focusStyle}`}>{phone}</a> : <span>{copy.phonePlaceholderInfo}</span>}</div>
          </div>
        </div>

        <div className="relative min-h-[440px] min-w-0 overflow-hidden rounded-b-3xl border-t border-slate-200 bg-slate-100 lg:min-h-full lg:rounded-l-none lg:rounded-r-3xl lg:border-t-0 lg:border-l">
          {mapsEmbedUrl ? <iframe title={`${copy.mapTitle} — ${locationIsApproximate ? area : businessName}`} src={mapsEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="absolute inset-0 h-full w-full border-0" /> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-10 text-center text-slate-500"><MapPin className="h-8 w-8 text-brand" aria-hidden="true" /><p>{copy.mapPlaceholder}</p></div>}
          {mapsUrl && <a href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`${copy.openMap} (opens in a new tab)`} className={`absolute top-5 right-5 z-10 inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 hover:text-brand ${focusStyle}`}>
            {copy.openMap}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>}
          <div className="pointer-events-none absolute right-5 bottom-12 left-5 z-10 flex items-start gap-3 rounded-xl border border-white/70 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:right-6 sm:left-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"><MapPin className="h-5 w-5" aria-hidden="true" /></span>
            <div className="min-w-0">
              <p className="m-0 text-sm font-semibold leading-5 text-slate-900">{businessName}</p>
              <p className="mt-1 mb-0 text-sm leading-5 text-slate-600">{address || area || copy.addressPlaceholder}</p>
              {locationIsApproximate && <p className="mt-2 mb-0 text-xs leading-5 text-slate-500">{copy.locationNote}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
