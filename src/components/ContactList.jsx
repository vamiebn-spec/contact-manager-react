import React from 'react';
import ContactCard from './ContactCard';
import { Users } from 'lucide-react';

function ContactList({ contacts, onEdit, onDelete, editingContactId, searchQuery }) {
  if (contacts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          {searchQuery ? 'Aucun contact trouvé' : 'Votre répertoire est vide'}
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          {searchQuery
            ? `Aucun contact ne correspond à « ${searchQuery} ». Essayez un autre nom.`
            : 'Ajoutez votre premier contact personnel ou professionnel à l’aide du formulaire.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
          isEditing={editingContactId === contact.id}
        />
      ))}
    </div>
  );
}

export default ContactList;
