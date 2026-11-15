import React, { useState } from 'react';
import { Mail, Phone, Pencil, Trash2 } from 'lucide-react';

function ContactCard({ contact, onEdit, onDelete, isEditing }) {
  const [imgError, setImgError] = useState(false);

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    contact.fullName
  )}&background=4f46e5&color=fff&bold=true&size=128`;

  return (
    <article
      className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        isEditing
          ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md'
          : 'border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="px-5 py-5 flex-1 flex flex-col">
        {/* Photo & Actions */}
        <div className="flex items-end justify-between gap-2 mb-3">
          <img
            src={imgError || !contact.image ? fallbackAvatar : contact.image}
            alt={contact.fullName}
            onError={() => setImgError(true)}
            className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-slate-100"
          />

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(contact)}
              title="Modifier ce contact"
              aria-label={`Modifier ${contact.fullName}`}
              className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(contact.id)}
              title="Supprimer ce contact"
              aria-label={`Supprimer ${contact.fullName}`}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nom complet */}
        <h3 className="font-bold text-slate-900 text-lg leading-snug truncate mb-3">
          {contact.fullName}
        </h3>

        {/* Détails de contact */}
        <div className="space-y-2 text-sm text-slate-600 mt-auto pt-3 border-t border-slate-100">
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2.5 hover:text-indigo-600 transition truncate"
          >
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <Mail className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">{contact.email}</span>
          </a>

          <a
            href={`tel:${contact.phoneNumber}`}
            className="flex items-center gap-2.5 hover:text-emerald-600 transition truncate"
          >
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Phone className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">{contact.phoneNumber}</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export default ContactCard;
